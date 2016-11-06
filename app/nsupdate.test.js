const assert = require("assert");
const config = require("gorlug-util").config;
const util = require("gorlug-util").util;
const logger = require("gorlug-util").logger;
const fs = require("fs-extra");
const mockery = require("mockery");

const ip = "192.168.3.1";
var conf;

describe("Test nsupdate", function() {
    it("test the update message", function() {
        this.timeout(20000);
        return config.initPromise("config/config.json.example").then(function(configInit) {
            conf = configInit;
            return util.readFilePromise("config/update_example"); 
        }).then(function(update) {
            update += "";
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });
            mockery.registerMock("shelljs/global", require("./shelljsMock"));
            var promise = require("./nsupdate")(conf, update, ip); 
            mockery.disable();
            return promise;
        }).then(function() {
            return util.promise(fs.readFile, `updates/${conf.domain}.update`, "utf8");
        }).then(function(update) {
            var expected = `server ${conf.target_server} ${conf.target_port}
zone ${conf.domain}
update delete ${conf.domain} A
update add ${conf.domain} 300 A ${ip}
send
`;
            assert.equal(update, expected);
        });
    });
    it("test nsupdate exec failure", function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock("shelljs/global", require("./shelljsMock_fail"));
        var promise = require("./nsupdate")({}, "", ip); 
        mockery.disable();
        return promise.then(function() {
            assert.fail(); 
        }).catch(function(error) {
            var expected = "could not execute nsupdate stdout: something went wrong, stderr: really wrong"
            assert.equal(error.message, expected);
        });
    });
});
