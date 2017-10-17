const Eureka = require("eureka-js-client").Eureka;
const DefaultConfig = require("./default-config.js").config;
const _ = require('lodash');
const util = require('./utils');

function noop(){}

function EurekaWrapper(config) {
	this.logger = null;
	this.init(config);
}

/**
 * 初始化
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
EurekaWrapper.prototype.init = function (config) {
	let _config = this.initConfig(config);
	this.fetched = false;		//是否获取到数据了
	this.cachedServices = {};	//服务信息
	this._eureka = new Eureka(_config);
	this.setLogger();
	this.initOutListener();
}

/**
 * 初始化参数，记录所有配置，生成 eureka 所需参数
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
EurekaWrapper.prototype.initConfig = function(config) {
	//保存所有参数
	this._config = _.merge({}, DefaultConfig);
	this._config = _.merge(this._config, config || {});
	let eureka_config = _.merge({}, this._config);
	//服务注册中心参数
	let eureka = eureka_config.eureka;
	if (!_.has(eureka, 'host') || !_.has(eureka, 'port')) {
		throw new TypeError('host 或者 port 不存在！');
	}

	return eureka_config;
}

/**
 * 监听服务变化
 */
EurekaWrapper.prototype.addListener = function(){
	//初始化外部监听器
	this.initOutListener();
	let _this = this;
	if (_.this._eureka) {
		//监听启动成功
		_.this._eureka.on("started", noop);

		//监听服务更新
		_.this._eureka.on("registryUpdated", function(){
			_this.cachedServices = _this._eureka.cache;
		});
	}
}

/**
 * 初始化外部监听器
 * @return {[type]} [description]
 */
EurekaWrapper.prototype.initOutListener = function(){
	this.listeners = {};
	this.listeners[util.ADD] = [];
	this.listeners[util.REMOVED] = [];
	this.listeners[util.CHANGED] = [];
}

/**
 * 解除监听
 * @return {[type]} [description]
 */
EurekaWrapper.prototype.unbindListeners = function (){
	this.listeners[util.ADD] = [];
	this.listeners[util.REMOVED] = [];
	this.listeners[util.CHANGED] = [];
	this.listeners = {};
}

/**
 * 添加新增服务的监听
 * @param  {Function} fn [description]
 * @return {[type]}            [description]
 */
EurekaWrapper.prototype.onAdded = function(fn){
	this.listeners[util.ADD].push(fn);
}

/**
 * 移除新增服务的监听
 * @param  {Function} fn [description]
 * @return {[type]}            [description]
 */
EurekaWrapper.prototype.unbindAddedListener = function(fn){
	removeListener(util.ADD, fn, this.listeners);
}

/**
 * 添加删除服务的监听
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaWrapper.prototype.onRemoved = function(fn){
	this.listeners[util.REMOVED].push(fn);
}

/**
 * 移除删除服务的监听
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaWrapper.prototype.unbindRemovedListener = function(fn) {
	removeListener(util.REMOVED, fn, this.listeners);
}

/**
 * 添加服务改变的监听
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaWrapper.prototype.onChanged = function(fn){
	this.listeners[util.CHANGED].push(fn);
}

/**
 * 移除服务改变的监听
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
EurekaWrapper.prototype.unbindChangedListener = function(fn){
	removeListener(util.CHANGED, fn, this.listeners);
}

/**
 * 移除监听
 * @param  {[type]}   type      [description]
 * @param  {Function} fn        [description]
 * @param  {[type]}   listeners [description]
 * @return {[type]}             [description]
 */
function removeListener(type, fn, listeners){
	if (listeners && _.has(listeners, type) && _.size(listeners[type]) > 0 && _.isFunction(fn)) {
		_.remove(listeners[type], (target) => { return target === fn; });
	}
}
/**
 * 启动 eureka 客户端
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
EurekaWrapper.prototype.start = function(callback) {
	let _client = this.getEureka();
	let _callback = _.isFunction(callback) ? callback : noop;
	if (_client) {
		_client.start(_callback);
	}
}

/**
 * 停止 eureka 客户端
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
EurekaWrapper.prototype.stop = function(callback) {
	let _client = this.getEureka();
	let _callback = _.isFunction(callback) ? callback : noop;
	if (_client) {
		_client.stop(_callback);
	}
}

/**
 * 获取内部实体
 * @return {[type]} [description]
 */
EurekaWrapper.prototype.getEureka = function() {
	return this._eureka;
}

/**
 * 设置logger
 * 
 */
EurekaWrapper.prototype.setLogger = function () {
	let eureka = this.getEureka();
	if (eureka) {
		this.logger = eureka.logger;
	}
}

/**
 * 获取 logger
 * @return {[type]} [description]
 */
EurekaWrapper.prototype.getLogger = function() {
	return this.logger;
}


module.exports = EurekaWrapper;