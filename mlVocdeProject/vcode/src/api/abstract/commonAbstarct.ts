import { Base } from "../components/base/base";
import globalConfig from '../../config/config';
import { langData } from "../../config/lang";
import { Options } from "../../interface/vcodeWrapper";
import { VcodeTypeStore } from "../../interface/commonAbstarct";
import utils from '../../utils/index';

export default abstract class CommonAbstract {
    protected baseCls: Base;
    protected id_prefix: number = globalConfig.$id_prefix;
    protected lang: typeof langData = langData;
    protected vcodeTypeStore!: VcodeTypeStore;
    protected utils: typeof utils = utils;
    public customConfig!: Options;
    constructor() {
        this.baseCls = new Base();
    };
    abstract init(options?: any): any;
    abstract initData(options?: any): any;
    abstract getTpl(type: string): any;
    abstract setEvent(): any;
    abstract render(parent?: any): any;
    abstract insertTplToHtml(callback?: Function): any;
    // 用户配置的参数同步合并进内部store
    customDataToStore(customData: Options, ownDataStore: any) {
        let ownSotre = ownDataStore;
        for (const key in customData) {
            if (Object.prototype.hasOwnProperty.call(customData, key) && key in ownSotre) {
                const item = customData[key];
                if (item === ownSotre[key]) continue;
                ownSotre[key] = item;
            };
        };
        // console.log('customData:', customData, 'ownDataStore:', ownSotre);
    };
    // loding
    setloading(bool: boolean, type: 'loading' | 'error') {
        let loadingEle = this.baseCls.getEleById('_contentWrapLoading')!;
        let _contentWrapLoadinImg = this.baseCls.getEleById('_contentWrapLoadinImg')!;
        let _errIcon = this.baseCls.getEleById('_errIcon')!;
        this.baseCls.hide(_errIcon);
        this.baseCls.hide(_contentWrapLoadinImg);
        if (type === 'error') {
            this.baseCls.show(_errIcon);
        } else {
            this.baseCls.show(_contentWrapLoadinImg);
        }
        bool ? this.baseCls.show(loadingEle) : this.baseCls.hide(loadingEle);
        return type === 'error' ? _errIcon : _contentWrapLoadinImg;
    };
    getRandomNumber(startNum: number, endNum: number): number {
        if (endNum <= startNum) return startNum;
        return Math.floor(Math.random() * (endNum - startNum) + startNum);
    };
    async validateColaKey(colaKey: string, successFn: Function, failFn: Function, isHttps = false) {
        try {
            let reqApi = globalConfig.validateColaKeyApi;
            // if (isHttps) {
                reqApi = reqApi.replace('http://', 'https://');
            // }
            let res = await utils.$https.request({
                url: reqApi,
                method: 'post',
                data: {
                    colaKey
                },
            });
            if ((res as any).data.code === 0) {
                successFn && successFn(res);
            } else {
                failFn && failFn(res);
            };
        } catch (error) {
            failFn && failFn(error);
            console.log('validateColaKey Err:', error);
        };
    }
};