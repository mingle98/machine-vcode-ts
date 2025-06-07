// 验证码逻辑
// 返给前端的数据格式
// {
// 	code: 0,
// 	msg: '',
// 	type: '',
// 	data: {

// 	}
// }
// 前端数据格式
// {
// 	type: 'init',
// 	rzData: {
// 	  cl: [],
// 	  mv: [],
// 	  sc: [],
// 	  kb: [],
// 	  sb: [],
// 	  sd: [],
// 	  sm: [],
// 	  cr: {
// 		screenTop: 0,
// 		screenLeft: 0,
// 		clientWidth: 488,
// 		clientHeight: 789,
// 		screenWidth: 1440,
// 		screenHeight: 900,
// 		availWidth: 1440,
// 		availHeight: 900,
// 		outerWidth: 1440,
// 		outerHeight: 900,
// 		scrollWidth: 488,
// 		scrollHeight: 488
// 	  },
// 	  simu: 0,
// 	  ac_c: 0,
// 	  ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
// 	  tk: ''
// 	}
//   }


const {updateDeviceCuidStatus} = require('../utils/cuidLists');

// 策略类
const aStore = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
let mlVocode = {
	timeStr: new Date().getTime(),
	resObj: {
		code: 5001,
		type: 'init',
		msg: 'error',
		data: {
			tk: '123456789'
		}
	},
	// 验证比率控制区间
	verifyInterval: [0, 0.85],
	// 每个tk的验证数据
	postDataObj: {
		'xtcbwcw122': {}
	},
	resObjFn(code, msg, type, data) {
		Object.assign(this.resObj, {
			code,
			msg,
			type,
			data
		});
		return this.resObj;
	},
	getRandomNumber(start, end) {
		if (start > end) return 0;
		return Math.floor(Math.random() * (end - start + 1) + start);
	},
	getRadomKey() {
		let str = '';
		function innerFn() {
			let index = mlVocode.getRandomNumber(0, aStore.length);
			str += aStore[index];
			if (str.length <= 13) {
				return arguments.callee();
			};
		};
		innerFn();
		return str;
	},
	setResObj(params) {
		this.resObj.type = params.type;
	},
	// 根据cuid获取对应设备的安全验证结果
	getValidateRes(jsonParamsObj) {
		// console.log('getValidateRes....', jsonParamsObj);
		let cuid = jsonParamsObj.cuid;
		if (global.deviceIds[cuid] && +global.deviceIds[cuid].status) {
			updateDeviceCuidStatus(0, cuid);
			return this.resObjFn(3000, 'device is safe', 'deviceSafe', {
				cuidData: global.deviceIds[cuid]
			});
		} else {
			return this.resObjFn(3002, 'device is unsafe', 'deviceSafe', {
				cuidData: global.deviceIds[cuid]
			});
		}
	},
	initMlVcode(jsonParamsObj) {
		// console.log('initMlVcode:', jsonParamsObj);
		let type = jsonParamsObj.type;
		let tk;
		if (type == 'init' || type == 'during') {
			while(true) {
				tk = this.getRadomKey();
				let exits = Object.keys(this.postDataObj).some(item => item === tk);
				if (!exits) break;
			};
			this.postDataObj[tk] = {
				tk,
				rzData: [jsonParamsObj.rzData] || [],
				verifyTotalDataArr: [],
				movePathDataArr: [],
				verifyResult: 0,
				liveTimeStr: new Date().getTime() + 60 * 60 * 24 * 1000,
			};
			let resData = {
				content: 'init success',
				tk
			};
			return this.resObjFn(0, 'init success', type, resData);
		} else {
			return this.resObjFn(1001, 'init params error', type, {content: '前端请求type类型错误', tk: ''})
		};
	},
	verifyVcodeFn(jsonParamsObj) {
		console.log('verify...');
		let type = jsonParamsObj.type;
		let currentTk = jsonParamsObj.rzData.tk;
		let VerData = jsonParamsObj.verData || [];
		if (!this.isTkExit(jsonParamsObj)) {
			return this.resObjFn(5003, 'verify fail', type, {content: '验证失败, tk不合法'});
		};
		let curItemObj = this.postDataObj[currentTk];
		if (curItemObj.verifyTotalDataArr.length && VerData.verData.length >= curItemObj.verifyTotalDataArr.length) {
			VerData.verData.splice(0, VerData.verData.length - curItemObj.verifyTotalDataArr.length)
		};
		curItemObj.movePathDataArr = VerData.verData;
		// 统计符合路径的点坐标
		let count = 0;
		curItemObj.movePathDataArr.forEach(item => {
			let flag = false;
			curItemObj.verifyTotalDataArr.forEach(i => {
				if (!flag && Math.abs(item.x - i.x) <= 0.5 && Math.abs(item.y - i.y) <= 0.5) {
					count++;
					flag = true;
				};
			});
		});
		let per = count / curItemObj.verifyTotalDataArr.length;
		console.log('符合个数:', count, curItemObj.movePathDataArr.length, curItemObj.verifyTotalDataArr.length, per);
		if ( per > this.verifyInterval[0] && per <= this.verifyInterval[1]) {
			curItemObj.verifyResult = 1;
			return this.resObjFn(0, 'verify success', type, {content: '验证成功', verifyper: per, tk: currentTk})
		};
		// console.log('verufyFn:', curItemObj)
		return this.resObjFn(5005, 'verify fail', type, {content: '验证失败, 请重试', tk: currentTk});
	},
	destroyVcodeFn(jsonParamsObj) {
		console.log('destroy...');
		let type = jsonParamsObj.type;
		let currentTk = jsonParamsObj.rzData.tk;
		if (!this.isTkExit(jsonParamsObj)) {
			return this.resObjFn(6001, 'destroy fail', type, {content: 'destroy失败, tk不合法', tk: currentTk});
		};
		delete this.postDataObj[currentTk];
		if (currentTk in this.postDataObj) {
			return this.resObjFn(6002, 'destroy fail', type, {content: 'destroy失败', tk: currentTk});
		};
		return this.resObjFn(0, 'destroy success', type, {content: 'destroy成功', tk: ''});
	},
	storeVcodeDataFn(jsonParamsObj) {
		// console.log('during...');
		let type = jsonParamsObj.type;
		let currentTk = jsonParamsObj.rzData.tk;
		if (!this.isTkExit(jsonParamsObj)) {
			return this.initMlVcode(jsonParamsObj);
		};
		let curItemObj = this.postDataObj[currentTk];
		curItemObj.rzData.push(jsonParamsObj.rzData);
		curItemObj.verifyTotalDataArr.push(...jsonParamsObj.rzData.cl, ...jsonParamsObj.rzData.mv);
		curItemObj.rzData.length > 30 && curItemObj.rzData.shift();
		curItemObj.verifyTotalDataArr.length > 300 && curItemObj.verifyTotalDataArr.splice(0, curItemObj.verifyTotalDataArr.length - 300);
		// console.log('storeVcodeDataFn:', this.postDataObj, curItemObj.rzData.length, curItemObj.verifyTotalDataArr.length);
		return this.resObjFn(0, 'during success', type, {content: '行为上报成功', arr: this.postDataObj[currentTk], tk: currentTk})
	},
	isTkExit(jsonParamsObj) {
		let currentTk = jsonParamsObj.rzData.tk;
		return Object.keys(this.postDataObj).some(item => item === currentTk);
	},
	clearOutTkItem() {
		try {
			console.log('clearOutTkItem....clear...', new Date().getTime());
			Object.keys(this.postDataObj).forEach(tk => {
				let item = this.postDataObj[tk];
				if (item.liveTimeStr && +item.liveTimeStr > new Date().getTime()) {
					delete this.postDataObj[tk];
					console.log('清除过期的tk项目:', item, this.postDataObj[tk]);
				};
			})
		} catch (error) {}
	}
}
// 定时清楚过期tk项目
setInterval(_ => {
	mlVocode.clearOutTkItem();
}, 1000 * 60 * 24);

module.exports = {
    mlVocode,
    aStore
};
