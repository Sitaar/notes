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

测试API使用postman软件

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

### dotenv

创建环境变量存储文件.env

+ 安装依赖

`pnpm i --save dotenv`

+ 引用依赖

注意：1、在`app.js`或`server.js`文件中引用依赖；2、必须写在所有引用的最上方

```js
//app.js
require("dotenv").config();
...
```

+ .env文件内容

```
MONGO_ATLAS_PW=123
JWT_KEY=111
```

+ 变量使用

```js
process.env.MONGO_ATLAS_PW
```

### bcrypt

在Node.js 中安全地对密码进行哈希处理

+ 安装依赖

`pnpm i --save bcrypt`

+ 引用依赖

```js
const bcrypt = require('bcrypt');
```

+ 使用

```js
//加密
//将输入的密码进行加密，salt为10；
//回调如果是hash,加密成功，hash为生成的salt
bcrypt.hash(req.body.password,10,(err,hash) => {
  if(err){
    ...
  }else{
    const user = new User({
      _id:new mongoose.Types.ObjectId(),
      email:req.body.email,
      password:hash//成功加密后的结果
    });
  }
})；

//比较
//比较输入的密码和数据库中的密码是否一致
//result结果为true说明两者加密形式一致，后续在通过json web token进行处理
bcrypt.compare(req.body.password,user[0].password,(err,result) => {
  if(err){
    ...
  }
  if(result){
    ...解析成功
  }
})
```

### jsonwebtoken

使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。大概流程：

1. 客户端使用用户名跟密码请求登录
2. 服务端收到请求，去验证用户名与密码
3. 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
4. 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
6. 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据

实施 Token 验证的方法挺多的，还有一些标准方法，比如 JWT(JSON Web Tokens) 。JWT 标准的 Token 有三个部分：

- header（头部）--- 加密算法
- payload（数据）--- 具体内容
- signature（签名）--- key

中间用点分隔开，并且都会使用 Base64 编码，所以真正的 Token 看起来像这样：

```js
eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJuaW5naGFvLm5ldCIsImV4cCI6IjE0Mzg5NTU0NDUiLCJuYW1lIjoid2FuZ2hhbyIsImFkbWluIjp0cnVlfQ.SwyHTEx_RQppr97g4J5lKXtabJecpejuef8AqKYMAJc
```

应用步骤

+ 安装依赖

`pnpm i --save jsonwebtoken`

+ 定义key

定义环境变量` JWT_KEY`

```
//.env
JWT_KEY=***  
```

+ 引用依赖

```js
const jwt = require('jsonwebtoken');
```

+ 加密和校验

token <== 基本信息 + key

token + key ==> 基本信息

```js
//jwt.sign()
//token <== 基本信息 + key
//参数1:基本信息；参数2：key；参数3：过期时间
const token = jwt.sign({
  email:user[0].email,
  userId:user[0]._id
},process.env.JWT_KEY,{
  expiresIn:"1h",
});
```

```js
//jwt.verify()
//token + key ==> 基本信息
const decoded = jwt.verify(token,process.env.JWT_KEY);
```

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

## .env文件的设置

存储环境变量的文件，可以借助依赖`dotenv`文件夹。

+ 安装依赖

`pnpm i --save dotenv`

+ 引用依赖

注意：1、在`app.js`或`server.js`文件中引用依赖；2、必须写在所有引用的最上方

```js
//app.js
require("dotenv").config();
...
```

+ .env文件内容

`MONGO_ATLAS_PW` 指 在线mongoDB的连接密码

`JWT_KEY` 指 ` JSON Web Token（JWT）`密码管理key

```
MONGO_ATLAS_PW=***
JWT_KEY=***  
```

+ 变量使用

在线mongoDB的连接

```js
mongoose.connect('mongodb+srv://db:'
+process.env.MONGO_ATLAS_PW
+'@test.gx6wc.mongodb.net/?retryWrites=true&w=majority&appName=test');

mongoose.Promise = global.Promise;
```

密码加密与校验

```js
const token = jwt.sign({
  email:user[0].email,
  userId:user[0]._id
},process.env.JWT_KEY,{
  expiresIn:"1h",
});
```

```js
const decoded = jwt.verify(token,process.env.JWT_KEY);
```

## 状态码的使用

http请求的响应结果会通过状态码来反应和归类。

### 分类

响应状态码通常分为5类：

**100-199**：信息响应

**200-299**：成功响应

+ 200: 请求成功，通常用在Get、Delete等请求;

+ 201: 创建成功，通常用在Post请求；

