import globalConfig from '../../../config/config';

export class Base {
  constructor () {};
  // 2.将JSONP封装成函数
  jsonp(options: any){
      // 创建script标签
      let script = document.createElement("script");
      // 拼接字符串的变量
      let params = "";
      for(let attr in options.data){
          params += "&" + attr + "=" + options.data[attr];
      }
      // 解决多次请求函数名重复导致的数据重叠问题(函数名myjsonp-123456格式)
      let fnName = "myjsonp" + Math.random().toString().replace(".", "")
      // 将定义的函数也封装进去了，但是它已经不是全局函数了（因此我们要想办法将他变成全局函数就要挂载到window对象下）
      window[fnName as any] = options.success;
      // 设置src属性
      script.src = options.url + "?callback=" + fnName + params;
      // 将script标签追加到页面中
      document.body.appendChild(script);
      // 为script标签添加onload事件
      script.onload=function(){
          // 将body中的script标签删除
          document.body.removeChild(script);
      };
  };
  // 3.节流函数
  throttle(fn: Function, delay = 500) {
      let firstFlag = true;
      let timer: any;
      return  (...ags: any[]) => { 
          let self = this;
          if (firstFlag) {
              fn.apply(self, ags);
              firstFlag = false;
          };
          if (!timer) {
              timer = setTimeout(function () { 
                  fn.apply(self, ags);
                  timer = null;
              }, delay);
          };
      };
  };
  // 4.防抖函数
  debounce(fn: Function, delay: any) {
      let timer: any;
      return  (params: any) => { 
          let self  = this;
          if (timer) clearTimeout(timer);
          timer = setTimeout(function () { 
              fn.apply(self, params);
              timer = null;
          }, delay || 500);
      }
  };
  // 5.事件监听
  addEventHandler(elem: any, type: string, handler: Function) {
      if (elem.addEventListener) {
          elem.addEventListener(type, handler, false);
      }
      else if (elem.attachEvent) {
          elem.attachEvent('on' + type, handler);
      }
      else {
          elem['on' + type] = handler;
      }
  };
  removeEventHandler(elem: any, type: string, handler: Function) {
      if (elem.addEventListener) {
          elem.removeEventListener(type, handler, false);
      }
      else if (elem.detachEvent) {
          elem.detachEvent('on' + type, handler);
      }
      else {
          elem['on' + type] = null;
      }
  };
  // 6.创建script标签
  createScriptTag(srcElem: HTMLScriptElement, src: string, charset: string) {
      srcElem.setAttribute('type', 'text/javascript');
      charset && srcElem.setAttribute('charset', charset);
      srcElem.setAttribute('src', src);
      document.getElementsByTagName('head')[0].appendChild(srcElem);
  };
  removeScriptTag(srcElem: any) {
      // 删属性
      if (srcElem.clearAttributes) {
          srcElem.clearAttributes();
      }
      else {
          for (const key in srcElem) {
              if (srcElem.hasOwnProperty(key)) {
                  delete srcElem[key];
              };
          };
      };
      // 删节点
      if (srcElem && srcElem.parentNode) {
          srcElem.parentNode.removeChild(srcElem);
      };
      // 销毁
      srcElem = null;
  };
  // 7.处理节点的类
  // 判断是否有className
  hasClassName(ele: Element, cName: any) {
      return !!ele.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
  };
  addClass(ele: Element, cName: any) {
      if (!this.hasClassName(ele, cName)) {
          // 获取class内容
          let classObj = ele.className;
          // 是否需要加空格 如果className是空就不需要
          let bank = (classObj === '') ? '' : ' ';
          ele.className += bank + cName;
      };
      return this;
  };
    removeClass(dom: Element, cName: any) {
      if (this.hasClassName(dom, cName)) {
          if (dom.className.indexOf(' ' + cName + ' ') >= 0) {
              dom.className = dom.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ');
          } else {
              dom.className = dom.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), '');
          };
      }
      return this;
  }
  // 8.阻止默认事件（冒泡或则a标签等)
  stopPropagation(e: Event) {
      if (e.stopPropagation) {
          e.stopPropagation();
      }
      else {
          e.cancelBubble = true;
      }
  };
  preventDefault(e: Event) {
      if (e.preventDefault) {
          e.preventDefault();
      }
      else {
          e.returnValue = false;
      }
  };
  // 9.给url上加query
  // 处理query
  buildQuery(query: any) {
      if (typeof query === 'string') {
          return query;
      };
      if (typeof query === 'object') {
          let builder = [];
          for(const key in query) {
              if(query.hasOwnProperty(key)) {
                  let value = query[key];
                  if (value) {
                      builder.length && builder.push('&');
                      let res = (typeof value === 'boolean') ? (value ? '1' : '0') : value.toString();
                      builder.push(key, '=', res);
                  }
              }
          }
          return builder.join('');
      };
      return null;
  };
  appendQuery(url: string, query: any) {
      query = this.buildQuery(query);
      if (typeof (query) === 'string') {
          let hasQuery = (/\?/g).test(url);
          url += (hasQuery ? "&" : "?") + query;
      };
      return query;
  };
  // 10.通过id获取元素
  getEleById(id_tail: string) {
      if (!globalConfig.$id_prefix) return null;
      let allid = String(globalConfig.$id_prefix) + String(id_tail);
      let targetDom = document.getElementById(allid);
      if (targetDom) {
          return targetDom;
      };
      return null;
  };
  // 11.获取ie浏览器版本
  IEVersion () {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
      let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器  
      let isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器  
      let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
      if (isIE) {
          let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
          reIE.test(userAgent);
          let fIEVersion = parseFloat(RegExp['$1']);
          if (fIEVersion == 7) {
              return 7;
          } else if (fIEVersion == 8) {
              return 8;
          } else if (fIEVersion == 9) {
              return 9;
          } else if (fIEVersion == 10) {
              return 10;
          } else {
              return 6;//IE版本<=7
          }   
      } else if(isEdge) {
          return 'edge';//edge
      } else if(isIE11) {
          return 11; //IE11  
      } else {
          return -1;//不是ie浏览器
      }
  };
  // 12.获取cookie
  getRaw(key: any) {
      let reg = new RegExp('(^| )' + key + '=([^;]*)(;|\x24)');
      let result = reg.exec(document.cookie);
      if (result) {
          return result[2] || null;
      }

      return null;
  };
  getCookie(key: any) {
      let value = this.getRaw(key);
      if (typeof value === 'string') {
          value = decodeURIComponent(value);
          return value;
      }
      return null;
  };
  // 13.获取安卓版本号
  get_android_version() {
      let ua = navigator.userAgent.toLowerCase();
      let version = null;
      if (ua.indexOf('android') > 0) {
          let reg = /android [\d._]+/gi;
          let vInfo = ua.match(reg);
          version = (vInfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.'); // 得到版本号4.2.2
          version = parseInt(version.split('.')[0], 10);// 得到版本号第一位
      };
      return version;
  };
  // 14.插入模板字符串的方法
  insertHTML(position: 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd', tempStr: any, parentEle: any) {
      // beforeBegin: 插入到标签开始前
      // afterBegin:插入到标签开始标记之后
      // beforeEnd:插入到标签结束标记前
      // afterEnd:插入到标签结束标记后
      // console.log('insertHTML:', position, tempStr, parentEle);
      if (parentEle) {
          parentEle.insertAdjacentHTML(position, tempStr);
      }
      else {
          let box = document.createElement('div');
          this.insertHTML('afterBegin', tempStr, box);
          document.body.appendChild(box);
      };
  };
  // 15.隐藏或者显示元素
  toggleShow(elem: any) {
      if (!elem) return;
      if (elem.style.display === 'none') {
          elem.style.display = 'block';
      }
      else {
          elem.style.display = 'none';
      }
  };
  // 16.获取设备视口宽高
  getSViewportOffset() {
      if (window.innerWidth) {
          return {
              w: window.innerWidth,
              h: window.innerHeight
          }
      } else {
          if (document.compatMode === "BackCompat") {
              return {
                  w: document.body.clientWidth,
                  h: document.body.clientHeight
              }
          } else {
              return {
                  w: document.documentElement.clientWidth,
                  h: document.documentElement.clientHeight
              }
          }
      }
  };
  // 17.判断是否为pc浏览器
  isPC() {
      let userAgentInfo = navigator.userAgent;
      let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      return flag;
  };
  // 18.延时函数
  async sleep(delay = 500) {
      let fn = function () {
          return new Promise<void>((resolve) => {
              setTimeout((_: any) => {
                  resolve();
                  console.log('sleep...', delay);
              }, delay);
          })
      };
      await fn();
  };
  // 19.封装获取query参数的方法
  getQueryString(name: any) {
      let locationArray = location.href.substring(location.href.indexOf("?") + 1).split("&");
      let locationObj: any = {};
      for (let i = 0,
          len = locationArray.length; i < len; i++) {
          let tempArray = locationArray[i].split("=");
          locationObj[tempArray[0]] = tempArray[1]
      }
      if (name && name !== 0 && name !== false) {
          return locationObj[name] ? locationObj[name] : ""
      } else {
          return locationObj
      }
  };
  // 20. 异常和显示元素
  show(ele: HTMLElement): void {
    ele.style.display = 'block';
  };
  hide(ele: HTMLElement): void {
    ele.style.display = 'none';
  };
  // 21 获取页面节点通过id
  getEleByIdFromPage(id: string, type: boolean = false) {
    if (typeof id !== 'string') {
        id = String(id);
    };
    return type ? document.getElementById(id) : document.querySelector(/#/g.test(id) ? id : '#' + id);
  };
  // 22 打点
  logAll(name: string) {
        var me = this;
        try {
            var link = document.location.protocol + '//nsclick.baidu.com/v.gif?'
                + 'pid=111&data_source=fe&type=1023'
                + '&source=' + (me.getQueryString('clientfrom') || 'wap')
                + '&client=' + (me.getQueryString('client') || '')
                + '&v=' + new Date().getTime()
                + '&tpl=' + me.getQueryString('tpl');
            link += '&auto_statistic=' + me.base64encode('{eventType:' + name + '}');
            link += '&auto_en=' + name;

            let img: HTMLImageElement | null = new Image();
            img.onload = img.onerror = function () {
                (<HTMLImageElement>img).onload = (<HTMLImageElement>img).onerror = null;
                img = null;
            };
            img.src = link;
        } catch (error) {
            // error
        }
    };
    // 23 加密
    base64encode(str: string) {
        var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var out;
        var i;
        var len;
        var c1;
        var c2;
        var c3;
        len = str.length;
        i = 0;
        out = '';
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i === len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += '==';
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i === len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += '=';
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
};