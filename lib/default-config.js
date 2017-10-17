exports.config = {
	/**
	 * eureka 服务端配置
	 * @type {Object}
	 */
	eureka: {
		host: 'admin:admin@192.168.1.113',
  		port: 8761
	},

	/**
	 * eureka 客户端配置
	 * @type {Object}
	 */
	instance: {
		app: 'my-app',
    	hostName: 'localhost',
    	ipAddr: '127.0.0.1',
	    port: {
	      '$': 3000,
	      '@enabled': 'true'
	    },
	    vipAddress: "coordinator.nodejs.client",
	    dataCenterInfo: {
	      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
	      name: 'MyOwn'
	    }
	}
};