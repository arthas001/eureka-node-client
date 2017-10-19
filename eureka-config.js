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