import { CollectionDataOptions, PostData } from '../../../interface/collectionData';
import utils from '../../../utils';
import CollectionData from '../../abstract/collectionData';
import VcodeWrapper from '../../wrapper';

export class collectionData extends CollectionData {
  name: string;
  constructor(name: string, options: CollectionDataOptions, parentInstance: VcodeWrapper) {
    super(options, parentInstance);
    this.name = name;
  }
  async postData(
    type: 'verify' | 'during' | 'destroy' = 'during',
    verData?: any,
    callback?: Function,
    failFn?: Function
  ) {
    try {
      if (!this.collectionDataStore.postInitDataOk) {
        alert('初始化失败无法进行后端验证,情尝试刷新重新进行初始化!');
        failFn && failFn('err');
        return;
      }
      let postApi = this.collectionDataStore.postUrl;
      if (type === 'during' && this.customCollectionDataOptios.open) {
        postApi = this.customCollectionDataOptios.postUrl;
      } else if (type === 'verify' && this.customCollectionDataOptios.open) {
        postApi = this.customCollectionDataOptios.verifypostUrl;
      }
      const res = await utils.$https.request({
        url: postApi,
        method: 'post',
        data: {
          type: type,
          verData,
          cuid: this.customCollectionDataOptios.cuid || '',
          ...this.collectionDataStore.verifyData
        }
      });
      if (this.customCollectionDataOptios.open) {
        type === 'during' && this.customCollectionDataOptios.postUrlFn(res);
        type === 'verify' && this.customCollectionDataOptios.verifypostUrlFn(res, callback, failFn);
        return;
      }
      if (+(<PostData>res).data.code === 0 && +(<PostData>res).status === 200) {
        const tk = this.collectionDataStore.verifyData.rzData.tk;
        tk !== (<PostData>res).data.data.tk &&
          (this.collectionDataStore.verifyData.rzData.tk = (<PostData>res).data.data.tk);
        // console.log('postDataSuccess:' + type, (<PostData>res).data.data.tk);
        callback && callback((<PostData>res).data);
      } else {
        failFn && failFn((<PostData>res).data);
      }
      this.resetDzData();
    } catch (error) {
      this.resetDzData();
      console.log('postDataErr:', error);
    }
  }
}
