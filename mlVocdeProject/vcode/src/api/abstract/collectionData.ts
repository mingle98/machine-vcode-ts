import { ListenEventArrStore } from '../../enum/enum';
import {
  CollectionDataOptions,
  CollectionDataStore,
  GatherEventStore,
  PostData
} from '../../interface/collectionData';
import utils from '../../utils';
import { Base } from '../components/base/base';
import VcodeWrapper from '../wrapper';
import globalConfig from '../../config/config';

export default abstract class CollectionData {
  abstract name: string;
  protected baseCls = new Base();
  protected parentComponent!: VcodeWrapper;
  protected collectionDataStore: CollectionDataStore = {
    collectionCount: 0,
    // 别动采集上报的阈值
    shouldPostNum: 50,
    verifyData: {
      rzData: {
        cl: [],
        mv: [],
        sc: [],
        kb: [],
        sb: [],
        sd: [],
        sm: [],
        cr: this.getScreenInfo()!,
        simu: window.navigator.webdriver ? 1 : 0,
        ac_c: 0,
        ua: window.navigator.userAgent,
        // token
        tk: ''
      }
    },
    postUrl: globalConfig.collectionDataConfig.openLocalUrl
      ? globalConfig.collectionDataConfig.localpostUrl
      : globalConfig.collectionDataConfig.postUrl,
    postInitUrl: globalConfig.collectionDataConfig.openLocalUrl
      ? globalConfig.collectionDataConfig.localpostInitUrl
      : globalConfig.collectionDataConfig.postInitUrl,
    // 是否初始化成功
    postInitDataOk: false
  };
  // 用户自定义数据后端接口
  protected customCollectionDataOptios!: CollectionDataOptions;
  // 是否完成采集动作库
  protected initedEventFnStoreFlag: boolean = false;
  protected listenEventArr: (keyof typeof ListenEventArrStore)[] = [
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mouseup',
    'mousemove',
    'mouseover',
    'mousewheel',
    'click',
    'touch',
    'touchstart',
    'touchmove',
    'touchend'
  ];
  constructor(options: CollectionDataOptions, parentInstance: VcodeWrapper) {
    this.parentComponent = parentInstance;
    if (!parentInstance.vcodeWrapperStore.serverVerify) return;
    // console.log('parent:', parentInstance);
    this.customCollectionDataOptios = options;
    this.init(options);
  }
  protected init(options?: CollectionDataOptions) {
    this.initData(options);
  }
  protected initData(options?: CollectionDataOptions) {
    // console.log('CollectionData--init:', options);
    const me = this;
    // options?.postUrl && (this.collectionDataStore.postUrl = options?.postUrl);
    this.postInitData(
      (data: PostData['data']) => {
        me.initSuccessHook(data);
      },
      (err: any) => {
        me.collectionDataStore.postInitDataOk = false;
        console.log('postInitData-err:', err);
      }
    );
    // console.log('CollectionData_initData:', this.collectionDataStore.verifyData);
  }
  async postInitData(callback?: Function, failFn?: Function) {
    try {
      const res = await utils.$https.request({
        url: this.customCollectionDataOptios.open
          ? this.customCollectionDataOptios.initpostUrl
          : this.collectionDataStore.postInitUrl,
        method: 'post',
        data: {
          type: 'init',
          cuid: this.customCollectionDataOptios.cuid || '',
          ...this.collectionDataStore.verifyData
        }
      });
      if (this.customCollectionDataOptios.open) {
        // 调用自定义初始化钩子
        this.customCollectionDataOptios.postInitUrlFn(this.initSuccessHook, res);
        return;
      }
      if (+(<PostData>res).data.code === 0 && +(<PostData>res).status === 200) {
        // console.log('postDataSuccess:', res);
        callback && callback((<PostData>res).data);
      } else {
        failFn && failFn((<PostData>res).data);
      }
    } catch (error) {
      failFn && failFn(error);
      console.log('postInitDataErr:', error);
    }
  }
  initSuccessHook = (data?: any) => {
    this.collectionDataStore.postInitDataOk = true;
    if (!this.customCollectionDataOptios.open && data) {
      this.collectionDataStore.verifyData.rzData.tk = data.data.tk;
      console.log('postInitData success:', this.collectionDataStore.verifyData.rzData.tk);
    }
    this.initGatherEvent();
  };
  protected initGatherEvent() {
    const doc = document;
    const win = window;
    const addEventHandler = this.baseCls.addEventHandler.bind(this.baseCls);
    addEventHandler(doc, 'click', this.gatherEventStore('eventClickFn'));
    addEventHandler(doc, 'touchstart', this.gatherEventStore('eventClickFn'));
    addEventHandler(doc, 'touchcancel', this.gatherEventStore('eventClickFn'));
    addEventHandler(doc, 'touchmove', this.gatherEventStore('eventMoveFn'));
    addEventHandler(doc, 'mousemove', this.gatherEventStore('eventMoveFn'));
    addEventHandler(doc, 'keyup', this.gatherEventStore('keyupFn'));
    addEventHandler(doc, 'keydown', this.gatherEventStore('keydownFn'));
    addEventHandler(win, 'scroll', this.baseCls.throttle(this.gatherEventStore('scrollFn')));
  }
  public setClickData(arr: any[]) {
    console.log('setClickData...');
    this.collectionDataStore.verifyData.rzData.cl.push(...arr);
  }
  removeGatherEvent() {
    const doc = document;
    const win = window;
    const removeEventHandler = this.baseCls.removeEventHandler.bind(this.baseCls);
    removeEventHandler(doc, 'click', this.gatherEventStore('eventClickFn'));
    removeEventHandler(doc, 'touchcancel', this.gatherEventStore('eventClickFn'));
    removeEventHandler(doc, 'touchmove', this.gatherEventStore('eventMoveFn'));
    removeEventHandler(doc, 'mousemove', this.gatherEventStore('eventMoveFn'));
    removeEventHandler(doc, 'keyup', this.gatherEventStore('keyupFn'));
    removeEventHandler(doc, 'keydown', this.gatherEventStore('keydownFn'));
    removeEventHandler(win, 'scroll', this.baseCls.throttle(this.gatherEventStore('scrollFn')));
  }
  protected reportedOpportunity() {
    const me = this;
    me.collectionDataStore.collectionCount++;
    if (me.collectionDataStore.collectionCount >= me.collectionDataStore.shouldPostNum) {
      // console.log('reportedOpportunity:', this.collectionDataStore.verifyData);
      me.collectionDataStore.collectionCount = 0;
      this.postData();
    }
  }
  protected getScreenInfo() {
    try {
      const win = window;
      const doc = document;
      let screenTop = win.screenTop;
      let screenLeft = win.screenLeft;
      if (typeof screenTop === 'undefined') {
        screenTop = 0;
      }
      if (typeof screenLeft === 'undefined') {
        screenLeft = 0;
      }
      // 网页可见区域 浏览器窗口可视区域大小（不包括工具栏和滚动条等边线）
      const clientWidth = doc.documentElement.clientWidth || doc.body.clientWidth;
      const clientHeight = doc.documentElement.clientHeight || doc.body.clientHeight;
      // 屏幕分辨率
      const screenWidth = win.screen.width;
      const screenHeight = win.screen.height;
      // 屏幕可用工作区
      const availWidth = win.screen.availWidth;
      const availHeight = win.screen.availHeight;
      // 外部高度
      const outerWidth = win.outerWidth;
      const outerHeight = win.outerHeight;
      // 文档高度 网页内容实际宽高(包括工具栏和滚动条等边线）
      const scrollWidth = doc.documentElement.scrollWidth || doc.body.scrollWidth;
      const scrollHeight = doc.documentElement.scrollWidth || doc.body.scrollHeight;
      return {
        screenTop: screenTop,
        screenLeft: screenLeft,
        clientWidth: clientWidth,
        clientHeight: clientHeight,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        availWidth: availWidth,
        availHeight: availHeight,
        outerWidth: outerWidth,
        outerHeight: outerHeight,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight
      };
    } catch (err) {
      // catch
    }
  }
  public postData(type: 'verify' | 'during' = 'during') {
    throw new Error('请实现postData函数');
  }
  public getpostResp() {
    throw new Error('getpostResp');
  }
  protected gatherEventStore(type: keyof GatherEventStore) {
    const ownDataStore = this.collectionDataStore;
    const me = this;
    const doc = document;
    const gatherEventStore: GatherEventStore = {
      eventClickFn: function (e: MouseEvent | TouchEvent): void {
        const cl = {
          x: 0,
          y: 0,
          t: 0
        };
        let etype;
        if ('changedTouches' in e) {
          etype = e.changedTouches[0];
        } else {
          etype = e;
        }
        cl.x = parseInt(String(etype.clientX), 10);
        cl.y = parseInt(String(etype.clientY), 10);
        cl.t = me.getTimeStr();
        ownDataStore.verifyData.rzData.cl.push(cl);
        me.reportedOpportunity();
      },
      eventMoveFn: function (e: MouseEvent | TouchEvent): void {
        // 滑动数据
        const mv = {
          x: 0,
          y: 0,
          t: 0
        };
        let etype;
        if ('changedTouches' in e) {
          etype = e.changedTouches[0];
        } else {
          etype = e;
        }
        mv.x = parseInt(String(etype.clientX), 10);
        mv.y = parseInt(String(etype.clientY), 10);
        mv.t = me.getTimeStr();
        ownDataStore.verifyData.rzData.mv.push(mv);
        me.reportedOpportunity();
      },
      keyupFn: function (e: KeyboardEvent): void {
        console.log('keyupFn:', e);
        // 键盘输入
        const kb = {
          key: e.keyCode || e.code || 'a',
          type: 'up',
          t: 0
        };
        kb.key = 'a';
        kb.t = me.getTimeStr();
        ownDataStore.verifyData.rzData.kb.push(kb);
        me.reportedOpportunity();
      },
      keydownFn: function (e: KeyboardEvent): void {
        // 键盘输入
        const kb = {
          key: e.keyCode || e.code || 'b',
          type: 'down',
          t: 0
        };
        kb.key = 'a';
        kb.t = me.getTimeStr();
        ownDataStore.verifyData.rzData.kb.push(kb);
        me.reportedOpportunity();
      },
      scrollFn: function (e: MouseEvent | TouchEvent): void {
        // 滚动数据
        let etype;
        if ('changedTouches' in e) {
          etype = e.changedTouches[0];
        } else {
          etype = e;
        }
        const sc = {
          tx: 0,
          ty: 0
        };
        sc.tx = doc.documentElement.scrollLeft || doc.body.scrollLeft;
        sc.ty = doc.documentElement.scrollTop || doc.body.scrollTop;
        ownDataStore.verifyData.rzData.sc.push(sc);
        me.reportedOpportunity();
      }
    };
    return gatherEventStore[type];
  }
  // 获取时间戳
  getTimeStr() {
    const date = new Date();
    const now = date.getTime();
    return now;
  }
  protected resetDzData() {
    const rzData = this.collectionDataStore.verifyData.rzData;
    Object.assign(rzData, {
      cl: [],
      mv: [],
      sc: [],
      kb: [],
      sb: [],
      sd: [],
      sm: []
    });
  }
}
