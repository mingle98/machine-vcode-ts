# mingleVcode-ts

#### 介绍
该验证码模块基于原生typescript实现,webpack打包
![输入图片说明](../../.vscode/6DB22D9261A1EDA5636D61E40ACF4EF9.jpg)
![输入图片说明](../../.vscode/222E0323D7226B51EE8F46FF43AA1B8A.jpg)
![输入图片说明](../../.vscode/8CF0E10945ED14949A4FEC1146DA026F.jpg)

#### 软件架构
软件架构说明


#### 安装教程

1.  引入api/built.js 文件
2.  在需要的地方初始化
3. 参考在线demo:
[http://demo.luckycola.com.cn/mlvcode/index.html](http://demo.luckycola.com.cn/mlvcode/index.html)
代码如下（示例）：

#### 初始化说明

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>验证码</title>
</head>
<body>
    <!-- <div id="myVcodeContainer" style="width: 700px;height: 700px; background-color: aqua;overflow: hidden;"></div> -->
    <script>
        window.onload = function() {
            let localhttp = location.protocol + '//' + location.host;
            let mlVcode = boostrapFn({
                    // 验证码类型
                    vcodeType: ['puzzleVcode', 'clickVcode', 'roateVcode'],
                    // vcodeType: 'roateVcode',
                    // 模式 弹窗模式 嵌入模式(default)
                    mode: 'dialog',
                    // 当前网站是否是https的 默认false
                    isHttps: false,
                    // 验证码模块容器  传id  字符串
                    container: '#myVcodeContainer1',
                    // clickVcodeConfig: {
                    //     fontList: '姐姐姐姐姐姐介绍岁',
                    //     imgList: [
                    //         '1111'
                    //     ]
                    // },
                    // puzzleVcodeConfig: {
                    //     // 拼图形状 'puzzle' | 'rect' | 'round' | 'triangle'
                    //     puZshape: 'puzzle',
                    //     // 提示文案
                    //     puZoperateTip: '请拖动完成拼图验证',
                    //     puZimgList: [
                    //         '22222'
                    //     ]
                    // },
                    roateVcodeConfig: {
                        // 提示文案
                        roateOperateTip: '请拖动将图片转正完成验证',
                        roateimgList: [
                        ]
                    },
                    customTxt: {
                        headerConfig: {
                            text: '登录安全验证',
                            url: 'http://durobot.baidu.com/public/robotWeb/index.html'
                        },
                        footerConfig: {
                            text: '关于百度',
                            url: 'https://home.baidu.com/'
                        }
                    },
                    // 是否开启server验证 默认不开启
                    serverVerify: false,
                    // 自定义后端验证的接口配置
                    collectionDataOptios: {
                        // 开启服务端验证接口自定义 且 serverVerify=true时生效
                        open: false,
                        //自定义数据上报接口 必须post方式
                        postUrl: `${localhttp}/mlvcode`,
                        //自定义数据上报接口调用钩子
                        postUrlFn: function(resData) {
                             // resData是自定义接口响应的内容
                            console.log('postUrlFn....resData:', resData)
                        },
                        // 自定义初始化接口 必须post方式
                        initpostUrl: `${localhttp}/initmlvcode `,
                        // 自定义初始化接口调用的钩子函数
                        postInitUrlFn: function(initSuccessHook, resData) {
                            // resData是自定义接口响应的内容
                            console.log('postInitUrlFn resData:', resData);
                            // resData.data.code = -1
                            if (resData.data.code === 0) {
                                // 如果初始化成功 请调用initSuccessHook完成数据采集监听
                                initSuccessHook();
                                console.log('postInitData....ok')
                            } else {
                                console.log('postInitData....fail')
                            }
                        },
                        // 自定义后端验证接口
                        verifypostUrl: `${localhttp}/mlvcode`,
                        // 自定义后端验证接口调用钩子
                        verifypostUrlFn: function(resData, verifySuccessHook, verifyFailHook) {
                            console.log('verifypostUrlFn....resData:', resData);
                            if (resData.data.code === 0) {
                                // 如果自定义验证接口验证成功 调用verifySuccessHook钩子让验证码展示通过状态(前提是前端验证也已经通过了)
                                verifySuccessHook();
                            } else {
                                // 如果自定义验证接口验证不成功 调用verifyFailHook钩子让验证码展示失败状态
                                verifyFailHook()
                            }
                        },
                        // 自定义请求参数前置拦截函数(在中国函数中,您可以根据您的需求对请求中的明文数据进行加密等行为)
                        // 注意:该配置仅在serverVerify=true和collectionDataOptios=>open=true两项配置开启时生效
                        apiDataPreFn: function(apiData) {
                            // apiData 是请求的参数 处理后请务必return 出该函数 否则你的处理将不会生效
                            console.log('apiDataPreFn执行啦....apiData:', apiData, apiData.data);
                            let myApiParams = apiData.data;
                            // 我这里是对特定接口的请求参数进行扩展,您也可以进行加密等操作
                            if (/\/initmlvcode/g.test(apiData.url)) {
                                myApiParams.test = '这是测试数据';
                            }
                            // 我更改下请求数据
                            apiData.data = myApiParams;
                            return apiData;
                        },
                    },
                    successFn: (rsp) => {
                        console.log('自定义成功回调函数执行...', mlVcode);
                        // mlVcode.switchShowVcode('hide');
                    },
                    failFn: (rsp) => {
                        console.log('自定义失败回调函数执行...');
                    },
                    renderSucFn(rsp) {
                        console.log('自定义失render调函数执行...');
                    },
            }).render();
        };
    </script>
</body>
</html>
```


## 2.参数说明

| 参数        | 是否必须 | 值            | 说明                                                                                   |   |
|-----------|------|--------------|--------------------------------------------------------------------------------------|---|
| vcodeType | 是    | string或Array | 验证码类型,现在支持点选验证码(clickVcode)、转图验证码(roateVcode)和拼图验证码(puzzleVcode),但是数组写法时随机出数组种配置的验证码 |   |
|    mode       |  否    |      dialog或者不填 |默认不填是嵌入模式,  dialog是弹窗模式,两种模式都可以指容器                                                             |   |
|     container      |    否  |    string         |    验证码容器id                                                                                  |   |
|       serverVerify    |   否   |     boolean         |    是否开启服务器验证策略,默认不开                                                                                  |   |
|      clickVcodeConfig     |   否   |      object   |      点选验证码自定义配置,object具体参数在表后说明                                                                             |   |
|     puzzleVcodeConfig      |  否      |   object |    拼图验证码自定义配置,object具体参数在表后说明                                                                             |   |
|       roateVcodeConfig    |    否  |     object      |        转图验证码自定义配置,object具体参数在表后说明                                                                                |   |
|      customTxt     |   否   |      object        |            验证码容器自定义配置  , object具体参数在表后说明                                                                         |   |
|      collectionDataOptios     |   否   |      object        |            自定义服务端验证的接口配置 , object具体参数在表后说明                                                                         |   |

```js
// 点选验证码自定义配置
  clickVcodeConfig: {
         fontList: '姐姐姐姐姐姐介绍岁',
          // 点选验证码的背景图片列表,值必须是url
         imgList: []
     },
// 拼图验证码自定义配置
     puzzleVcodeConfig: {
         // 拼图形状 'puzzle' | 'rect' | 'round' | 'triangle'
         puZshape: 'puzzle',
         // 提示文案
         puZoperateTip: '请拖动完成拼图验证',
         // 拼图的图片列表,值必须是url
         puZimgList: []
     },
// 转图验证码自定义配置
    roateVcodeConfig: {
        // 提示文案
        roateOperateTip: '请拖动将图片转正完成验证',
        // 转图的图片列表,值必须是url
        roateimgList: [
        ]
    },
// 验证码容器自定义配置
 customTxt: {
         // 容器标题配置
        headerConfig: {
            text: '登录安全验证',
            url: 'http://durobot.baidu.com/public/robotWeb/index.html'
        },
        // 容器footer配置
        footerConfig: {
            text: '关于百度',
            url: 'https://home.baidu.com/'
        }
    },




// ---------如果你开启了服务端验证(serverVerify=true)请使用自己的服务端的验证接口---------


// 自定义后端验证的接口配置
   collectionDataOptios: {
       // 开启服务端验证接口自定义 且 serverVerify=true时生效
       open: false,
       //自定义数据上报接口 必须post方式
       postUrl: `${localhttp}/mlvcode`,
       //自定义数据上报接口调用钩子
       postUrlFn: function(resData) {
            // resData是自定义接口响应的内容
           console.log('postUrlFn....resData:', resData)
       },
       // 自定义初始化接口 必须post方式
       initpostUrl: `${localhttp}/initmlvcode `,
       // 自定义初始化接口调用的钩子函数
       postInitUrlFn: function(initSuccessHook, resData) {
           // resData是自定义接口响应的内容
           console.log('postInitUrlFn resData:', resData);
           // resData.data.code = -1
           if (resData.data.code === 0) {
               // 如果初始化成功 请调用initSuccessHook完成数据采集监听
               initSuccessHook();
               console.log('postInitData....ok')
           } else {
               console.log('postInitData....fail')
           }
       },
       // 自定义后端验证接口
       verifypostUrl: `${localhttp}/mlvcode`,
       // 自定义后端验证接口调用钩子
       verifypostUrlFn: function(resData, verifySuccessHook, verifyFailHook) {
           console.log('verifypostUrlFn....resData:', resData);
           if (resData.data.code === 0) {
               // 如果自定义验证接口验证成功 调用verifySuccessHook钩子让验证码展示通过状态(前提是前端验证也已经通过了)
               verifySuccessHook();
           } else {
               // 如果自定义验证接口验证不成功 调用verifyFailHook钩子让验证码展示失败状态
               verifyFailHook()
           }
       },
       // 自定义请求参数前置拦截函数(在中国函数中,您可以根据您的需求对请求中的明文数据进行加密等行为)
        // 注意:该配置仅在serverVerify=true和collectionDataOptios=>open=true两项配置开启时生效
        apiDataPreFn: function(apiData) {
            // apiData 是请求的参数 处理后请务必return 出该函数 否则你的处理将不会生效
            console.log('apiDataPreFn执行啦....apiData:', apiData, apiData.data);
            let myApiParams = apiData.data;
            // 我这里是对特定接口的请求参数进行扩展,您也可以进行加密等操作
            if (/\/initmlvcode/g.test(apiData.url)) {
                myApiParams.test = '这是测试数据';
            }
            // 我更改下请求数据
            apiData.data = myApiParams;
            return apiData;
        },
   },

```

**重要的事情说三遍!!!!!**

**注意:  如果您开启了服务端验证(serverVerify=true)且用于业务场景,请自定义服务端验证接口和相关自定义配置(collectionDataOptios)!!!!!**


#### 方法与事件说明
| 事件或方法       | 调用或者触发时机     |   |   |
|-------------|--------------|---|---|
| successFn   | 验证成功将触发      |   |   |
| failFn      | 验证失败将触发      |   |   |
| renderSucFn | 但验证码开始渲染时候触发 |   |   |
|  mlVcode.switchShowVcode('hide'); | 展示或者关闭验证码 |  值传‘hide’为关闭,‘show为显示’ |   |



#### touch事件中的touches、targetTouches和changedTouches详解

touches: 当前屏幕上所有触摸点的列表;

targetTouches: 当前对象上所有触摸点的列表;

changedTouches: 涉及当前(引发)事件的触摸点的列表

通过一个例子来区分一下触摸事件中的这三个属性：

1. 用一个手指接触屏幕，触发事件，此时这三个属性有相同的值。

2. 用第二个手指接触屏幕，此时，touches有两个元素，每个手指触摸点为一个值。当两个手指触摸相同元素时，
targetTouches和touches的值相同，否则targetTouches 只有一个值。changedTouches此时只有一个值，
为第二个手指的触摸点，因为第二个手指是引发事件的原因

3. 用两个手指同时接触屏幕，此时changedTouches有两个值，每一个手指的触摸点都有一个值

4. 手指滑动时，三个值都会发生变化

5. 一个手指离开屏幕，touches和targetTouches中对应的元素会同时移除，而changedTouches仍然会存在元素。

6. 手指都离开屏幕之后，touches和targetTouches中将不会再有值，changedTouches还会有一个值，
此值为最后一个离开屏幕的手指的接触点。

2. 触点坐标选取

touchstart和touchmove使用: e.targetTouches[0].pageX 或 (jquery)e.originalEvent.targetTouches[0].pageX

touchend使用: e.changedTouches[0].pageX 或 (jquery)e.originalEvent.changedTouches[0].pageX

3.touchmove事件对象的获取

想要在touchmove:function(e,参数一)加一个参数，结果直接使用e.preventDefault()就会 e 报错，处理方法为使用arguments[0]获取event参数
touchmove:function(e,参数一){
　　var e=arguments[0]
　　e.preventDefault()
}

参考文档:http://caibaojian.com/mobile-touch-event.html
#### tslint

```
// tslint.json 配置
{
    "rules": {
        // TS特性
        "member-access": true, // 设置成员对象的访问权限（public,private,protect)
        "member-ordering": [// 设置修饰符顺序
            true,
            {
                "order": [ 
                    "public-static-field",
                    "public-static-method",
                    "protected-static-field",
                    "protected-static-method",
                    "private-static-field",
                    "private-static-method",
                    "public-instance-field",
                    "protected-instance-field",
                    "private-instance-field",
                    "public-constructor",
                    "protected-constructor",
                    "private-constructor",
                    "public-instance-method",
                    "protected-instance-method",
                    "private-instance-method"
                ]
            }
        ],
        "no-empty-interface":true,// 不允许空接口
        "no-parameter-reassignment":true,// 不允许修改方法输入参数
        "prefer-for-of":true,// 如果for循环中没有使用索引，建议是使用for-of

        // 功能特性
        "await-promise":true,// 不允许没有Promise的情况下使用await
        "curly":true,// if/for/do/while强制使用大括号
        "forin":true,// 使用for in语句时，强制进行hasOwnProperty检查
        "no-arg":true,// 不允许使用arguments.callee
        // "no-bitwise":true, // 不允许使用特殊运算符 &, &=, |, |=, ^, ^=, <<, <<=, >>, >>=, >>>, >>>=, ~
        "no-conditional-assignment":true,// do while/for/if/while 语句中将会对例如if(a=b)进行检查
        // "no-console":true,// 不允许使用console对象
        "no-debugger":true,// 不允许使用debugger
        "no-duplicate-super":true,// 不允许super() 两次使用在构造函数中
        "no-empty":true,// 函数体不允许空
        "no-eval":true,// 不允许使用eval
        "no-for-in-array":true,// 不允许对Array使用for-in
        "no-invalid-template-strings":true,// 只允许在模板字符串中使用${
        "no-invalid-this":true,// 不允许在class之外使用this
        "no-null-keyword":true,// 不允许使用null,使用undefined代替null，指代空指针对象
        "no-sparse-arrays":true,// 不允许array中有空元素
        "no-string-throw":true,// 不允许throw一个字符串
        "no-switch-case-fall-through":true,// 不允许case段落中在没有使用breack的情况下，在新启一段case逻辑
        "no-unsafe-finally":true,// 不允许在finally语句中使用return/continue/break/throw
        "no-unused-expression":true,// 不允许使用未使用的表达式
        "no-use-before-declare":true,// 在使用前必须声明
        "no-var-keyword":true,// 不允许使用var
        "radix":true,// parseInt时，必须输入radix精度参数
        "restrict-plus-operands":true,// 不允许自动类型转换，如果已设置不允许使用关键字var该设置无效
        "triple-equals":true,// 必须使用恒等号，进行等于比较
        "use-isnan":true,// 只允许使用isNaN方法检查数字是否有效

        // 维护性功能
        "indent":[true, "spaces", 4],// 每行开始以4个空格符开始
        "linebreak-style":[true,"CR/LF"],// 换行符格式 CR/LF可以通用使用在windows和osx
        "max-classes-per-file":[true,1],// 每个文件中可定义类的个数
        "max-file-line-count":[true,500],// 定义每个文件代码行数
        "max-line-length":[true,120],// 定义每行代码数
        "no-default-export":true,// 禁止使用export default关键字，因为当export对象名称发生变化时，需要修改import中的对象名。https://github.com/palantir/tslint/issues/1182#issue-151780453
        "no-duplicate-imports":true,// 禁止在一个文件内，多次引用同一module

        // 格式
        "align":[true,"parameters","arguments","statements","members","elements"],// 定义对齐风格
        "array-type":[true,"array"],// 建议使用T[]方式声明一个数组对象
        "class-name":true,// 类名以大驼峰格式命名
        "comment-format":[true, "check-space"],// 定义注释格式
        "encoding":true,// 定义编码格式默认utf-8
        "import-spacing":true,// import关键字后加空格
        "interface-name":[true,"always-prefix"],// interface必须以I开头
        "jsdoc-format":true,// 注释基于jsdoc风格
        "new-parens":true,// 调用构造函数时需要用括号
        "no-consecutive-blank-lines":[true,2],// 不允许有空行
        "no-trailing-whitespace": [// 不允许空格结尾
            true,
            "ignore-comments",
            "ignore-jsdoc"
        ],
        "no-unnecessary-initializer":true,// 不允许没有必要的初始化
        "variable-name":[true,"check-format",// 定义变量命名规则
            "allow-leading-underscore",
            "allow-trailing-underscore",
            "ban-keywords"]
    }
}
```
