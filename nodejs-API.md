目标：使用nodejs+mongoDB编写一款后端API的模版Demo，方便以后使用。

案例说明:

存在3个类

> Product : (id , name, price, productImage:String/URL;
>
> Order :  (id, product, quantity:Number); 
>
> User : (id, email, password)

order和product存在关联。

需要提供的API：products，orders的增删改查，user的注册、登录和删除。

业务：存在user登录状态下，才能成功执行部分信息的增删改查。（token）

# 开始开发

## 依赖

通篇使用了pnpm代替npm。

**首先**，新建文件夹作为工程文件，然后终端执行 `pnpm i`, 初始化工程（创建package.json文件）。

### express

`pnpm i --save express`

web应用框架

可以使用如下代码

#### http

```js
//require('http').createServer(app).listen(port)
const http = require('http');
const app = require("./app")
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
```

#### app.use

```js
//app.use(....);
const express = require('express');;
const app = express();

app.use((req,res,next) => {
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
})
```

#### router

```js
//router -> express.Router()
const express = require('express');
const router= express.Router();

router.get('/',(req,res,next) => {
  
});
```

### nodemon

通常情况下，我们修改代码之后需要重启服务进行测试，使用如下终端指令

 `node server.js`

但是nodemon可以帮助修改后自动重启服务。

+ 终端安装依赖`pnpm i --save nodemon`;

+ Package.json文件中修改代码如下

```json
  "scripts": {
    ...
    "start": "nodemon server.js"
  },
```

+ 终端输入 `pnpm start`, 显示如下code

```
> nodemon server.js

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
```

+ 修改代码后保存，终端自动刷新如下code

```
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
```

### morgan

日志打印，可以记录请求动作等

+ 终端安装依赖`pnpm i --save morgan`

+ app.js中引用

```js
//app.js
const morgan = require('morgan');
app.use(morgan('dev'));
```

+ 测试api, 以 <u>localhost:3000/products</u> 为例

​	成功请求后，终端显示code

```
//dev GET /products 200 3.494 ms - 36
```

​	不同的请求会显示不同的log

### body-parser

请求解析模版，提取请求中的主体信息，并放入`req.body`中

+ 终端安装依赖`pnpm i --save body-parse`

+ app.js中应用

```js
//app.js
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
```

+ Api请求中使用req.body获取请求中的信息，以routers/products.js为例

```js
//routers/products.js
router.post('/',(req,res,next) => {
    const name = req.body.name;
  	const price = req.body.price;
  	console.log(name + ',' + price);
})
```

+ 测试，在postman中选择post请求，然后 <u>localhost:3000/products</u> ，body中选择**raw/json**, 然后如下如下代码

```json
{
    "name":"123",
    "price":12
}
```

​	请求成功可以获得结果`123,12`

测试API使用postman软件

## 路由的设置

以 <u>localhost:3000/products</u> 为例，新建文件夹**routers**, 然后在文件夹中新建文件**products.js**

```js
//products.js
const express = require('express');
const router= express.Router();
//注意，这里使用的是 /
router.get('/',(req,res,next) => {
  
});

router.get('/:productId',(req,res,next) => {
  
});

//暴露
module.exports = router;
```

在文件app.js中引用该文件。

```js
const express = require('express');;
const app = express();
//引用并使用products
const productsRoutes = require('./api/routers/products');
//注意这里是/products,此时如果需要查看productsAPI就需要访问地址localhost:3000/products/
app.use('/products',productsRoutes);

module.exports = app;
```

## Cors的设置

跨域资源共享

app.js增加如下代码

```js
//app.js
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method === "OPTIONS"){
        req.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,PATCH,GET");
        return res.status(200).json();
    }
    next();
})
```

`res.header("Access-Control-Allow-Origin", "*");` 标识允许那个域，*比较粗暴，表示全部都允许。