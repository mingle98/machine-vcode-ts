import {
  SlidebarParams,
  SlidebarStore,
  SlidebarTplStore,
  slideFunctionStore
} from '../../../interface/sildebar';
import ComponentAbstract from '../../abstract/componentAbstract';
import '../../../static/style/slidebar.less';

export default new (class extends ComponentAbstract {
  name: string;
  parentComparent: any;
  childComponents: any;
  isMouseDown: boolean = false;
  public slidebarStore: SlidebarStore = {
    callbacks: {
      slideStartFn: function (): void {
        throw new Error('Function not implemented.');
      },
      slidemoveFn: function (): void {
        throw new Error('Function not implemented.');
      },
      slideEndFn: function (): void {
        throw new Error('Function not implemented.');
      }
    },
    params: null,
    parentEle: '',
    // 滑动坐标数据
    movePoData: {
      originX: 0,
      originY: 0,
      eventX: 0,
      eventY: 0,
      moveX: 0,
      moveY: 0,
      tail: [],
      slideMoveData: []
    },
    // 滑动条的数据
    barAttrbutes: null
  };
  constructor(name: string) {
    super();
    this.name = name;
  }
  init(options?: any) {
    this.initData();
  }
  initData(options?: any) {
    console.log('slidebar.initData....');
    this.customDataToStore(this.parentComparent.customConfig, this.slidebarStore);
  }
  getTpl(type: keyof SlidebarTplStore) {
    const slidebarTplStore: SlidebarTplStore = {
      puzzleVcodeBar:
        '<div class="puzzleVcodeBarBox" id="' +
        this.id_prefix +
        '_puzzleVcodeBarBox"><div class="puzzleVcodeOutBar" id="' +
        this.id_prefix +
        '_puzzleVcodeOutBar"><span class="puzzleVcodeInnerBarAction" id="' +
        this.id_prefix +
        '_puzzleVcodeInnerBarAction"></span><p class="puzzleVcodeInnerBar" id="' +
        this.id_prefix +
        '_puzzleVcodeInnerBar"></p></div></div>'
    };
    return slidebarTplStore[type];
  }
  setEvent() {
    const _puzzleVcodeInnerBar = this.baseCls.getEleById('_puzzleVcodeInnerBar');
    const _contentWrap = this.baseCls.getEleById('_contentWrap');
    const d = document.body;
    this.baseCls.addEventHandler(
      _puzzleVcodeInnerBar,
      'mousedown',
      this.getFunctionStore('move_start_fn')
    );
    this.baseCls.addEventHandler(
      _puzzleVcodeInnerBar,
      'touchstart',
      this.getFunctionStore('move_start_fn')
    );
    this.baseCls.addEventHandler(
      _contentWrap,
      'mousemove',
      this.getFunctionStore('move_during_fn')
    );
    this.baseCls.addEventHandler(
      _contentWrap,
      'touchmove',
      this.getFunctionStore('move_during_fn')
    );
    this.baseCls.addEventHandler(d, 'mouseup', this.getFunctionStore('move_end_fn'));
    this.baseCls.addEventHandler(d, 'touchend', this.getFunctionStore('move_end_fn'));
  }
  render(parent?: any) {
    this.parentComparent = parent;
    this.init();
  }
  renderSlider(parent: any, params: SlidebarParams) {
    this.render(parent);
    this.slidebarStore.callbacks = params.callbacks;
    this.slidebarStore.parentEle = params.parentEle;
    this.slidebarStore.params = params;
    this.insertTplToHtml();
    return this;
  }
  insertTplToHtml(callback?: Function) {
    const ownDataStore = this.slidebarStore;
    const targetEle = this.baseCls.getEleById(ownDataStore.parentEle);
    if (!ownDataStore.parentEle || !targetEle) {
      throw new Error('sliderbar组件必须有挂载节点且不能为空');
    }
    const slidebarTpl = this.getTpl('puzzleVcodeBar');
    // 插入的位置
    const insertPosi = ownDataStore.params?.afterBegin;
    this.baseCls.insertHTML(insertPosi ? 'afterBegin' : 'beforeEnd', slidebarTpl, targetEle);
    this.slidebarStore.barAttrbutes = this.baseCls
      .getEleById('_puzzleVcodeOutBar')!
      .getBoundingClientRect();
    this.setEvent();
  }
  getFunctionStore(type: keyof slideFunctionStore) {
    const me = this;
    const innerBar = me.baseCls.getEleById('_puzzleVcodeInnerBar')!;
    const innerBarAction = me.baseCls.getEleById('_puzzleVcodeInnerBarAction')!;
    const functionStoreObj: slideFunctionStore = {
      move_start_fn: function (e): void {
        let originX: number, originY: number;
        if ('touches' in e) {
          originX = e.touches[0].clientX;
          originY = e.touches[0].clientY;
        } else {
          originX = e.clientX;
          originY = e.clientY;
        }
        me.slidebarStore.movePoData.originX = originX;
        me.slidebarStore.movePoData.originY = originY;
        me.slidebarStore.movePoData.slideMoveData.push({ x: originX, y: originY });
        me.isMouseDown = true;
        me.slidebarStore.callbacks.slideStartFn &&
          me.slidebarStore.callbacks.slideStartFn(originX, originY);
      },
      move_during_fn: function (e): void {
        if (!me.isMouseDown) return;
        let eventX: number, eventY: number;
        const originX = me.slidebarStore.movePoData.originX;
        const originY = me.slidebarStore.movePoData.originY;
        e.preventDefault();
        if ('touches' in e) {
          eventX = e.touches[0]?.clientX || e.changedTouches[0].clientX;
          eventY = e.touches[0]?.clientY || e.changedTouches[0].clientY;
        } else {
          eventX = e.clientX;
          eventY = e.clientY;
        }
        const moveX = eventX - originX;
        const moveY = eventY - originY;
        me.slidebarStore.movePoData.moveX = moveX;
        me.slidebarStore.movePoData.moveY = moveY;
        me.slidebarStore.movePoData.eventX = eventX;
        me.slidebarStore.movePoData.eventY = eventY;
        const barwidth = me.slidebarStore.barAttrbutes?.width;
        if (moveX < 0 || moveX + 50 >= barwidth!) return;
        innerBar.style.left = moveX + 'px';
        innerBarAction.style.width = moveX + 45 + 'px';
        me.slidebarStore.movePoData.tail.push(moveY);
        me.slidebarStore.movePoData.slideMoveData.push({ x: eventX, y: eventY });
        me.slidebarStore.callbacks.slidemoveFn && me.slidebarStore.callbacks.slidemoveFn(moveX);
      },
      move_end_fn: function (e): void {
        if (!me.isMouseDown) return;
        let eventX: number;
        me.isMouseDown = false;
        if ('touches' in e) {
          eventX = e.touches[0]?.clientX || e.changedTouches[0].clientX;
        } else {
          eventX = e.clientX;
        }
        if (eventX === me.slidebarStore.movePoData.originX) return;
        me.slidebarStore.callbacks.slideEndFn &&
          me.slidebarStore.callbacks.slideEndFn(
            me.slidebarStore.movePoData.tail,
            me.slidebarStore.movePoData.slideMoveData
          );
      }
    };
    return functionStoreObj[type];
  }
  resetData() {
    this.slidebarStore.movePoData = {
      originX: 0,
      originY: 0,
      eventX: 0,
      eventY: 0,
      moveX: 0,
      moveY: 0,
      tail: [],
      slideMoveData: []
    };
    // console.log('resetData...');
  }
})('slidebar');
