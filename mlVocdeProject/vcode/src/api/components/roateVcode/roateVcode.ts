import { RoateTplStore, RoateVcodeFunctionStore, RoateVcodeStore } from "../../../interface/roateVcode";
import VcodeAbstract from "../../abstract/vcodeAbstract";
import VcodeWrapper from "../../wrapper";
import globalConfig from "../../../config/config";
import '../../../static/style/roateVcode.less';
import slidebar from "../common/slidebar";
import { VerifyStatusStyle } from "../../../enum/enum";
import { collectionData } from '../collectionData/collectionData';

export default new (class extends VcodeAbstract {
    name: string;
    parentComparent!: VcodeWrapper;
    canvasCtx!: CanvasRenderingContext2D;
    canvasAttrbutes!: DOMRect;
    childComponents: any[] = [];
    isResetDingFlag: boolean = false;
    private roateVcodeStore: RoateVcodeStore= {
        roateOperateTip: globalConfig.roateVcodeConfig.roateOperateTip,
        roateimgList: globalConfig.defaultRoateImgList,
        roateCurrImg: '',
        // 随机旋转度数范围
        randomDeg: globalConfig.roateVcodeConfig.randomDeg,
        roateVerifyData: {
            accuracy: globalConfig.roateVcodeConfig.accuracy,
            originDeg: 0,
            targetDeg: 0,
            operateDeg: 0
        }
    }
    constructor(componentName: string) {
        super();
        this.name = componentName;
    };
    init(options?: any) {
        this.initData();
    };
    getTpl(type: keyof RoateTplStore) {
        let roateTplStore: RoateTplStore = {
            roateVcodeBox: '<div class="roateVcodeBox" id="' + this.id_prefix + '_roateVcodeBox">{{roateVcodeImgBody}}</div>',
            roateVcodeImgArea: '<section class="roateVcodeImgArea" id="' + this.id_prefix + '_roateVcodeImgArea"><div class="roateResetBtn" id="'
                + this.id_prefix + '_roateResetBtn"></div><div class="roateVcodeImgwrap" id="' + this.id_prefix + '_roateVcodeImgwrap"><div class="roateVcodeImgWrap" id="'
                + this.id_prefix + '_roateVcodeImgWrap"></div><div class="roateImgIconBox" id="' + this.id_prefix + '_roateImgIconBox"><p class="roateImgIconBox_sucess" id="'
                + this.id_prefix + '_roateImgIconBox_sucess"></p><p class="roateImgIconBox_fail" id="' + this.id_prefix + '_roateImgIconBox_fail"></p></div></div></section>',
            roateOperateBox: '<section class="roateOperateBox" id="' + this.id_prefix + '_roateOperateBox">{{roateOperateBody}}</section>',
            roateOperateTips: '<p class="roateOperateTips" id="' + this.id_prefix + '_roateOperateTips">' + this.roateVcodeStore.roateOperateTip + '</p>'
        };
        return roateTplStore[type];
    };
    initData(options?: any) {
        this.customDataToStore(this.parentComparent.customConfig, this.roateVcodeStore);
        this.insertTplToHtml();
    };
    render(parent: VcodeWrapper) {
        this.parentComparent = parent;
        this.init();
        // console.log('roate-render....', this);
    };
    insertTplToHtml(callback?: Function) {
        let _contentWrap = this.baseCls.getEleById('_contentWrap');
        let roateVcodeBoxTpl = this.getTpl('roateVcodeBox').replace(/{{roateVcodeImgBody}}/g, this.getTpl('roateVcodeImgArea'));
        let roateOperateBoxTpl = this.getTpl('roateOperateBox').replace(/{{roateOperateBody}}/g, this.getTpl('roateOperateTips'));
        this.baseCls.insertHTML('afterBegin', roateOperateBoxTpl, _contentWrap);
        this.baseCls.insertHTML('afterBegin', roateVcodeBoxTpl, _contentWrap);
        let _roateVcodeImgWrap = this.baseCls.getEleById('_roateVcodeImgWrap')!;
        this.getImg(_roateVcodeImgWrap);
    };
    getImg(imgContentWrap: Element) {
        let ownDataStore = this.roateVcodeStore;
        let imgSrcList = ownDataStore.roateimgList.length > 0 ? ownDataStore.roateimgList : globalConfig.defaultRoateImgList;
        this.initImg((img: HTMLImageElement) => {
            img.className = 'roateVcodeImg';
            img.id = this.id_prefix + '_roateVcodeImg';
            // 随机旋转度数
            let randomDeg = ownDataStore.roateVerifyData.originDeg = this.getRandomNum(ownDataStore.randomDeg[0], ownDataStore.randomDeg[1]);
            ownDataStore.roateVerifyData.targetDeg = 360 - randomDeg;
            // console.log(img, randomDeg, ownDataStore.roateVerifyData);
            imgContentWrap.appendChild(img);
            this.setImgEleDeg(randomDeg);
            !this.isResetDingFlag && this.setEvent();
            this.isResetDingFlag = false;
        }, () => {
            let me = this;
            this.parentComparent.setloading(true, 'error').onclick = function () {
                me.resetVcodeFn();
                let timer = setTimeout(() => {
                    me.isResetDingFlag && (me.isResetDingFlag = false);
                    clearTimeout(timer);
                }, 3000);
            };
        }, imgSrcList);
    };
    setEvent() {
        let me = this;
        let roateResetBtnEle = this.baseCls.getEleById('_roateResetBtn');
        this.baseCls.addEventHandler(roateResetBtnEle, 'click', me.getFunctionStore('resetBtn_click_fn'));
        let slideInstance = slidebar.renderSlider(this, {
            callbacks: {
                slideStartFn: (originX: number, originY: number) => {
                    // console.log('父亲逐渐中的slideStartFn回调函数执行:', originX, originY);
                    let fn = me.getFunctionStore('movestartfn') as ((originX: number, originY: number) => any);
                    fn(originX, originY);
                },
                slidemoveFn: (moveX: number) => {
                    // console.log('父亲逐渐中的slidemoveFn回调函数执行:', moveX);
                    let fn = me.getFunctionStore('moveduringfn') as ((moveX: number) => any);
                    fn(moveX);
                },
                slideEndFn: (tail: any[], slideMoveData: any[]) => {
                    // console.log('父亲逐渐中的slideEndFn回调函数执行:', tail);
                    let fn = me.getFunctionStore('moveendfn') as RoateVcodeFunctionStore['moveendfn'];
                    fn(tail, slideMoveData);
                }
            },
            parentEle: '_roateOperateBox',
            afterBegin: false
        });
        me.childComponents.push(slideInstance);
    };
    resetVcodeFn(): void {
        if (this.isResetDingFlag) return;
        this.isResetDingFlag = true;
        let roateVcodeImgWrapEle = this.baseCls.getEleById('_roateVcodeImgWrap');
        this.setImgEleDeg(0);
        roateVcodeImgWrapEle?.childNodes[0] && roateVcodeImgWrapEle?.removeChild(roateVcodeImgWrapEle.childNodes[0]);
        this.getImg(this.baseCls.getEleById('_roateVcodeImgWrap')!);
        this.changeVerifyStatus('wait');
    };
    getFunctionStore(type: keyof RoateVcodeFunctionStore) {
        let me = this;
        let parentComStore = me.parentComparent.vcodeWrapperStore;
        let parentCom = me.parentComparent;
        let functionStoreObj: RoateVcodeFunctionStore = {
            movestartfn: function (originX: number, originY: number): void {},
            moveduringfn: function (moveX: number): void {
                let slidebarDOM = (me.childComponents[0] as typeof slidebar).slidebarStore.barAttrbutes;
                let totalWidth = slidebarDOM?.width;
                // 旋转度数
                if (totalWidth) {
                    let shouldDeg = moveX / (totalWidth - 50) * 360 + me.roateVcodeStore.roateVerifyData.originDeg;
                    me.roateVcodeStore.roateVerifyData.operateDeg = moveX / (totalWidth - 50) * 360;
                    me.setImgEleDeg(shouldDeg);
                    me.changeVerifyStatus('action');
                };
            },
            moveendfn: function (tail: any[], slideMoveData: any[]): void {
                const { verified } = me.shakeVerifyFn(tail);
                const degVerify = Math.abs(me.roateVcodeStore.roateVerifyData.operateDeg - me.roateVcodeStore.roateVerifyData.targetDeg) <= me.roateVcodeStore.roateVerifyData.accuracy;
                let verifyResult = false;
                function handerResultFn () {
                    if (verifyResult) {console.log('verifyResult_okkk')
                        return me.changeVerifyStatus('success');
                    };
                    me.changeVerifyStatus('fail');
                    let timer = setTimeout(() => {
                        me.resetVcodeFn();
                        clearTimeout(timer);
                    }, 1000);
                };
                if (parentComStore.serverVerify && verified && degVerify) {
                    parentCom.collectionData.postData('verify', { verData: slideMoveData }, (res: any) => {
                        if (parentCom.vcodeWrapperStore.collectionDataOptios.open) {
                            verifyResult = verified && degVerify;
                        } else {
                            verifyResult = verified && degVerify && res?.type === 'verify' && +res?.code === 0;
                        }
                        handerResultFn();
                    }, (res: any) => {
                        verifyResult = false;
                        handerResultFn();
                    });
                } else {
                    verifyResult = verified && degVerify;
                    handerResultFn();
                };
                // console.log('move_end_fn:验证结果:', spliced, verified);
            },
            resetBtn_click_fn: function () {
                me.resetVcodeFn();
            },
        }
        return functionStoreObj[type];
    };
    setImgEleDeg(deg: number) {
        const imgBoxEle = this.baseCls.getEleById('_roateVcodeImgWrap');
        if (!imgBoxEle) return;
        imgBoxEle.style.transform = `rotate(${deg}deg)`;
    };
    // 验证状态样式
    changeVerifyStatus(type: keyof typeof VerifyStatusStyle) {
        const customConfig = this.parentComparent.customConfig;
        let _puzzleVcodeInnerBar = this.baseCls.getEleById('_puzzleVcodeInnerBar');
        let innerBarAction = this.baseCls.getEleById('_puzzleVcodeInnerBarAction')!;
        let _puzzleVcodeOutBar = this.baseCls.getEleById('_puzzleVcodeOutBar');
        let _roateOperateTips = this.baseCls.getEleById('_roateOperateTips');
        let _roateImgIconBox_sucess = this.baseCls.getEleById('_roateImgIconBox_sucess');
        let _roateImgIconBox_fail = this.baseCls.getEleById('_roateImgIconBox_fail');
        let _roateImgIconBox = this.baseCls.getEleById('_roateImgIconBox');
        let parentComStore = this.parentComparent.vcodeWrapperStore;
        let parentCom = this.parentComparent;
        let addClass = this.baseCls.addClass.bind(this.baseCls);
        let removeClass = this.baseCls.removeClass.bind(this.baseCls);
        let hide = this.baseCls.hide.bind(this.baseCls);
        let show = this.baseCls.show.bind(this.baseCls);
        _roateImgIconBox_sucess && hide(_roateImgIconBox_sucess);
        _roateImgIconBox_fail && hide(_roateImgIconBox_fail);
        _roateImgIconBox && hide(_roateImgIconBox);
        switch (type) {
            case 'action':
                _puzzleVcodeInnerBar && addClass(_puzzleVcodeInnerBar, 'roateVerifyAction_inbar');
                _puzzleVcodeOutBar && addClass(_puzzleVcodeOutBar, 'roateVerifyAction_outbar');
                _roateOperateTips && addClass(_roateOperateTips, 'roateVerifyAction_tips');
                break;
            case 'fail':
                _puzzleVcodeInnerBar && addClass(_puzzleVcodeInnerBar, 'roateVerifyFail_inbar');
                _puzzleVcodeOutBar && addClass(_puzzleVcodeOutBar, 'roateVerifyFail_outbar');
                _roateOperateTips && addClass(_roateOperateTips, 'roateVerifyFail_tips');
                _roateImgIconBox && show(_roateImgIconBox);
                _roateImgIconBox_fail && show(_roateImgIconBox_fail);
                _roateOperateTips!.innerText = '验证失败请重试';
                customConfig.failFn && customConfig.failFn({code: 9, msg: 'failFn', type: 'puzzleVcode'});
                break;
            case 'success':
                _puzzleVcodeInnerBar && addClass(_puzzleVcodeInnerBar, 'roateVerifySucc_inbar');
                _puzzleVcodeOutBar && addClass(_puzzleVcodeOutBar, 'roateVerifySucc_outbar');
                _roateOperateTips && addClass(_roateOperateTips, 'roateVerifySucc_tips');
                _roateImgIconBox && show(_roateImgIconBox);
                _roateImgIconBox_sucess && show(_roateImgIconBox_sucess);
                _roateOperateTips!.innerText = '恭喜您,验证通过';
                // 告知服务端清楚本次tk记录
                if (parentComStore.serverVerify && !parentComStore.collectionDataOptios.open) {
                    parentCom.collectionData.postData('destroy', {}, (res: any) => {}, (res: any) => {});
                };
                customConfig.successFn && customConfig.successFn({code: 0, msg: 'success', type: 'puzzleVcode'});
                break;
            case 'wait':
                if (_puzzleVcodeInnerBar && _puzzleVcodeOutBar && _roateOperateTips) {
                    removeClass(_puzzleVcodeInnerBar, 'roateVerifyFail_inbar');
                    removeClass(_puzzleVcodeOutBar, 'roateVerifyFail_outbar');
                    removeClass(_roateOperateTips, 'roateVerifyFail_tips');
                    removeClass(_puzzleVcodeInnerBar, 'roateVerifySucc_inbar');
                    removeClass(_puzzleVcodeOutBar, 'roateVerifySucc_outbar');
                    removeClass(_roateOperateTips, 'roateVerifySucc_tips');
                    removeClass(_puzzleVcodeInnerBar, 'roateVerifyAction_inbar');
                    removeClass(_puzzleVcodeOutBar, 'roateVerifyAction_outbar');
                    removeClass(_roateOperateTips, 'roateVerifyAction_tips');
                    innerBarAction.style.width = _puzzleVcodeInnerBar!.style.left = 0 + 'px';
                    _roateOperateTips!.innerText = this.roateVcodeStore.roateOperateTip;
                }
                break;
            default:
                break;
        }
    }

})('roateVcode');