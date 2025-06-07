import { ClickVcodeFunctionStore, ClickVcodeStore, ClickVcodeTplStore } from "../../../interface/clickVcode";
import VcodeAbstract from "../../abstract/vcodeAbstract";
import VcodeWrapper from "../../wrapper";
import globalConfig from "../../../config/config";

import '../../../static/style/clickVcode.less';
import { VerifyStatusStyle } from "../../../enum/enum";
export default new (class extends VcodeAbstract {
    name: string;
    parentComparent!: VcodeWrapper;
    canvasCtx!: CanvasRenderingContext2D;
    canvasAttrbutes!: DOMRect;
    childComponents: any[] = [];
    private isResetDingFlag: boolean = false;
    protected clickVcodeStore: ClickVcodeStore = {
        // 随机取背景图的图片库
        imgList: globalConfig.getConfigImgsfromServer(false),
        // 随机取字符的字符库
        fontList: globalConfig.defaultFontList,
        // 需要展示的字符数
        fontNum: globalConfig.clickVcodeConfig.fontNum,
        // 需要验证的字符数
        verifyFontNum: globalConfig.clickVcodeConfig.verifyFontNum,
        // 展示字符列表
        showFontList: [],
        // 验证字符分列表
        verifyFontList: [],
        // 用户点击的标记点列表
        pointerList: [],
        // 精度
        accuracy: globalConfig.clickVcodeConfig.accuracy,
        // 验证状态
        verifyStatus: 'wait'
    };
    constructor(componentName: string) {
        super();
        this.name = componentName;
    };
    init(options?: any) {
        this.initData();
    };
    getTpl(type: keyof ClickVcodeTplStore) {
        let clickVcodeTplStore: ClickVcodeTplStore = {
            clickVcodeBox: '<div class="clickVcodeBox" id="' + this.id_prefix + '_clickVcodeBox">{{clickVcodeBody}}</div>',
            resetBtn: '<div class="resetBtn" id="' + this.id_prefix + '_resetBtn"></div>',
            canvasArea: '<section class="canvasArea" id="' + this.id_prefix + '_canvasArea">'
                        + '<canvas class="clickVcode_canvas" width="100%" height="100%" id="' + this.id_prefix + '_clickVcode_canvas"></canvas></section>',
            tipPointer: '<span class="tipPointer" id="' + this.id_prefix + '_tipPointer-{{pointerNumber}}">{{pointerNumber}}</span>',
            statusBar: '<section class="statusBar" id="' + this.id_prefix + '_statusBar"><p class="statusBarTxt" id="' + this.id_prefix + '_statusBarTxt">'
                        + this.lang.clickVcodeLang.statusBarTips + '[<span class="statusBarTxt-font" id="'
                        + this.id_prefix + '_statusBarTxt-font">跋山涉水</span>]验证</p>'
                        +  '<p class="verifyResultTips" id="' + this.id_prefix + '_verifyResultTips"></p></section>'
        };
        return clickVcodeTplStore[type];
    };
    initData(options?: any) {
        this.customDataToStore(this.parentComparent.customConfig, this.clickVcodeStore);
        this.insertTplToHtml();
    };
    render(parent: VcodeWrapper) {
        this.parentComparent = parent;
        this.init();
    };
    insertTplToHtml(callback?: Function) {
        let _contentWrap = this.baseCls.getEleById('_contentWrap');
        let temp = this.getTpl('clickVcodeBox');
        temp = temp.replace(/{{clickVcodeBody}}/g, this.getTpl('canvasArea'));
        this.baseCls.insertHTML('afterBegin', temp, _contentWrap);
        this.baseCls.insertHTML('beforeEnd', this.getTpl('statusBar'), _contentWrap);
        // 注意这里的顺序
        let _statusBar = this.baseCls.getEleById('_statusBar');
        this.baseCls.insertHTML('beforeEnd', this.getTpl('resetBtn'), _statusBar);
        // 存储和更正canvas标签的信息
        this.getCanvasInfoToVCode(this.baseCls.getEleById('_clickVcode_canvas') as HTMLCanvasElement, this);
        this.getImg();
    };
    setEvent() {
        console.log('clickVode-setEvent...');
        let customConfig = this.parentComparent.customConfig;
        let resetBtnEle = this.baseCls.getEleById('_resetBtn');
        let clickVcode_canvas = this.baseCls.getEleById('_clickVcode_canvas');
        // 重置按钮
        resetBtnEle && this.baseCls.addEventHandler(resetBtnEle, 'click', this.getFunctionStore('resetBtn_click_fn'));
        // canvas点击标点
        clickVcode_canvas && this.baseCls.addEventHandler(clickVcode_canvas, 'click', this.getFunctionStore('clickVcode_canvas_click_fn'));
        customConfig.renderSucFn && customConfig.renderSucFn({ code: 1001, msg: 'renderSuccess', vcodeInstance: this }); 
    };
    getImg(callback?: Function) {
        this.initImg((img: HTMLImageElement) => {
            this.drawImgtoCanvas(img);
        }, () => {
            let me = this;
            this.parentComparent.setloading(true, 'error').onclick = function () {
                me.resetVcodeFn();
                let timer = setTimeout(() => {
                    me.isResetDingFlag && (me.isResetDingFlag = false);
                    clearTimeout(timer);
                }, 3000);
            };
        }, this.clickVcodeStore.imgList);
    };
    drawImgtoCanvas(img: HTMLImageElement) {
        let showFontsTpoTpl = '';
        // 渲染图片和随机字符
        let showFontList = this.clickVcodeStore.showFontList;
        this.canvasCtx.drawImage(img, 0, 0, this.canvasAttrbutes.width, this.canvasAttrbutes.height);
        for (let i = 0; i < this.clickVcodeStore.fontNum; i++) {
            const character = this.getRandomCharacter(this.clickVcodeStore.fontList, showFontList);
            const fontSize = this.getRandomNum(20, this.canvasAttrbutes.height * 1 / 3);
            const fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
            const fontStyle = Math.random() > 0.5 ? 'italic' : 'normal';
            const fontFamily = Math.random() > 0.5 ? 'sans-serif' : 'serif';
            const x = this.canvasAttrbutes.width / this.clickVcodeStore.fontNum * i + 10;
            const y = Math.random() * (this.canvasAttrbutes.height - fontSize);
            this.canvasCtx.fillStyle = this.randomColor(0, 255);
            this.canvasCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            this.canvasCtx.textBaseline = 'top';
            this.canvasCtx.fillText(character, x, y);
            this.clickVcodeStore.showFontList.push({
                font: character,
                x,
                y,
                fontFamily,
                fontSize,
                fontStyle,
                fontWeight,
            });
        };
        // console.log('showFontList:', this.clickVcodeStore.showFontList);
        // 生成需要验证的字符列表
        for (let i = 0; i <  this.clickVcodeStore.verifyFontNum; i++) {
            // let character = this.clickVcodeStore.showFontList[this.getRandomNum(0, this.clickVcodeStore.showFontList.length)];
            let showFontListstr = '';
            for (let j = 0; j < this.clickVcodeStore.showFontList.length; j++) {
                showFontListstr += this.clickVcodeStore.showFontList[j].font;
            };
            let character = this.getRandomCharacter(showFontListstr, this.clickVcodeStore.verifyFontList);
            let characterItem = showFontList.find(item => item.font === character);
            this.clickVcodeStore.verifyFontList.length <= this.clickVcodeStore.verifyFontNum
                && characterItem && this.clickVcodeStore.verifyFontList.push(characterItem);
        };
        for (let j = 0; j < this.clickVcodeStore.verifyFontList.length; j++) {
            let itemObj = this.clickVcodeStore.verifyFontList[j];
            showFontsTpoTpl += '' + itemObj.font;
        };
        (this.baseCls.getEleById('_statusBarTxt-font') as HTMLSpanElement).innerText  = showFontsTpoTpl;
        // console.log('verifyFontList:', this.clickVcodeStore.verifyFontList);
        // 事件绑定
        !this.isResetDingFlag && this.setEvent();// 注意不能重复进行绑定!!!
        this.isResetDingFlag = false;
    };
    getFunctionStore(type: keyof ClickVcodeFunctionStore) {
        let me = this;
        let parentComStore = me.parentComparent.vcodeWrapperStore;
        let parentCom = me.parentComparent;
        let functionStoreObj: ClickVcodeFunctionStore = {
            resetBtn_click_fn: function () {
                me.resetVcodeFn();
            },
            clickVcode_canvas_click_fn: function (e: MouseEvent | TouchEvent) {
                // console.log('clickVcode_canvas_click_f=>n', e);
                let x, y;
                if ('touches' in e) {
                    // alert('是触屏设备');
                    x = e.touches[0].clientX || e.targetTouches[0].clientX - 15;// 这里的15是标记的半径
                    y = e.touches[0].clientY || e.targetTouches[0].clientY - 15;
                } else {
                    // alert('是pc设备');
                    x = e.offsetX - 15;
                    y = e.offsetY -15;
                };
                // 主动采集数据
                me.parentComparent.collectionData.setClickData([{ x, y }]);
                let pointerList = me.clickVcodeStore.pointerList;
                if (pointerList.length < me.clickVcodeStore.verifyFontNum && pointerList.length >= 0) {
                    me.changeVerifyStatus('action');
                    pointerList.push({
                        x,
                        y,
                        event: e,
                        id: ''
                    });
                    let curPointerIndex = String(pointerList.length);
                    let currentPointTplId = me.id_prefix + '_tipPointer-' + curPointerIndex;
                    pointerList[pointerList.length - 1].id = currentPointTplId;
                    let pointerTpl = me.getTpl('tipPointer').replace(/{{pointerNumber}}/g, curPointerIndex);
                    me.baseCls.insertHTML('beforeEnd', pointerTpl, me.baseCls.getEleById('_canvasArea'));
                    me.baseCls.getEleById('_tipPointer-' + curPointerIndex)!.style.left = x + 'px';
                    me.baseCls.getEleById('_tipPointer-' + curPointerIndex)!.style.top = y + 'px';
                    // console.log(pointerList);
                };
                if (pointerList.length >= me.clickVcodeStore.verifyFontNum) {
                    // 主动上报
                    parentComStore.serverVerify && parentCom.collectionData.postData();
                    // 进行验证
                    let status = me.verify();
                    let verifyResult = false;
                    function handerResultFn () {
                        verifyResult && me.changeVerifyStatus('success');
                        !verifyResult && me.changeVerifyStatus('fail');
                    };
                    if (parentComStore.serverVerify && status) {
                        parentCom.collectionData.postData('verify', {verData: me.clickVcodeStore.pointerList}, (res: any) => {
                            console.log('serverVerify_click_suc:', res);
                            if (parentCom.vcodeWrapperStore.collectionDataOptios.open) {
                                verifyResult = status;
                            } else {
                                verifyResult = status && res?.type === 'verify' && +res?.code === 0;
                            }
                            handerResultFn();
                        }, (res: any) => {
                            console.log('serverVerify_click_fail:', res);
                            verifyResult = false;
                            handerResultFn();
                        });
                    } else {
                        verifyResult = status;
                        handerResultFn();
                    };
                };
                
            }
        };
        return functionStoreObj[type];
    };
    resetVcodeFn(): void {
        if (this.isResetDingFlag) return;
        this.isResetDingFlag = true;
        let verifyResultTips = this.baseCls.getEleById('_verifyResultTips')!;
        let statusBarTxt = this.baseCls.getEleById('_statusBarTxt')!;
        this.clickVcodeStore.showFontList = [];
        this.clickVcodeStore.verifyFontList = [];
        this.clickVcodeStore.pointerList.forEach(item => {
            // this.baseCls.getEleById('_canvasArea')!.removeChild(this.baseCls.getEleByIdFromPage(item.id)!);
            let itemEle = this.baseCls.getEleByIdFromPage(item.id, true);
            itemEle?.parentNode?.removeChild(itemEle);
        });
        this.clickVcodeStore.pointerList = [];
        this.canvasCtx.clearRect(0, 0, this.canvasAttrbutes.width, this.canvasAttrbutes.height);
        this.getImg();
        this.baseCls.hide(verifyResultTips);
        this.baseCls.show(statusBarTxt);
        this.changeVerifyStatus('wait');
    };
    // 判断精度
    verify () {
        let pointerList = this.clickVcodeStore.pointerList;
        let accuracy = this.clickVcodeStore.accuracy;
        const result = this.clickVcodeStore.verifyFontList.every((item, index) => {
            const _left = item.x > pointerList[index].x - accuracy;
            const _right = item.x < pointerList[index].x + accuracy;
            const _top = item.y > pointerList[index].y - accuracy;
            const _bottom = item.y < pointerList[index].y + accuracy;
            // console.log('verify=>', _bottom, _left, _right, _top);
            return _left && _right && _top && _bottom;
        });
        console.log("验证", result);
        return result;
    };
    changeVerifyStatus(type: keyof typeof VerifyStatusStyle) {
        const customConfig = this.parentComparent.customConfig;
        this.clickVcodeStore.verifyStatus = type;
        let status = this.clickVcodeStore.verifyStatus;
        let statusBarEle = this.baseCls.getEleById('_statusBar')!;
        let verifyResultTips = this.baseCls.getEleById('_verifyResultTips')!;
        let statusBarTxt = this.baseCls.getEleById('_statusBarTxt')!;
        let addClassFn = this.baseCls.addClass.bind(this.baseCls);
        let removeClassFn = this.baseCls.removeClass.bind(this.baseCls);
        let parentComStore = this.parentComparent.vcodeWrapperStore;
        let parentCom = this.parentComparent;
        let toggleEleFn = (type: 'success' | 'fail') => {
            this.baseCls.show(verifyResultTips);
            this.baseCls.hide(statusBarTxt);
            if (type === 'success') {
                verifyResultTips.innerText = this.lang.clickVcodeLang.verifySuccess;
            } else {
                verifyResultTips.innerText = this.lang.clickVcodeLang.verifyFail;
            };
        };
        removeClassFn(statusBarEle, 'statusBar-action');
        removeClassFn(statusBarEle, 'statusBar-success');
        removeClassFn(statusBarEle, 'statusBar-fail');
        if (status === 'action') {
            addClassFn(statusBarEle, 'statusBar-action');
        } else if (status === 'success') {
            addClassFn(statusBarEle, 'statusBar-success');
            toggleEleFn(status);
            // 告知服务端清楚本次tk记录
            if (parentComStore.serverVerify && !parentComStore.collectionDataOptios.open) {
                parentCom.collectionData.postData('destroy', {}, (res: any) => {}, (res: any) => {});
            };
            customConfig.successFn && customConfig.successFn({code: 0, msg: 'success', type: 'clickVcode'});
        } else if (status === 'fail') {
            addClassFn(statusBarEle, 'statusBar-fail');
            toggleEleFn(status);
            let failTimer = setTimeout(_ => {
                this.resetVcodeFn();
                clearTimeout(failTimer);
            }, 1000);
            customConfig.failFn && customConfig.failFn({code: 9, msg: 'failFn', type: 'clickVcode'});
        }
    }
})('clickVcode');