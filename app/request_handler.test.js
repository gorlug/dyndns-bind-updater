const mockery = require("mockery");
const assert = require("assert");

describe("Request handler", function() {
    it("test a normal request", function(done) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        var nsupdate = {
            ip: undefined,
            message: undefined,

            send: function(config, message, ip) {
                this.ip = ip;
                this.message = message;
            }
        };
        mockery.registerMock("./nsupdate", nsupdate);
        var message = "some message";
        var ip = "192.168.5.3";
        var RequestHandler = require("./request_handler");
        var request_handler = new RequestHandler({}, message);
        var request = {
            headers: {
                http_x_forwarded_for: ip
            }
        }
        var response = {
            end: function() {

            }
        }
        request_handler.handler(request, response);
        assert.equal(nsupdate.ip, ip);
        assert.equal(nsupdate.message, message);
        mockery.disable();
        done();
    });
});
