## eureka-node-client 帮助文档

eureka-node-client 客户端和 eureka 服务器端通信示意图：


![](./images/eureka-node-client.png)


eureka-node-client 是对 eureka-js-client 做的封装，是对 [Eureka](https://github.com/Netflix/eureka) 客户端的 JS 实现。

1. 安装 eureka-node-client：

	```javascript
	npm install eureka-node-client --save
	```

2. 将 eureka-node-client 集成到项目中

	```javascript
	const os = require('os');
	
	let hostname = os.hostname();
	let port = 3000;
	
	let eureka_address = process.env.EUREKA_ADDRESS || 'localhost';
	let eureka_port = process.env.EUREKA_PORT || '8761';
	let eureka_username = process.env.EUREKA_USERNAME || 'admin';
	let eureka_password = process.env.EUREKA_PWD || 'admin';
	const eureka_client = new Eureka({
	eureka: {
		host: `${eureka_username}:${eureka_password}@${eureka_address}`,
		port: eureka_port,
		servicePath: "/eureka/apps/"
	},
	instance: {
	    app: project_info.name,
	    port: { '$': port, '@enabled': 'true' },
	    homePageUrl: `http://${hostname}:${port}/`,
	    healthCheckUrl: `http://${hostname}:${port}/health`,
	    statusPageUrl: `http://${hostname}:${port}/static/index.html`,
	    metadata: {
	    	zone: 'primary',
	    	env: process.env.NODE_ENV,
	    	version: project_info.version
		    }
		}
	});
	
	/**
	 * 设置日志级别
	 */
	eureka_client.logger.level('debug');
	
	//********************  测试监听  ********************//
	let updatedListener = function(apps){
		console.log("更新：" + JSON.stringify(apps));
	}
	eureka_client.onUpdated(updatedListener);
	eureka_client.start(function(error){
		console.log(error || '启动成功！');
	});
	```
	
	eureka 客户端需要一个 JSON 格式的配置信息进行初始化，配置信息分为两部分: eureka 和 instance；
	eureka 部分用来配置 eureka 服务器信息，可以指定一个服务器，也可以指定服务器列表。
	指定一个服务器：
	
	```javascript
	eureka: {
		host: `${eureka_username}:${eureka_password}@${eureka_address}`,
		port: eureka_port,
		servicePath: "/eureka/apps/"
	}
	```
	
	指定服务器列表：
	
	```
	eureka: {
	"serviceUrls": {
			"default": [
				"http://admin:admin@192.168.2.184:8761/eureka/apps/", 
				"http://admin:admin@192.168.1.107:8761/eureka/apps/", 
				"http://admin:admin@192.168.2.157:8761/eureka/apps/"
				]
		}
	}
	```
	
	URL中的 ```admin:admin``` 是指 eureka 服务器的账号和密码。
	
	instance 部分指定了服务的信息：
	
	| 字段		     | 含义	         |           备注 |
	|:------------|:---------------:| -------------:|
	| app         | 服务名称        |            $1 |
	| hostName   	| 服务主机名		   |           $1 |
	| port     	| 端口号          |            $1 |
	| homePageUrl | 主页地址          |            $1 |
	| healthCheckUrl| 健康检查地址         |            $1 |
	| statusPageUrl| 状态地址        |            $1 |
	| metadata     | 服务的更多信息         |            $1 |
	
	更多参数参考：[eurka-js-client](https://github.com/jquatier/eureka-js-client)
	
	**设置服务更新的监听，服务发生变化时可以通过监听得知**
	
	```javascript
	let updatedListener = function(apps){
		console.log("服务更新：" + JSON.stringify(apps));
	}
	eureka_client.onUpdated(updatedListener);
	```
	
	**解除服务更新的监听**
	
	```javascript
	eureka_client.unbindUpdatedListener(updatedListener)
	```
	
	**启动 eureka 客户端服务注册和心跳**
	
	```javascript
	eureka_client.start(function(error){
		console.log(error || '启动成功！');
	});
	```
	
	**停止 eureka 客户端并取消服务注册**
	
	```javascript
	eureka_client.start.stop();
	```

## swagger ui 集成帮助文档

### 介绍

swagger ui 是一个 API 在线文档生成和测试的利器。支持 API 自动生成同步的在线文档，这些文档可以用于项目内部 API 审核，方便测试人员了解 API。

### 搭建环境

1. 下载 swagger ui

	```shell
	git clone https://github.com/swagger-api/swagger-ui.git
	```
2. 准备一个 NodeJS 项目，本文档用 express 演示。在项目中创建 public 目录，然后将下载好的 swagger ui 的 dist 目录下的文件全部复制到 public 目录下面。完整的目录结构如下：

	
	![目录结构](http://upload-images.jianshu.io/upload_images/732352-df96dc9cabc19efa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 编写代码

	```javascript
	let app = express();
	app.use('/static', express.static('public'));
	```

### 编写文档并发布

1. 使用[swagger editor](http://editor.swagger.io/) 编写 API 文档，swagger editor 基于 yaml 语法，需要看一下官方的 demo 学习一下。同样，swagger editor 也提供了 Docker 镜像，可以在本地搭建一个 swagger editor。
运行下面的命令在你本地运行编辑器：

	```javascript
	docker pull swaggerapi/swagger-editor
	docker run -p 8080:8080 swaggerapi/swagger-editor
	```
	然后访问 [http://127.0.0.1:8080/](http://127.0.0.1:8080/) 。

2. 导出 JSON
	
  ![image.png](http://upload-images.jianshu.io/upload_images/732352-650d24a66d7aa4ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  
 3. 将导出的 JSON 文件放入项目的 public 目录下面，并修改 public/index.html，如下；

	 	```javascript
	 	<script>
		window.onload = function() {
		  
		  // Build a system
		  const ui = SwaggerUIBundle({
		    url: "http://localhost:3000/static/users.json",
		    dom_id: '#swagger-ui',
		    deepLinking: true,
		    presets: [
		      SwaggerUIBundle.presets.apis,
		      SwaggerUIStandalonePreset
		    ],
		    plugins: [
		      SwaggerUIBundle.plugins.DownloadUrl
		    ],
		    layout: "StandaloneLayout"
		  })
		
		  window.ui = ui
		}
		</script>
	 	``` 
	 	
	 	将 url 指向刚才生成的 json 文件
	 	
	 	```javascript
	 	 url: "http://localhost:3000/static/users.json",
	 	```
 
 4. 启动 node 服务，浏览器中打开 http://localhost:3000/static/index.html 就是你自己写的 api 文档了。


## 微服务打包镜像帮助文档

使用 Dockerfile 打包镜像，文件内容如下：

```
FROM node:latest
MAINTAINER thomas hanxuepeng001@163.com
RUN git clone https://github.com/arthas001/eureka-client-example.git
WORKDIR /micro-service-test

RUN npm i

EXPOSE 3000

CMD npm start
```

运行命令：

```shell
docker build -t hanxuepeng/micro-service .
```

命令执行完毕后即可生成名为 hanxuepeng/micro-service 的镜像。
