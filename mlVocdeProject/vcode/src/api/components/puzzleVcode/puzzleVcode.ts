import {
  PuzzleTplStore,
  PuzzleVcodeFunctionStore,
  PuzzleVcodeStore
} from '../../../interface/puzzleVcode';
import VcodeAbstract from '../../abstract/vcodeAbstract';
import VcodeWrapper from '../../wrapper';
import globalConfig from '../../../config/config';
import '../../../static/style/puzzleVcode.less';
import { VerifyStatusStyle } from '../../../enum/enum';
import slidebar from '../common/slidebar';

export default new (class extends VcodeAbstract {
  name: string;
  parentComparent!: VcodeWrapper;
  canvasCtx: CanvasRenderingContext2D[] = [];
  canvasAttrbutes: DOMRect[] = [];
  childComponents: any[] = [];
  private isResetDingFlag: boolean = false;
  protected puzzleVcodeStore: PuzzleVcodeStore = {
    puZshape: 'puzzle',
    puZoperateTip: globalConfig.puzzleVcodeConfig.puZoperateTip,
    puZimgList: globalConfig.getConfigImgsfromServer(false),
    puZshapeConfig: {
      // 滑块边长
      puZl: globalConfig.puzzleVcodeConfig.puZl,
      // 滑块半径
      puZr: globalConfig.puzzleVcodeConfig.puZr,
      // 半圆的偏移量
      puZpy: globalConfig.puzzleVcodeConfig.puZpy,
      // 滑块实际边长
      puZLen:
        globalConfig.puzzleVcodeConfig.puZl +
        globalConfig.puzzleVcodeConfig.puZpy +
        globalConfig.puzzleVcodeConfig.puZr,
      // 随机位置
      x: 0,
      y: 0
    }
  };
  constructor(componentName: string) {
    super();
    this.name = componentName;
  }
  init(options?: any) {
    this.initData();
    this.insertTplToHtml();
  }
  getTpl(type: keyof PuzzleTplStore) {
    const puzzleTplStore: PuzzleTplStore = {
      puzzleVcodeBox:
        '<div class="puzzleVcodeBox" id="' +
        this.id_prefix +
        '_puzzleVcodeBox">{{puzzleBody}}</div>',
      puzzleVcodeCanvasArea:
        '<section class="puzzleVcodeCanvasArea" id="' +
        this.id_prefix +
        '_puzzleVcodeCanvasArea"><canvas class="puzzleVcodebgCanvas" id="' +
        this.id_prefix +
        '_puzzleVcodebgCanvas" width="100%" height="100%"></canvas><canvas class="puzzleVcodeShapeCanvas" id="' +
        this.id_prefix +
        '_puzzleVcodeShapeCanvas" width="100%" height="100%"></canvas><div class="puzzleVcodeReset" id="' +
        this.id_prefix +
        '_puzzleVcodeReset"></div></section>',
      puzzleVcodeOperateBox:
        '<section class="puzzleVcodeOperateBox" id="' +
        this.id_prefix +
        '_puzzleVcodeOperateBox">{{operateBody}}</section>',
      puzzleVcodeTips:
        '<p class="puzzleVcodeTips" id="' +
        this.id_prefix +
        '_puzzleVcodeTips">' +
        this.puzzleVcodeStore.puZoperateTip +
        '</p>'
    };
    return puzzleTplStore[type];
  }
  initData(options?: any) {
    this.customDataToStore(this.parentComparent.customConfig, this.puzzleVcodeStore);
  }
  render(parent: VcodeWrapper) {
    this.parentComparent = parent;
    // console.log('puzzleVcode render...', this);
    this.init();
  }
  insertTplToHtml(callback?: Function) {
    const operateTpl = this.getTpl('puzzleVcodeTips');
    const OperateBox = this.getTpl('puzzleVcodeOperateBox').replace(/{{operateBody}}/g, operateTpl);
    const puzzleTpl = this.getTpl('puzzleVcodeBox').replace(
      /{{puzzleBody}}/g,
      this.getTpl('puzzleVcodeCanvasArea')
    );
    const _contentWrap = this.baseCls.getEleById('_contentWrap');
    this.baseCls.insertHTML('afterBegin', puzzleTpl, _contentWrap);
    this.baseCls.insertHTML('beforeEnd', OperateBox, _contentWrap);
    // 存储和更正canvas标签的信息
    this.getCanvasInfoToVCode(
      this.baseCls.getEleById('_puzzleVcodebgCanvas') as HTMLCanvasElement,
      this
    );
    this.getCanvasInfoToVCode(
      this.baseCls.getEleById('_puzzleVcodeShapeCanvas') as HTMLCanvasElement,
      this
    );
    // 初始化canvas背景图和滑块图片
    this.getImg();
  }
  getImg() {
    this.initImg(
      (img: HTMLImageElement) => {
        this.drawImgtoCanvas(img);
      },
      () => {
        const me = this;
        this.parentComparent.setloading(true, 'error').onclick = () => {
          me.resetVcodeFn();
          const timer = setTimeout(() => {
            this.isResetDingFlag && (this.isResetDingFlag = false);
            clearTimeout(timer);
          }, 3000);
        };
      },
      this.puzzleVcodeStore.puZimgList
    );
  }
  drawImgtoCanvas(img: HTMLImageElement) {
    const ownDataStore = this.puzzleVcodeStore;
    const L = ownDataStore.puZshapeConfig.puZLen;
    // 随机位置创建拼图形状
    const x = this.getRandomNum(L, this.canvasAttrbutes[0].width - L);
    const y = this.getRandomNum(0, this.canvasAttrbutes[0].height - L);
    this.puzzleVcodeStore.puZshapeConfig.x = x;
    this.puzzleVcodeStore.puZshapeConfig.y = y;
    const shapIndx = Math.floor(Math.random() * globalConfig.randomShaps.length);
    this.drawPath(this.canvasCtx[0], x, y, 'fill', 'puzzle', shapIndx);
    this.drawPath(this.canvasCtx[1], x, y, 'clip', 'puzzle', shapIndx);
    // 将同一张背景图片绘制到两个canvas上(一个背景一个拼图)
    // 背景
    this.canvasCtx[0].drawImage(
      img,
      0,
      0,
      this.canvasAttrbutes[0].width,
      this.canvasAttrbutes[0].height
    );
    // 滑块
    this.canvasCtx[1].drawImage(
      img,
      0,
      0,
      this.canvasAttrbutes[1].width,
      this.canvasAttrbutes[1].height
    );
    // 提取滑块并放到最左边
    const ImageData = this.canvasCtx[1].getImageData(x - ownDataStore.puZshapeConfig.puZr, y, L, L);
    const ShapeCanvasEle = this.baseCls.getEleById('_puzzleVcodeShapeCanvas') as HTMLCanvasElement;
    ShapeCanvasEle.width = L;
    ShapeCanvasEle.style.width = L + 'px';
    this.canvasCtx[1].putImageData(ImageData, 0, y);
    !this.isResetDingFlag && this.setEvent();
    this.isResetDingFlag = false;
  }
  setEvent() {
    const me = this;
    const _puzzleVcodeReset = this.baseCls.getEleById('_puzzleVcodeReset');
    this.baseCls.addEventHandler(
      _puzzleVcodeReset,
      'click',
      this.getFunctionStore('resetBtn_click_fn')
    );
    const slideInstance = slidebar.renderSlider(this, {
      callbacks: {
        slideStartFn: (originX: number, originY: number) => {
          // console.log('父亲逐渐中的slideStartFn回调函数执行:', originX, originY);
          const fn = me.getFunctionStore('movestartfn') as (
            originX: number,
            originY: number
          ) => any;
          fn(originX, originY);
        },
        slidemoveFn: (moveX: number) => {
          // console.log('父亲逐渐中的slidemoveFn回调函数执行:', moveX);
          const fn = me.getFunctionStore('moveduringfn') as (moveX: number) => any;
          fn(moveX);
        },
        slideEndFn: (tail: any[], slideMoveData: any[]) => {
          // console.log('父亲逐渐中的slideEndFn回调函数执行:', tail);
          const fn = me.getFunctionStore('moveendfn') as PuzzleVcodeFunctionStore['moveendfn'];
          fn(tail, slideMoveData);
        }
      },
      parentEle: '_puzzleVcodeOperateBox',
      afterBegin: false
    });
    me.childComponents.push(slideInstance);
  }
  resetVcodeFn(): void {
    if (this.isResetDingFlag) return;
    const ownDataStore = this.puzzleVcodeStore;
    this.isResetDingFlag = true;
    this.changeVerifyStatus('wait');
    const ShapeCanvasEle = this.baseCls.getEleById('_puzzleVcodeShapeCanvas') as HTMLCanvasElement;
    const L = this.canvasAttrbutes[0].width;
    this.canvasCtx.forEach((ctx, idx) => {
      if (idx === 1) {
        return ctx.clearRect(
          0,
          0,
          ownDataStore.puZshapeConfig.puZLen,
          this.canvasAttrbutes[1].height
        );
      }
      ctx.clearRect(0, 0, this.canvasAttrbutes[0].width, this.canvasAttrbutes[0].height);
    });
    ShapeCanvasEle.width = L;
    ShapeCanvasEle.style.width = L + 'px';
    this.getImg();
    // 滑动条数据重置
    this.childComponents[0].resetData();
  }
  getFunctionStore(type: keyof PuzzleVcodeFunctionStore) {
    const me = this;
    const puzzleVcodeShapeCanvas = me.baseCls.getEleById(
      '_puzzleVcodeShapeCanvas'
    ) as HTMLCanvasElement;
    const parentComStore = me.parentComparent.vcodeWrapperStore;
    const parentCom = me.parentComparent;
    const functionStoreObj: PuzzleVcodeFunctionStore = {
      movestartfn: function (originX: number, originY: number): void {},
      moveduringfn: function (moveX: number): void {
        me.changeVerifyStatus('action');
        puzzleVcodeShapeCanvas.style.left = moveX + 'px';
      },
      moveendfn: function (tail: any[], slideMoveData: any[]): void {
        const { spliced, verified } = me.shakeVerifyFn(
          tail,
          puzzleVcodeShapeCanvas,
          me.puzzleVcodeStore.puZshapeConfig.x,
          globalConfig.puzzleVcodeConfig.accuracy
        );
        let verifyResult = false;
        function handerResultFn() {
          if (verifyResult) {
            return me.changeVerifyStatus('success');
          }
          me.changeVerifyStatus('fail');
          const timer = setTimeout(() => {
            me.resetVcodeFn();
            clearTimeout(timer);
          }, 1000);
        }
        if (parentComStore.serverVerify && verified && spliced) {
          parentCom.collectionData.postData(
            'verify',
            { verData: slideMoveData },
            (res: any) => {
              console.log('serverVerify_puzzle_suc:', res);
              if (parentComStore.collectionDataOptios.open) {
                verifyResult = verified && spliced;
              } else {
                verifyResult = verified && spliced && res?.type === 'verify' && +res?.code === 0;
              }
              handerResultFn();
            },
            (res: any) => {
              console.log('serverVerify_puzzle_fail:', res);
              verifyResult = false;
              handerResultFn();
            }
          );
        } else {
          verifyResult = verified && spliced!;
          handerResultFn();
        }
        // console.log('move_end_fn:验证结果:', spliced, verified);
      },
      resetBtn_click_fn: function () {
        me.resetVcodeFn();
      }
    };
    return functionStoreObj[type];
  }
  // 验证状态样式
  changeVerifyStatus(type: keyof typeof VerifyStatusStyle) {
    const customConfig = this.parentComparent.customConfig;
    const _puzzleVcodeInnerBar = this.baseCls.getEleById('_puzzleVcodeInnerBar');
    const innerBarAction = this.baseCls.getEleById('_puzzleVcodeInnerBarAction')!;
    const _puzzleVcodeOutBar = this.baseCls.getEleById('_puzzleVcodeOutBar');
    const _puzzleVcodeShapeCanvas = this.baseCls.getEleById('_puzzleVcodeShapeCanvas');
    const _puzzleVcodeTips = this.baseCls.getEleById('_puzzleVcodeTips');
    const parentComStore = this.parentComparent.vcodeWrapperStore;
    const parentCom = this.parentComparent;
    const addClass = this.baseCls.addClass.bind(this.baseCls);
    const removeClass = this.baseCls.removeClass.bind(this.baseCls);
    switch (type) {
      case 'action':
        _puzzleVcodeInnerBar && addClass(_puzzleVcodeInnerBar, 'puzzleVerifyAction_inbar');
        _puzzleVcodeOutBar && addClass(_puzzleVcodeOutBar, 'puzzleVerifyAction_outbar');
        _puzzleVcodeTips && addClass(_puzzleVcodeTips, 'puzzleVerifyAction_tips');
        break;
      case 'fail':
        _puzzleVcodeInnerBar && addClass(_puzzleVcodeInnerBar, 'puzzleVerifyFail_inbar');
        _puzzleVcodeOutBar && addClass(_puzzleVcodeOutBar, 'puzzleVerifyFail_outbar');
        _puzzleVcodeShapeCanvas && addClass(_puzzleVcodeShapeCanvas, 'puzzleVerifyFail_shapCtx');
        _puzzleVcodeTips && addClass(_puzzleVcodeTips, 'puzzleVerifyFail_tips');
        const timer = setTimeout(() => {
          _puzzleVcodeShapeCanvas &&
            removeClass(_puzzleVcodeShapeCanvas, 'puzzleVerifyFail_shapCtx');
          clearTimeout(timer);
        }, 500);
        _puzzleVcodeTips!.innerText = '验证失败请重试';
        customConfig.failFn && customConfig.failFn({ code: 9, msg: 'failFn', type: 'puzzleVcode' });
        break;
      case 'success':
        _puzzleVcodeInnerBar && addClass(_puzzleVcodeInnerBar, 'puzzleVerifySucc_inbar');
        _puzzleVcodeOutBar && addClass(_puzzleVcodeOutBar, 'puzzleVerifySucc_outbar');
        _puzzleVcodeTips && addClass(_puzzleVcodeTips, 'puzzleVerifySucc_tips');
        _puzzleVcodeTips!.innerText = '恭喜您,验证通过';
        // 告知服务端清楚本次tk记录
        if (parentComStore.serverVerify && !parentComStore.collectionDataOptios.open) {
          parentCom.collectionData.postData(
            'destroy',
            {},
            (res: any) => {},
            (res: any) => {}
          );
        }
        customConfig.successFn &&
          customConfig.successFn({ code: 0, msg: 'success', type: 'puzzleVcode' });
        break;
      case 'wait':
        if (_puzzleVcodeInnerBar && _puzzleVcodeOutBar && _puzzleVcodeTips) {
          removeClass(_puzzleVcodeInnerBar, 'puzzleVerifyFail_inbar');
          removeClass(_puzzleVcodeOutBar, 'puzzleVerifyFail_outbar');
          removeClass(_puzzleVcodeTips, 'puzzleVerifyFail_tips');
          removeClass(_puzzleVcodeInnerBar, 'puzzleVerifySucc_inbar');
          removeClass(_puzzleVcodeOutBar, 'puzzleVerifySucc_outbar');
          removeClass(_puzzleVcodeTips, 'puzzleVerifySucc_tips');
          removeClass(_puzzleVcodeInnerBar, 'puzzleVerifyAction_inbar');
          removeClass(_puzzleVcodeOutBar, 'puzzleVerifyAction_outbar');
          removeClass(_puzzleVcodeTips, 'puzzleVerifyAction_tips');
        }
        innerBarAction.style.width = _puzzleVcodeInnerBar!.style.left = 0 + 'px';
        _puzzleVcodeShapeCanvas!.style.left = 0 + 'px';
        _puzzleVcodeTips!.innerText = this.puzzleVcodeStore.puZoperateTip;
        break;
      default:
        break;
    }
  }
})('puzzleVcode');
