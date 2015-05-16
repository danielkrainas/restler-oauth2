var snoopRequest = exports.snoopRequest = function (service, req) {
    var config = service.defaults.oauth2 || {};
    req.on('401', function (data, response) {
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

var createRequestMonitor = exports.createRequestMonitor function (service, methodName) {
    var original = service[methodName];
    if (!original || typeof original !== 'function') {
        return;
    }

    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var req = original.apply(service, args);
        snoopRequest(service, req);
        return req;
    };
};

exports.install = function (restler) {
    var service = restler.Service ? restler.Service.prototype : restler;

    var methods = ['request', 'get', 'patch', 'put', 'post', 'json', 'del'];

    methods.forEach(function (method) {
        service[method] = createRequestMonitor(service, method);
    });
};