'use strict';

exports.__esModule = true;
// Default configuration values:
exports.default = {
  requestMiddleware: function requestMiddleware(request, done) {
    return done(request);
  },
  eureka: {
    heartbeatInterval: 30000,
    registryFetchInterval: 30000,
    maxRetries: 3,
    requestRetryDelay: 500,
    fetchRegistry: true,
    filterUpInstances: true,
    servicePath: '/eureka/v2/apps/',
    ssl: false,
    useDns: false,
    preferSameZone: true,
    clusterRefreshInterval: 300000,
    fetchMetadata: true,
    registerWithEureka: true,
    useLocalMetadata: false,
    preferIpAddress: false
  },
  instance: {}
};