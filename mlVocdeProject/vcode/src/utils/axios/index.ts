import axios, { Axios, AxiosRequestConfig } from "axios";
import { AxiosOptions, AxiosRequest } from "../../interface/utils";

export class Http {
  axios: Axios;
  constructor(axiosOptions: AxiosOptions) {
    this.axios = axios.create({
      baseURL: axiosOptions.baseURL,
      timeout: axiosOptions.timeout,
      headers: { 'X-Custom-Header': 'foobar' },
      withCredentials: true,
    });
    this.interceptors(this.axios);
  };
  request(config: AxiosRequestConfig) {
    let instance = this.axios;
    config.withCredentials = true;
    return new Promise((resolve, reject) => {
      instance.request(config).then(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    });
  };
  interceptors(axios: Axios) {
    // 添加请求拦截器
    axios.interceptors.request.use(function (config: AxiosRequestConfig) {
      // 在发送请求之前做些什么
      try {
        if (window.mlVcodeObject && window.mlVcodeObject.collectionDataOptios
          && window.mlVcodeObject.collectionDataOptios.open
          && window.mlVcodeObject.apiDataPreFn
          && window.mlVcodeObject.serverVerify
          && typeof window.mlVcodeObject.apiDataPreFn == 'function') {
          let apiDataPreCfg = window.mlVcodeObject.apiDataPreFn(config);
          if (apiDataPreCfg && apiDataPreCfg.baseURL && apiDataPreCfg.method) {
              config = apiDataPreCfg;
          };
          // console.log('apiDataPreCfg--->:', apiDataPreCfg, config);
        };
      } catch (error) {}
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      return response;
    }, function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    });
  }
}