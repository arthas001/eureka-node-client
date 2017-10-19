/**
 * 
 */
const EurekaWrapper = require('./eureka-wrapper.js');
const _ = require('lodash');
const util = require('./utils');

function noop() {}

/**
 * EurekaClient 对象
 *
 * vipAddress 需要和 app 保持一致
 * 经测试发现，Spring Boot / Cloud Netflix 技术栈开发的apigateway，
 * 采用Zuul Reverse Proxy 反向代理的时候，必须app 和 vipAddress设置一致。 
 * 多个instance通过instanceId来区分。
 * @param {[type]} config [description]
 */
function EurekaClient(config) {
	//生成实例ID
	let instanceId = generateInstanceID(config.instance);
	let hostname = util.getHostName();
	let ip_address = util.getIPAddresses()[0];
	let _config = {
		instanceId: instanceId,
		vipAddress: config.instance.app,
		hostName: hostname,
		ipAddr: ip_address
	}
	_.merge(_config, config.instance);
	_.merge(config.instance, _config);
	this.wrapper = new EurekaWrapper(config);
	this.logger = this.wrapper.getLogger();
}

/**
 * 生成实例 ID
 * 服务名称:时间戳
 * @param  {[type]} instance [description]
 * @return {[type]}        [description]
 */
function generateInstanceID(instance) {
	let _id = _.now();
	let instance_id = `${instance.app}:${_id}`;
	return instance_id;
}

/**
 * 启动 eureka 客户端
 * @param  {Function} fn [description]
 * @return {[type]}            [description]
 */
EurekaClient.prototype.start = function(fn){
	if (this.wrapper) {
		this.wrapper.start(fn);
	}
}

/**
 * 停止 eureka 客户端
 * @param  {Function} fn [description]
 * @return {[type]}            [description]
 */
EurekaClient.prototype.stop = function(fn){
	if (this.wrapper) {
		this.wrapper.stop(fn);
	}
}

////// 服务监听
///

/**
 * 监听服务的更新
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.onUpdated = function(fn){
	if (this.wrapper) {
		this.wrapper.onUpdated(fn);
	}
}

/**
 * 移除服务更新的监听
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.unbindUpdatedListener = function(fn){
	if (this.wrapper) {
		this.wrapper.unbindUpdatedListener(fn);
	}
}

module.exports = EurekaClient;