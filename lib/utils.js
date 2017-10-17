const _ = require('lodash');
module.exports = {
	ADD: 'added',			//增加了新的服务
	REMOVED: 'removed',		//注册的服务被删除
	CHANGED: 'changed',		//注册的服务有变化
	/**
	 * 获取本机IP地址
	 * @return {[type]} [description]
	 */
	getServerAddresses: function(){},
	/**
	 * 获取本机主机名
	 * @return {[type]} [description]
	 */
	getHostName: function(){}, 
	/**
	 * 根据实例获取一个完整的IP方式的服务地址
	 * @param  {[type]} instance [description]
	 * @return {[type]}          [description]
	 */
	getServerPath: function(instance) {
		let url = "", http = "http://", https = "https://";
		if (instance) {
			if (_.has(instance, "port") && instance.port["@enabled"] === "true") {
				url = http + instance.ipAddr + ":" + instance.port["$"];
			}else if (_.has(instance, "securePort") && instance.securePort["@enabled"] === "true") {
				url = https + instance.ipAddr + ":" + instance.securePort["$"];
			}
		}
		return url;
	}
}