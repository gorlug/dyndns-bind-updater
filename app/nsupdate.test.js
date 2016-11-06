const assert = require("assert");
const config = require("gorlug-util").config;
const util = require("gorlug-util").util;
const logger = require("gorlug-util").logger;
const fs = require("fs-extra");
const mockery = require("mockery");

const ip = "192.168.3.1";
var conf;
var update;

describe("Test nsupdate", function() {

    beforeEach(function() {
        return config.initPromise("config/config.json.example").then(function(configInit) {
            conf = configInit;
            return util.promise(fs.readFile, "config/update_example"); 
        }).then(function(update_example) {
            update = update_example + "";
        });
    });

    it("test the update message", function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        var mock = require("./shelljsMock");
        mockery.registerMock("shelljs/global", mock);
        var promise = require("./nsupdate").send(conf, update, ip); 
        mockery.disable();
        return promise.then(function() {
            return util.promise(fs.readFile, `updates/${conf.domain}.update`, "utf8");
        }).then(function(update) {
            var expected = `server ${conf.target_server} ${conf.target_port}
zone ${conf.domain}
update delete ${conf.domain} A
update add ${conf.domain} 300 A ${ip}
send
`;
            assert.equal(update, expected);
            assert.equal(times_called, 1);
        });
    });
    it("test nsupdate init", function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        var mock = require("./shelljsMock");
        global.times_called = 0;
        mockery.registerMock("shelljs/global", mock);
        var promise = require("./nsupdate").send(conf, update, ip); 
        return promise.then(function() {
            assert.equal(times_called, 1);
        }).then(function() {
            var promise = require("./nsupdate").init(conf);     
            mockery.disable();
            return promise;
        }).then(function() {
            assert.equal(times_called, 2);
        });
    });
    it("test nsupdate init: no update file = no exec", function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        var mock = require("./shelljsMock");
        global.times_called = 0;
        mockery.registerMock("shelljs/global", mock);
        return util.promise(fs.stat, `updates/${conf.domain}.update`).then(function(stat) {
            if(stat) {
                return util.promise(fs.unlink, `updates/${conf.domain}.update`);
            }
            return Promise.resolve();
        }).then(function() {
            var promise = require("./nsupdate").init(conf);     
            mockery.disable();
            return promise;
        }).then(function() {
            assert.equal(times_called, 0);
        });
    });
    it("test nsupdate exec failure", function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock("shelljs/global", require("./shelljsMock_fail"));
        var promise = require("./nsupdate").send(conf, update, ip); 
        mockery.disable();
        return promise.then(function() {
            assert.fail(); 
        }).catch(function(error) {
            var expected = "could not execute nsupdate stdout: something went wrong, stderr: really wrong"
            assert.equal(error.message, expected);
        });
    });
});
