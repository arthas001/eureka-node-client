const _ = require('lodash');
const os = require('os');
module.exports = {
	UPDATED: '__updated__',			//服务更新
	/**
	 * 获取本机IP地址
	 * @return {[Array]} [description]
	 */
	getIPAddresses: function(){
		let ifaces = os.networkInterfaces();
		let addresses = [];
		_.forIn(ifaces, (value, key) => {
			let iface = _.find(value, {'family': 'IPv4', 'internal': false});
			if (_.isNil(iface)) return;
			addresses.push(iface.address);
		});
		return addresses;
	},
	/**
	 * 获取本机主机名
	 * @return {[String]} [description]
	 */
	getHostName: function(){
		let host_name = os.hostname();
		return host_name;
	},
	/**
	 * 处理服务 返回由应用名称及路径组成的对象
	 * @param  {[type]} services [description]
	 * @return {[Array]}          [description]
	 */
	serviceHandler: function(services){
		let apps = {};
		if (_.isNil(services)) return apps;
		let _this = this;
		_.forEach(services, (instances, appId) => {
			apps[appId.toLowerCase()] = _this.instanceHandler(instances);
		});

		return apps;
	},
	/**
	 * 处理实例数组，将实例信息转为路径
	 * @param  {[Array]} instances [description]
	 * @return {[Array]}           [description]
	 */
	instanceHandler: function(instances){
		let pathes = [];
		if (_.isNil(instances)) return pathes;
		let _this = this;
		_.forEach(instances, (instance, key) => {
			pathes.push(_this.getServerPath(instance));
		});
		return pathes;
	},
	/**
	 * 根据实例获取一个完整的IP方式的服务地址
	 * @param  {[Object]} instance [description]
	 * @return {[String]}          [description]
	 */
	getServerPath: function(instance){
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