**300-399**：重定向

**400-499**：客户端错误

+ 400: 客户端错误，如语法错误、无效信息等，服务端不会处理请求；

+ 401: 身份权限错误；

+ 403: 客户端未经授权；

+ 404: 服务器无法找到请求内容；
+ 409: 请求与当前服务器状态冲突；

**500-599**：服务端错误

​	500: 服务器遇到未知错误；

### 定义状态码的code

`res.status(200).json({...}}); `

```js
//GET 200
//catch err 500
const get_orders_all =(req,res,next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product','name price')
    .exec()
    .then(docs=>{
        const response = {
            ...
        };
        res.status(200).json(response);        
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
};
```

```js
//POST
//创建订单
//创建前先查找是否存在对应产品
//没有返回 404
//创建成功 返回 201
//catch err 500
const create_order = (req,res,next) => {
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return product;
        }
        const order = new Order(...);
        return order.save()       
    })
    .then(result=>{
        if(!result){
            res.status(404).json({
                message: 'Product not found'
            });
        }else{
          const response = {
            ...
        };
        res.status(201).json(response); 
    }
    }) 
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
};
```

```js
//注册账号 POST
//注册之前查找是否存在邮箱
//存在 409
//不存在，允许创建
//密码加密，加密失败 500
//成功注册 201
//catch err 500
const user_signup = (req,res,next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user=>{
        if(user){
            res.status(409).json({
                message:"Mail exists"
            });
        }else{
            bcrypt.hash(req.body.password,10,(err,hash) => {
                if(err){
                    return res.status(500).json({
                        err:err
                    })
                }else{
                    const user = new User(...);
                    user
                    .save()
                    .then(result=>{                       
                        res.status(201).json(...);
                    })
                    .catch(err=>{
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
};
```

```js
//用户登录 GET
//查找账户是否存在
//不存在 401
//校验密码，密码不对 401
//匹配 200
const user_login = (req,res,next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            res.status(401).json({
                message:"Auth Failed"
            });
        }else{
            bcrypt.compare(req.body.password,user[0].password,(err,result) => {
                if(err){
                    res.status(401).json({
                        message:"Auth Failed"
                    });
                }
                if(result){
                    const token = jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id
                    },process.env.JWT_KEY,{
                        expiresIn:"1h",
                    });
                    res.status(200).json({
                        message:"Auth successfully",
                        token:token,
                        request:{
                            type: 'POST',
                            url: 'http://localhost:3000/user/signup',
                            body:{
                                email:"string",
                                password:"string"
                            }
                        }
                    });
                }else{
                    res.status(401).json({
                        message:"Auth Failed"
                    });
                }
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
};
```



### 其他响应信息的定义

通常返回状态码的同时，还要返回一些有用信息。

如请求所有产品的信息，那么就至少需要

+ 范围一个产品数组，每个元素中包括产品的必要信息；
+ 产品的个数；
+ （可选）单个产品查询请求的url帮助

这里给出模版公参考

```js
//GET ALL请求
const response = {
  count:docs.length;
  products:docs.map(_=>{
  	return {
  		name:..,
  		price:..,
  		_id:id,
  		request:{
  			type:'GET',
  			url: 'http://localhost:3000/products/'+_._id
			}
		};
	});
};
```

```js
//GET ONE请求
const response = {
  result: doc,
  request:{
    type: 'GET',
    url: 'http://localhost:3000/orders/'
  }
}
```

```js
//POST请求
const response = {
  message:'Create order successfully' ,
  createdOrder: {
    result: {
      product:result.product,
      quantity:result.quantity,
      _id:result._id
    },
    request:{
      type: 'GET',
      url: 'http://localhost:3000/orders/'+result._id
    }
  }
}
```

```js
//DELETE ONE删除
const response = {
  message:"Order deleted successfully",
  request:{
    type: 'POST',
    url: 'http://localhost:3000/orders/',
    body:{
      productId:"string",
      quantity:"Number"
    }
  }
}
```

```js
//PATCH ONE修改
const response = {
  message:"Product updated successfully",
  request:{
    type: 'GET',
    url: 'http://localhost:3000/products/'+id
  }
}
```

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

##### updateOne: 修改

```js
const updateOpts = {
  name:"",
  price:22,
};
//找到指定id的数据，并修改对应字段
Product.updateOne({_id:id},{$set:updateOpts})
  .exec()
  .then(result=>{      
})
```

##### deleteOne: 删除

```js
Product.deleteOne({_id:id})
  .exec()
  .then(result=>{     
})
```

