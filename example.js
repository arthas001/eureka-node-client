const EurekaClient = require('./lib/index');
const os = require('os');

let hostname = os.hostname();
console.log(hostname);
let eureka_client = new EurekaClient({
	eureka: {
		// serviceUrls: {
		// 	default: ['http://admin:admin@192.168.2.155:8761/eureka/apps/', 'http://admin:admin@192.168.2.168:8761/eureka/apps/', 'http://admin:admin@192.168.2.157:8761/eureka/apps/']
		// }
		host: 'admin:admin@192.168.2.168',
		port: 8761,
		servicePath: '/eureka/apps/'
	},
	instance: {
	    app: 'thomas-service',
	    vipAddress: 'thomas-service',
	    hostName: '192.168.2.184',
	    ipAddr: '192.168.2.184',
	    port: {
	      '$': 3000,
	      '@enabled': 'true'
	    },
	    metadata: {
	    	zone: 'test',
	    	env: process.env.NODE_ENV,
	    	version: '0.0.1',
	    	other: 'thomas'
	    }
	}
});

eureka_client.logger.level('debug');
eureka_client.start(function(error){
	console.log(error || '启动成功！');
});
