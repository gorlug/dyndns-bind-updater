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
                return Promise.resolve();
            }
        };
        mockery.registerMock("./nsupdate", nsupdate);
        var message = "some message";
        var ip = "192.168.5.3";
        var request_handler = require("./request_handler");
        var request = {
            headers: {
                http_x_forwarded_for: ip
            }
        }
        var response = {
            end: function() {
                assert.equal(nsupdate.ip, ip);
                assert.equal(nsupdate.message, message);
                mockery.disable();
                done();
            }
        }
        request_handler.bind({config: {}, message: message })(request, response);
    });
});
