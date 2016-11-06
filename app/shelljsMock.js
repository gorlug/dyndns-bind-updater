const assert = require("assert");
const path = require("path");
const config = require("gorlug-util").config;

global["exec"] = function(command, callback) {
    var update_path = path.resolve(`updates/www.example.com.update`);
    var expected = `nsupdate -k /tmp/does_not_exist.key ${update_path}`;
    assert.equal(command, expected);
    callback(0, "something", "something error");
}
