# eureka-node-client

服务注册与发现客户端，针对项目对 eureka-js-client 做的二次开发。

![](./images/eureka-node-client.png)

## Usage

### 安装 eureka-node-client 包

```shell
npm install eureka-node-client --save
```

### 将 eureka-node-client 集成到你的 Node 项目中

**example.js**

```javascript
const _ = require("lodash");
const EurekaClient = require('./lib/index');
const config = require('./eureka-config');

let eureka_client = new EurekaClient(config);

eureka_client.logger.level('debug');

//事件监听
let updatedListener = (apps) => {
	_.forEach(apps, (pathes, appName) => {
		console.log(`名称=${appName}`);
		_.forEach(pathes, (path, key) => {
			console.log(`路径=${JSON.stringify(path)}`);
		});
	});
}


eureka_client.onUpdated(updatedListener);

eureka_client.start(function(error){
	console.log(error || '启动成功！');
});

```

**eureka-config.js**

```javascript
const project_info = require('./package.json');
module.exports = {
	/**
	 * eureka 服务端配置
	 * @type {Object}
	 */
	eureka: {
		// serviceUrls: {
		// 	default: [
		// 	'http://admin:admin@192.168.2.184:8761/eureka/apps/', 
		// 	'http://admin:admin@127.0.0.1:8761/eureka/apps/', 
		// 	'http://admin:admin@192.168.0.161:8761/eureka/apps/'
		// 	]
		// }
		"host": "admin:admin@192.168.2.184",
		"port": 8761,
		"servicePath": "/eureka/apps/"
	},

	/**
	 * eureka 客户端配置
	 * @type {Object}
	 */
	instance: {
		"app": "thomas-service",
	    "port": {
	      "$": 3000,
	      "@enabled": "true"
	    },
	    "metadata": {
	    	"zone": "primary",
	    	"env": process.env.NODE_ENV,
	    	"version": project_info.version
	    }
	}
};
```

### 注册服务 && 开始心跳

```javascript
eureka_client.start(function(error){
	console.log(error || '启动成功！');
});
```

### 取消注册 && 停止心跳
```javascript
eureka_client.stop();
```

### 服务更新监听
```javascript
//事件监听
let updatedListener = (apps) => {
	_.forEach(apps, (pathes, appName) => {
		console.log(`名称=${appName}`);
		_.forEach(pathes, (path, key) => {
			console.log(`路径=${JSON.stringify(path)}`);
		});
	});
}


eureka_client.onUpdated(updatedListener);
```


## 参考

[eureka-js-client](https://github.com/jquatier/eureka-js-client)

[Eureka Wiki](https://github.com/Netflix/eureka/wiki)
