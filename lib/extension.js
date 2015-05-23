"use strict";

var DEFAULT_STATUS_CODE = 401;

var snoopRequest = function (service, req, reauthStatusCode) {
    var config = service.defaults.oauth2 || {};
    req.on(reauthStatusCode, function (data, response) {
        var authReq = service.post(config.authUrl, {
            grant_type: 'client_credentials',
            client_id: config.clientId,
            client_secret: config.clientSecret
        });

        authReq.on('complete', function (data, authResponse) {
            if (data instanceof Error) {
                console.log(data);
            } else {
                service.defaults.accessToken = data;
                response.retry(250);
            }
        });
    });
};

var createRequestMonitor = function (service, methodName, options) {
    var original = service[methodName];
    if (!original || typeof original !== 'function') {
        return;
    }

    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var req = original.apply(service, args);
        snoopRequest(service, req, options.reauthStatusCode || DEFAULT_STATUS_CODE);
        return req;
    };
};

exports.install = function (restler, options) {
    options = options || {};
    var service = restler.Service ? restler.Service.prototype : restler;

    var methods = ['request', 'get', 'patch', 'put', 'post', 'json', 'del'];

    methods.forEach(function (method) {
        if (service.hasOwnProperty(method)) {
            service[method] = createRequestMonitor(service, method, options);
        }
    });

    return true;
};