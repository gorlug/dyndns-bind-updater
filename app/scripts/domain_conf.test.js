const assert = require("assert");
const fs = require("fs-extra");
const mockery = require("mockery");
const domain_conf = require("./domain_conf");

describe("domain conf", function() {
    it("test generate domain conf with key", function() {
        return domain_conf.generate("test/Kwww.example.com.+165+37815.private", "docker/files/domain.conf", "test/domain.conf"); 
    });
});
