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
        restler = {
            Service: function () {
                this.defaults = {};
            }
        };

        restler.Service.prototype = {
            request: noop,
            get: noop,
            patch: noop,
            put: noop,
            post: noop,
            json: noop,
            del: noop
        };
    });

    describe('install:', function () {
        it('should install in the Service prototype by default', function () {
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

    describe('interceptor:', function () {
        var handler;

        beforeEach(function () {
            handler = sinon.stub().returns(new EventEmitter());
            restler.Service.prototype.post = handler;
        });

        it('should pass calls on to the original handler', function (done) {
            oauth2.install(restler);
            var svc = new restler.Service();
            svc.post('', {});
            expect(handler).should.have.been.calledOnce;
        });
    });
});
