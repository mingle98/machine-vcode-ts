

// 导入第三方模板引擎art-template模块
// let template=require("art-template");


// 导入并接受集合模块
// let student = require("../model/Student.js")
// 导入系统模块querystring模块
let querystring = require("querystring");
// 导入第三方路由模块（返回值是用于创建路由对象的方法函数）
let getRouter = require("router");
// 通过方法创建路由对象(这个路由对象本质上也是一个方法)
const router = getRouter();
const axios = require('axios');
const request = require('request');

const {setDeviceCuidItem, clearDeviceIdsFn, updateDeviceCuidStatus} = require('../utils/cuidLists');
// 验证码mlvcode
const {mlVocode, aStore} = require('../vcodeStrategy/Strategy');

// 设备安全验证信息
global.deviceIds = {
	// '123456': {
	// 	startT: '11',
	// 	endT: '22',
	// 	status: 0,
	// }
};
clearDeviceIdsFn();

router.post('/mlvcode', (req, res) => {
	// 接受post请求参数
	let formDate = "";
	req.on("data", param => {
		formDate += param;
	})
	req.on("end", async() => {
		// let postParamsObj = querystring.parse(formDate);
		let jsonParamsObj = JSON.parse(formDate);
		let type = jsonParamsObj.type;
		let resObj;
		let cuid = jsonParamsObj.cuid || '';
		switch(type) {
			case 'during':
				resObj = mlVocode.storeVcodeDataFn(jsonParamsObj);
				break;
			case 'verify':
				resObj = mlVocode.verifyVcodeFn(jsonParamsObj);
				// 更新设备验证状态
				if (resObj.code == 0 && cuid) {
					updateDeviceCuidStatus(1, cuid)
				} else if (cuid) {
					updateDeviceCuidStatus(0, cuid)
				}
				break;
			case 'destroy':
				resObj = mlVocode.destroyVcodeFn(jsonParamsObj);
				break;
			default:
				break;
		}
		res.end(JSON.stringify(resObj));
	});
});

router.post('/initmlvcode', (req, res) => {
	// 接受post请求参数
	let formDate = "";
	req.on("data", param => {
		formDate += param;
	})
	req.on("end", async() => {
		let jsonParamsObj = JSON.parse(formDate);
		if (jsonParamsObj.cuid) {
			setDeviceCuidItem(jsonParamsObj.cuid);
		}
		let resObj = mlVocode.initMlVcode(jsonParamsObj);
		res.end(JSON.stringify(resObj));
	});
});

// 根据cuid获取设备进行安全验证的结果
router.post('/getValidateApi', (req, res) => {
	// 接受post请求参数
	let formDate = "";
	req.on("data", param => {
		formDate += param;
	})
	req.on("end", async() => {
		let jsonParamsObj = JSON.parse(formDate);
		let resObj = mlVocode.getValidateRes(jsonParamsObj);
		res.end(JSON.stringify(resObj));
	});
});

module.exports = router;










