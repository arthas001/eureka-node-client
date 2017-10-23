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

