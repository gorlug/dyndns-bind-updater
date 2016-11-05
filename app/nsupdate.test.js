const assert = require("assert");
const nsupdate = require("./nsupdate");
const config = require("gorlug-util").config;
const util = require("gorlug-util").util;
const logger = require("gorlug-util").logger;

const ip = "192.168.3.1";
var conf;

describe("Test nsupdate", function() {
    it("test the update message creation", function() {
        return config.initPromise("config/config.json.example").then(function(configInit) {
            conf = configInit;
            return util.readFilePromise("config/update_example"); 
        }).then(function(update) {
           update += "";
           return nsupdate(conf, update, ip); 
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
});
