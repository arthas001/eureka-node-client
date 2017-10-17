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
	let _config = {
		instanceId: instanceId,
		vipAddress: config.instance.app
	}
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
 * 监听服务的增加
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.onAdded = function(fn){
	if (this.wrapper) {
		this.wrapper.onAdded(fn);
	}
}

/**
 * 移除服务增加的监听
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.unbindAddedListener = function(fn){
	if (this.wrapper) {
		this.wrapper.unbindAddedListener(fn);
	}
}

/**
 * 监听服务的移除
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.onRemoved = function(fn){
	if (this.wrapper) {
		this.wrapper.onRemoved(fn);
	}
}

/**
 * 取消监听移除服务事件
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.unbindRemovedListener = function(fn){
	if (this.wrapper) {
		this.wrapper.unbindRemovedListener(fn);
	}
}

/**
 * 监听服务更改事件
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.onChanged = function(fn){
	if (this.wrapper) {
		this.wrapper.onChanged(fn);
	}
}

/**
 * 取消监听服务更改事件
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaClient.prototype.unbindChangedListener = function(fn){
	if (this.wrapper) {
		this.wrapper.unbindRemovedListener(fn);
	}
}

module.exports = EurekaClient;