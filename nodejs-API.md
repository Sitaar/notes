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

## MongoDB的设置

选择了MongoDB的在线版数据库，可以申请免费的空间使用，[点击网址申请](cloud.mongodb.com)。申请和创建库之后，复制针对nodejs提供的code，如下

```
mongodb+srv://db:<db_password>@test.gx6wc.mongodb.net/?retryWrites=true&w=majority&appName=test
```

将其中`<db_password>`替换成你设置的密码。

接下来就可以在nodejs中使用该云数据库了。

### 连接数据库

+ 安装依赖

`pnpm i --save mongoose`

+ 引用依赖

```js
//app.js
const mongoose = require('mongoose');
```

+ 连接数据库

```js
mongoose.connect('mongodb+srv://db:'
+process.env.MONGO_ATLAS_PW
+'@test.gx6wc.mongodb.net/?retryWrites=true&w=majority&appName=test');

mongoose.Promise = global.Promise;
```

### mongoose API学习

#### Model数据结构声明

##### Type数据类型

- `mongoose.Schema.Types.ObjectId` 自动生成的id;
- `Number` 数字型；
- `String` 字符串型；

##### required：是否必要

##### default：默认值

##### ref：关联的表/数据结构/model

##### unique：是否唯一

##### match：数据正则检查匹配

##### 定义数据结构

`mongoose.Schema({...})`

`mongoose.model('<modelName>', <ModelSchema>)`

```js
//product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String, required:true},
    price:{type:Number, required:true},
    productImage:{type:String, required:true},
})

module.exports = mongoose.model('Product', productSchema);
```

```js
//order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
  //product的值为ObjectId，与【Product】关联
    product:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Product'},
    quantity:{type:Number, default:1},
})

module.exports = mongoose.model('Order', orderSchema);
```

```js
//user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{
        type:String, 
        required:true,
        unique:true,
      	//校验email的格式
        match:/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    password:{type:String, required:true},
})

module.exports = mongoose.model('User', userSchema);
```

#### 数据操作

##### 类型引用

```js
//product Model定义的位置
const Product = require('../models/product');
```

##### exec: 执行

执行mongoose的query操作后，调用exec()方法；
```js
Product.find().then();
Product.find().exec().then();
```
> 区别在于： mongoose 的所有查询操作返回的结果都是 query （官方文档是这样写的），并非一个完整的promise。
> 而加上`.exec()`则将会返回成为一个完整的 promise 对象，但是其是 mongoose 自行封装的 promise ，与 ES6 标准的 promise 是有所出入的（你应该会在控制台看到相关的警告），而且官方也明确指出，在未来的版本将会废除自行封装的promise，改为 ES6 标准，因此建议楼主在使用过程中替换为 ES6 的 promise，如下：
>
> const mongoose = require('mongoose');
> mongoose.Promise = global.Promise;

##### find: 查询

```js
//查询全部
Product.find();
Product.find().exec().then(docs=>{
  //docs是products数组
});

//查找所有满足条件的数据
//条件格式 {prop:value,...}
User.find({email: req.body.email})
    .exec()
    .then(docs=>{
  //docs是数组
})

//查询满足条件的数据中的第一个
Product.findOne();
User.findOne({email: req.body.email})
    .exec().then(doc=>{
  //doc是一个对象
})

//查询指定Id的数据（id唯一）
Product.findById();
Product.findById(id).exec().then(doc=>{
  //doc是一个对象
})

Product.findOneAndDelete();
Product.findOneAndReplace();
Product.findOneAndUpdate()
```

##### where: 查询条件

```js
Product.where({email: req.body.email})
  .fineOne()
  .exec().then(doc=>{});
```

##### select: 指定属性

```js
//Product包含属性：name, price, _id

//需求是只显示name和price
Product.find()
  .select('name price')
  .exec().then(docs=>{
  //docs是products数组
});
```

##### populate: 子表属性

```js
//Order包含属性：product quantity _id
//product是子表数据的_id

//需求是显示product的详细属性
Order.find()
    .select('product quantity')
    .populate('product','name price')
    .exec()
    .then(docs=>{});
//{
//  product:{
//    name:"",
//    price:11
//  },
//  quantity:1,
//}
```

##### save: 新增

```js
const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
product.save()
        .then(result=>{
            //result和product实例相同
        })
```

updateOne: 修改

```js
const updateOpts = {
  name:"",
  price:22,
};
Product.updateOne({_id:id},{$set:updateOpts})
  .exec()
  .then(result=>{      
})
```

