
// 引入系统模块http模块
const http = require("http");
// 导入connect模块,实现数据库的连接
// require("./model/connect.js")
// 导入系统模块path模块
const path =require("path");

// 导入第三方模板静态资源访问serve-static模块
let serveStatic = require("serve-static");
// 实现静态资源访问服务（参数是静态资源所在的绝对路径）
const serve = serveStatic(path.join(__dirname,"public"));

const queryString = require('querystring');


// 导入自定义模块router模块
const router = require("./route/index.js")

// // 创建网站服务器
let app = http.createServer((req, res)=>{
    // crosFn(req, res);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); //访问控制允许来源：所有
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-custom-header'); //访问控制允许报头 X-Requested-With: xhr请求
    res.setHeader('Access-Control-Allow-Metheds', 'PUT,POST,GET,DELETE,OPTIONS'); //访问控制允许方法
    res.setHeader('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    // res.end('我是跨域请求的内容');
    // console.log('已完成跨域设置！', req.headers.origin);
});

// 创建服务器响应处理程序
app.on("request",(req,res)=>{		
	// 启用路由功能
	router(req,res,()=>{
        // console.log("进入了路由环节");
    });
	// 启用静态资源服务服务
	serve(req,res,()=>{})
	
});
// 创建监听端口
app.listen(90,()=>{
	console.log("服务器启动成功！占用端口90");
});













