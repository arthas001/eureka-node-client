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
