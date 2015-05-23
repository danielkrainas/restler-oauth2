var sinon = require('sinon');
var chai = require('chai');
var EventEmitter = require('events').EventEmitter;
var expect = chai.expect;
require('mocha-sinon');
chai.use(require('sinon-chai'));

var oauth2 = require('../lib/extension');
var restler = null;
var noop = function () {};

describe('Extension', function () {
    beforeEach(function () {
        restler = {};
        restler.Service = function () {};
        restler.Service.prototype = {
            constructor: restler.Service,
            request: noop,
            get: noop,
            patch: noop,
            put: noop,
            post: noop,
            json: noop,
            del: noop,
            defaults: {}
        };
    });

    describe('install:', function () {
        it('should modify the Service prototype by default', function () {
            expect(oauth2.install(restler)).to.be.true;

            expect(restler.Service.prototype.request).to.not.equal(noop);
            expect(restler.Service.prototype.get).to.not.equal(noop);
            expect(restler.Service.prototype.patch).to.not.equal(noop);
            expect(restler.Service.prototype.patch).to.not.equal(noop);
            expect(restler.Service.prototype.put).to.not.equal(noop);
            expect(restler.Service.prototype.post).to.not.equal(noop);
            expect(restler.Service.prototype.json).to.not.equal(noop);
            expect(restler.Service.prototype.del).to.not.equal(noop);
        });

        it('shouldn\'t add methods that don\'t exist prior', function () {
            delete restler.Service.prototype.request;
            oauth2.install(restler);
            expect(restler.Service.prototype.request).to.be.undefined;
        });
    });

    describe('injector:', function () {
        var handler;
        var emitter;

        beforeEach(function () {
            emitter = new EventEmitter();
            handler = sinon.stub().returns(emitter);
            restler.Service.prototype.post = handler;
        });

        it('should pass calls on to the original handler', function () {
            oauth2.install(restler);
            var svc = new restler.Service();
            svc.post('', {});
            expect(handler).to.have.been.calledOnce;
        });
    });

    describe('interceptor:', function () {
        var request = {
            on: sinon.spy()
        };

        beforeEach(function () {
            request = {
                on: sinon.spy()
            };

            restler.Service.prototype.post = sinon.stub().returns(request);
        });

        it('should subscribe to event 401 by default on request objects', function () {
            oauth2.install(restler);
            var svc = new restler.Service();
            svc.post('', {});
            expect(request.on).to.have.been.calledWith(401);
        });

        it('should subscribe to custom event when option.reauthStatusCode is specified', function () {
            oauth2.install(restler, { reauthStatusCode: 777 });
            var svc = new restler.Service();
            svc.post('', {});
            expect(request.on).to.have.been.calledWith(777);
        });
    });
});
