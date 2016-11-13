const assert = require("assert");
const fs = require("fs-extra");
const mockery = require("mockery");
const domain_conf = require("./domain_conf");
const gutil = require("gorlug-util").util;

describe("domain conf", function() {
    it("test generate domain conf with key", function() {
        const target_file = "test/domain.conf";
        var expected;
        return gutil.promise(fs.readFile, "test/domain.conf.expected").then(function(result) {
            expected = result + "";
            return domain_conf.generate("www.example.com", "test/Kwww.example.com.+165+37815.private", "docker/files/domain.conf", target_file); 
        }).then(function() {
            return gutil.promise(fs.readFile, target_file);
        }).then(function(result) {
            assert.equal(result + "", expected);
        });
    });
});
