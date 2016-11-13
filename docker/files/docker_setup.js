require("shelljs/global");
const fs = require("fs-extra");
const domain_conf = require("./domain_conf");
const S = require("string");
const gutil = require("gorlug-util").util;
const variable_replace = require("../variable_replace");

// write the domain conf
var conf_path = "/host/conf/bind";
cd(conf_path);
var domain = process.env.DOMAIN;
if(!domain) {
    throw "no domain specified"
}
var key_file = findAKeyFile(".private");
if(key_file == null) {
    exec(`dnssec-keygen -a hmac-sha512 -b 512 -n HOST ${domain}`);
    key_file = findAKeyFile(".private");
}

domain_conf.generate(domain, key_file, `/files/domain.conf`, `${conf_path}/domain.conf`).then(function() {
    // write the config.json
    key_file = findAKeyFile(".key");
    return gutil.promise(fs.readJSON, "/dyndns/config-template/config.json.example");
}).then(function(config) {
    config.domain = domain;
    config.keyfile = key_file;
    return gutil.promise(fs.writeJSON, "/host/conf/dyndns/config.json", config);
}).then(function() {
    return gutil.promise(fs.readFile, "/files/zone");
}).then(function(bytes) {
    var zone = bytes + "";
    zone = variable_replace.replace(zone, "domain", domain);
    return gutil.promise(fs.writeFile, `/var/bind/${domain}`, zone);
}).catch(function(error) {
    console.log(error);
});

function findAKeyFile(suffix) {
    var key_file = null;
    var files = ls(".");
    files.forEach(function(file) {
        var string = S(file);
        if(string.startsWith(`K${domain}`) && string.endsWith(suffix)) {
            key_file = file;
        }
    });
    if(key_file != null) {
        key_file = `${conf_path}/${key_file}`;
    }
    return key_file;
}
