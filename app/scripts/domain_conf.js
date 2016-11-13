const fs = require("fs-extra");
const gutil = require("gorlug-util").util;
const logger = require("gorlug-util").logger;
const variable_replace = require("../variable_replace");

function generate(domain, private_key_file, domain_conf_file, domain_conf_target) {
    logger.info(`generating a domain conf for domain ${domain} using the private key file ${private_key_file}, domain conf file ${domain_conf_file} and writing it to ${domain_conf_target}`);
    var read_conf = gutil.promise(fs.readFile, domain_conf_file);
    var read_key_file = gutil.promise(fs.readFile, private_key_file);
    return Promise.all([read_conf, read_key_file]).then(function(results) {
        conf_text = results[0] + "";
        key_text = results[1] + "";
        var key = extractTheKey(key_text);
        var conf = variable_replace.replace(conf_text, "domain", domain);
        conf = variable_replace.replace(conf, "key", key);
        return gutil.promise(fs.writeFile, domain_conf_target, conf);
    });
}

function extractTheKey(key_text) {
    var regex = new RegExp("Key: (.+)"); 
    var result = regex.exec(key_text);
    if(result.length <= 1) {
        throw gutil.createError("could not find a key in the key file");
    }
    return result[1];
}

module.exports = {
    generate: generate
}
