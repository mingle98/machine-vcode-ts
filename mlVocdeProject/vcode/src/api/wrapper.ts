import { VcodeWrapperStore, Options, VcodeWraptplStore } from "../interface/vcodeWrapper";
import CommonAbstract from "./abstract/commonAbstarct";
import clickVcode from "./components/clickVcode/clickVcode";
import puzzleVcode from "./components/puzzleVcode/puzzleVcode";
import roateVcode from "./components/roateVcode/roateVcode";
import '../static/style/vcodeWrapper.less';
import { collectionData } from "./components/collectionData/collectionData";

export default class VcodeWrapper extends CommonAbstract{
    name = 'vcodeWrapper';
    public vcodeWrapperStore: VcodeWrapperStore = {
        vcodeType: [],
        colaKey: '',
        isHttps: false,
        mode: 'embed',
        customTxt: this.lang.vcodeWrapLang.customData,
        childVcode: [],
        serverVerify: false,
        collectionDataOptios: {
            postUrl: '',
            open: false,
            initpostUrl: '',
            cuid: '',
            postUrlFn: () => {},
            postInitUrlFn: () => {},
            verifypostUrl: "",
            verifypostUrlFn: () => {},
            apiDataPreFn: () => {}
        }
    };
    public collectionData!: collectionData;
    constructor(options: Options) {
        super();
        this.init(options);
    };
    init(options: Options) {
        this.initData(options);
    };
    initData(options: Options) {
        this.customDataToStore(options, this.vcodeWrapperStore);
        this.customConfig = options;
        if (options.cuid) this.vcodeWrapperStore.collectionDataOptios.cuid = options.cuid;
        // 全局存储用户自定义配置
        window.mlVcodeObject.apiDataPreFn = this.vcodeWrapperStore.collectionDataOptios.apiDataPreFn || null;
        window.mlVcodeObject.collectionDataOptios = this.vcodeWrapperStore.collectionDataOptios || {};
        window.mlVcodeObject.serverVerify = this.vcodeWrapperStore.serverVerify || false;
        // console.log('win store:', window.mlVcodeObject);
        this.collectionData = new collectionData('collectionData', this.vcodeWrapperStore.collectionDataOptios, this);
        // 装在子组件进行统一维护
        this.vcodeTypeStore = {
            clickVcode,
            puzzleVcode,
            roateVcode
        };
        // console.log('vcodeWrapperStore:', this.vcodeWrapperStore, options);
    };
    getTpl(type: keyof VcodeWraptplStore) {
        let dataStore = this.vcodeWrapperStore;
        let vcodeWraptplStore: VcodeWraptplStore = {
            embedBox: '<div class="embedBox" id="' + this.id_prefix + '_embedBox"></div>',
            dialogBox: '<div class="dialogBox" id="' + this.id_prefix + '_dialogBox"></div>',
            vcodeWrap: '<div class="vcodeWrap" id="' + this.id_prefix + '_vcodeWrap">{{bodyBlock}}<div>',
            headerWrap: '<div class="vcodeWrap-header" id=" ' + this.id_prefix + ' _vcodeWrap-header">' 
                        + '<a href="' + dataStore.customTxt.headerConfig.url + '">'
                        + dataStore.customTxt.headerConfig.text + '</a><span class="closeIcon" id="' + this.id_prefix + '_closeIcon"></span></div>',
            contentWrap: '<section class="contentWrap" id="' + this.id_prefix + '_contentWrap">'
                + '<div class="contentWrapLoading" id="' + this.id_prefix + '_contentWrapLoading"><span class="contentWrapLoadinImg" id="'
                + this.id_prefix + '_contentWrapLoadinImg"></span><span class="errIcon" id="' + this.id_prefix + '_errIcon"></span></div></section>',
            footerWrap: '<div class="vcodeWrap-footer" id=" ' + this.id_prefix + ' _vcodeWrap-footer">' 
                        + '<a href="' + dataStore.customTxt.footerConfig.url + '">'
                        + dataStore.customTxt.footerConfig.text + '</a></div>',
        }
        return vcodeWraptplStore[type];
    };
    setEvent() {
        // console.log('setEvent...');
        let closeEle = this.baseCls.getEleById('_closeIcon');
        let vcodeWrapEle_dialogBox = this.baseCls.getEleById('_dialogBox');
        let vcodeWrapEle_embedBox = this.baseCls.getEleById('_embedBox');
        this.baseCls.addEventHandler(closeEle, 'click', () => {
            vcodeWrapEle_dialogBox && this.baseCls.hide(vcodeWrapEle_dialogBox);
            vcodeWrapEle_embedBox && this.baseCls.hide(vcodeWrapEle_embedBox);
        });
    };
    render() {
        window.isHttps = this.vcodeWrapperStore.isHttps || false;
        // 是否开启validateColaKey
        let openValidateColaKey = false;
        if (openValidateColaKey) {
            this.validateColaKey(this.vcodeWrapperStore.colaKey, (res: any) => {
                console.log('ColaKey 验证成功:', res);
                this.insertTplToHtml(this.setEvent.bind(this));
                this.registerChild()?.render(this);
            }, (err: any) => {
                console.log('ColaKey 验证失败:', err);
                alert('ColaKey 验证失败,请前往官网(http://luckycola.com.cn/)获取有效ColaKey');
            }, window.isHttps);
        } else {
            this.insertTplToHtml(this.setEvent.bind(this));
            this.registerChild()?.render(this);
        }
        return this;
    };
    // 将tpl渲染至html中
    insertTplToHtml(callback: Function) {
        let ownSotre = this.vcodeWrapperStore;
        let bodyTpl = this.getTpl('headerWrap') + this.getTpl('contentWrap') + this.getTpl('footerWrap');
        let bodyWrapTpl = this.getTpl('vcodeWrap').replace(/{{bodyBlock}}/g, bodyTpl);
        if (this.customConfig.container
            && this.baseCls.getEleByIdFromPage(this.customConfig.container)) {
            let containerEle = this.baseCls.getEleByIdFromPage(this.customConfig.container);
            ownSotre.mode === 'dialog' && (containerEle!.innerHTML = this.getTpl('dialogBox'));
            ownSotre.mode !== 'dialog' && (containerEle!.innerHTML = this.getTpl('embedBox'));
        } else {
            ownSotre.mode === 'dialog' && this.baseCls.insertHTML('afterBegin', this.getTpl('dialogBox'), document.body);
            ownSotre.mode === 'dialog' && this.baseCls.addClass(this.baseCls.getEleById('_dialogBox')!, 'bodyFixed');
            ownSotre.mode !== 'dialog' && this.baseCls.insertHTML('afterBegin', this.getTpl('embedBox'), document.body);
        };
        let boxEle = this.baseCls.getEleById(ownSotre.mode === 'dialog' ? '_dialogBox' : '_embedBox');
        this.baseCls.insertHTML('afterBegin', bodyWrapTpl, boxEle);
        callback && typeof callback === 'function' && callback();
    };
    registerChild() {
        let ownSotre = this.vcodeWrapperStore;
        // 将需要的子组件注册到父组件中的childVcode
        if (Array.isArray(ownSotre.vcodeType)) {
            ownSotre.childVcode = [];
            ownSotre.vcodeType.forEach(type => {
                let child = this.vcodeTypeStore[type];
                ownSotre.childVcode.push({
                    name: child.name,
                    instance: child
                });
            });
        } else {
            ownSotre.childVcode = [];
            if (!ownSotre.vcodeType) return;
            let child = this.vcodeTypeStore[ownSotre.vcodeType];
            ownSotre.childVcode.push({
                name: child.name,
                instance: child
            });
        };
        // console.log('wraper-registerChild=>', ownSotre.vcodeType, this.vcodeTypeStore, ownSotre.childVcode);
        if (ownSotre.childVcode.length) {
            let index = this.getRandomNumber(0, ownSotre.childVcode.length);
            return ownSotre.childVcode[index].instance;
        };
        return null;
    };
    // 切换
    switchShowVcode(type: 'show' | 'hide') {
        let show = type === 'show';
        let vcodeWrapEle_dialogBox = this.baseCls.getEleById('_dialogBox');
        let vcodeWrapEle_embedBox = this.baseCls.getEleById('_embedBox');
        if (show) {
            vcodeWrapEle_dialogBox && this.baseCls.show(vcodeWrapEle_dialogBox);
            vcodeWrapEle_embedBox && this.baseCls.show(vcodeWrapEle_embedBox);
        } else {
            vcodeWrapEle_dialogBox && this.baseCls.hide(vcodeWrapEle_dialogBox);
            vcodeWrapEle_embedBox && this.baseCls.hide(vcodeWrapEle_embedBox);
        }
    };
}