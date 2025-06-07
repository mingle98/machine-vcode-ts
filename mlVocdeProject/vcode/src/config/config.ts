import utils from "../utils";
let myhttp = 'http://101.43.139.11:90';
let imghttp = 'https://luckycola.com.cn/public';
// let myhttp = 'http://localhost:90';
// let localhttp = location.protocol + '//' + location.host;
let localhttp = myhttp;
// let localhttp = 'http://localhost:90';
let luckColahttp = 'http://luckycola.com.cn';
// let luckColahttp = 'http://localhost';
const configObj = {
  $id_prefix: +new Date(),
  // https://unsplash.it/1600/900?random
  defaultImgList: [
    imghttp + '/imgList/m_1.jpeg',
    imghttp + '/imgList/m_2.jpeg',
    imghttp + '/imgList/m_3.jpeg',
    imghttp + '/imgList/m_4.jpeg',
    imghttp + '/imgList/m_5.jpeg',
    imghttp + '/imgList/m_6.jpeg',
    imghttp + '/imgList/m_7.jpeg',
    imghttp + '/imgList/m_8.jpeg',
    imghttp + '/imgList/m_9.jpeg',
    imghttp + '/imgList/m_10.jpeg',
    imghttp + '/imgList/m_11.jpeg',
    imghttp + '/imgList/m_12.jpeg',
    imghttp + '/imgList/m_13.jpeg',
    imghttp + '/imgList/m_14.jpeg',
    imghttp + '/imgList/m_15.jpeg',
    imghttp + '/imgList/m_16.jpeg',
    imghttp + '/imgList/m_17.jpeg',
    imghttp + '/imgList/m_18.jpeg',
    imghttp + '/imgList/m_19.jpeg',
    imghttp + '/imgList/m_20.jpeg',
    imghttp + '/imgList/m_21.jpeg',
    imghttp + '/imgList/m_22.jpeg',
    imghttp + '/imgList/m_23.jpeg',
  ],
  defaultRoateImgList: [
    imghttp + '/imgList/r_1.jpeg',
    imghttp + '/imgList/r_2.jpeg',
    imghttp + '/imgList/r_3.jpeg',
    imghttp + '/imgList/r_4.jpeg',
    imghttp + '/imgList/r_5.jpeg',
    imghttp + '/imgList/r_6.jpeg',
    imghttp + '/imgList/r_7.jpeg',
    imghttp + '/imgList/r_8.jpeg',
    imghttp + '/imgList/r_9.jpeg',
    imghttp + '/imgList/r_10.jpeg',
    imghttp + '/imgList/r_11.jpeg',


  ],
  defaultFontList: `赵钱孙李周吴郑王朱秦尤许何吕施芒亚芝朽朴机权过臣再协西压厌在有百存而页匠夸夺灰达列死成夹轨邪划迈毕至此贞师尘尖劣光当早吐吓虫曲团同吊吃因吸吗屿帆岁回岂刚则肉网年朱先丢舌竹迁乔伟传乒乓休伍伏优伐延件任伤价份华仰仿伙伪自血向似后行舟全会杀合兆企众爷伞创肌朵杂危旬旨负各名多争色壮冲冰庄庆亦刘齐交次衣产决充妄闭问闯羊并关米灯州汗污江池汤忙兴宇守宅字安讲军许论农讽设访寻那迅尽导异孙阵阳收阶阴防奸如妇好她妈戏羽观欢买红纤级约纪驰巡张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐走抄坝贡攻赤折抓扮抢孝均抛投坟抗坑坊抖护壳志扭块声把报却劫芽花芹芬苍芳严芦劳克苏杆杠杜材村杏极李杨求更束豆两丽医辰励否还歼来连步坚旱盯呈时吴助县里呆园旷围呀吨足邮男困吵串员听吩吹呜吧吼别岗帐财针钉告我乱利秃秀私每兵估体何但伸作伯伶佣低你住位伴身皂佛近彻役返余希坐谷妥含邻岔肝肚肠龟免狂犹角删条卵岛迎饭饮系言`,
  clickVcodeConfig: {
    fontNum: 5,
    verifyFontNum: 3,
    accuracy: 30
  },
  puzzleVcodeConfig: {
    puZoperateTip: '请完成拼图',
    puZshape: 'puzzle',
    puZl: 51,// 滑块边长
    puZr: 0, // 滑块半径
    puZpy: 0,// 半圆的偏移量
    accuracy: 10
  },
  roateVcodeConfig: {
    roateOperateTip: '请转正图片完成验证',
    // 随机旋转度数范围 
    randomDeg: [10, 330],// 350-30
    accuracy: 10
  },
  // 数据采集配置
  collectionDataConfig: {
    openLocalUrl: false,
    postUrl: `${localhttp}/mlvcode`,
    localpostUrl: `${localhttp}/mlvcode`,
    postInitUrl: `${localhttp}/initmlvcode `,
    localpostInitUrl: `${localhttp}/initmlvcode`
  },
  validateColaKeyApi: `${luckColahttp}/validate/validateColaKey`,
  getConfigImgsfromServer: (fromServer: boolean = false, customImgsConfig?: {url: string, method: string}) => {
    if (fromServer && customImgsConfig && customImgsConfig?.url) {
      configObj.syncImgReq(customImgsConfig);
    };
    return configObj.defaultImgList;
  },
  syncImgReq: async (customImgsConfig: { url: string, method: string }) => {
    try {
      let tresData: any = await utils.$https.request({
        url: customImgsConfig.url,
        method: customImgsConfig.method || 'get',
        withCredentials: true, // default
      });
      configObj.defaultImgList = tresData?.data?.ImgLists || configObj.defaultImgList
    } catch (error) { }
    return configObj.defaultImgList;
  },
  randomShaps: [
      {
          type: 'rect',
          fn: (ctx: CanvasRenderingContext2D, x: number, y: number, l: number) => {
              ctx.moveTo(x, y);
              // ctx.arc(x + l / 2, y, 10, 180 * Math.PI / 180, 360 * Math.PI / 180);
              ctx.lineTo(x + l, y);
              // ctx.arc(x + l, y + l / 2, 10, 270 * Math.PI / 180, 450 * Math.PI / 180);
              ctx.lineTo(x + l, y + l);
              ctx.lineTo(x, y + l);
              ctx.lineTo(x, y);
          }
      },
      {
          type: 'sanjiao',
          fn: (ctx: CanvasRenderingContext2D, x: number, y: number, l: number) => {
              ctx.moveTo(x, y);
              ctx.lineTo(x + l, y);
              ctx.lineTo(x + l, y + l);
              ctx.lineTo(x, y);
          }
      },
      {
          type: 'duobian',
          fn: (ctx: CanvasRenderingContext2D, x: number, y: number, l: number) => {
              ctx.moveTo(x, y);
              ctx.lineTo(x + l / 2, y);
              ctx.lineTo(x + l, y);
              ctx.lineTo(x + l, y + 14);
              ctx.lineTo(x + l - 12, y + 14);
              ctx.lineTo(x + l - 12, y + 38);
              ctx.lineTo(x + l, y + 38);
              ctx.lineTo(x + l, y + l);
              ctx.lineTo(x, y + l);
              ctx.lineTo(x, y + l- 14);
              ctx.lineTo(x + 12, y + l - 14);
              ctx.lineTo(x + 12, y + l - 38);
              ctx.lineTo(x, y + l - 38);
              ctx.lineTo(x, y);
          }
      },
      {
          type: 'liubian',
          fn: (ctx: CanvasRenderingContext2D, x: number, y: number, l: number) => {
              ctx.moveTo(x, y + 17);
              ctx.lineTo(x + 17, y);
              ctx.lineTo(x + 34, y);
              ctx.lineTo(x + l, y + 17);
              ctx.lineTo(x + l, y + 34);
              ctx.lineTo(x + l - 17, y + l);
              ctx.lineTo(x + l - 34, y + l);
              ctx.lineTo(x, y + l - 17);
              ctx.lineTo(x, y + 17);
          }
    },
    {
      type: 'sanzjiao2',
      fn: (ctx: CanvasRenderingContext2D, x: number, y: number, l: number) => {
        ctx.moveTo(x + l / 2, y);
        ctx.lineTo(x + l, y + l * 4 / 5);
        ctx.lineTo(x, y + l * 4 / 5);
        ctx.lineTo(x + l / 2, y);
      }
    },
    {
      type: 'linxing',
      fn: (ctx: CanvasRenderingContext2D, x: number, y: number, l: number) => {
        ctx.moveTo(x + l / 2, y);
        ctx.lineTo(x + l, y + l / 2);
        ctx.lineTo(x + l / 2, y + l);
        ctx.lineTo(x, y + l / 2);
        ctx.lineTo(x + l / 2, y);
      }
    }
  ]
};

export default configObj;