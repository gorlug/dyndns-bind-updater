const logger = require("gorlug-util").logger;
const fs = require("fs-extra");
const S = require("string");
const gutil = require("gorlug-util").util;
const path = require("path");
require("shelljs/global");

function replaceVariableConfig(string, key, config) {
    return replaceVariable(string, key, config[key]);
}

function replaceVariable(string, key, value) {
    logger.debug(`replacing key ${key} with value ${value}`);
    return string.replaceAll("${" + key + "}", value);
}

function createUpdateMessage(config, message, ip) {
    logger.info(`creating the update message for domain ${config.domain} with ip ${ip}`);
    message = S(message);
    message = replaceVariableConfig(message, "target_server", config);
    message = replaceVariableConfig(message, "target_port", config);
    message = replaceVariableConfig(message, "domain", config);
    message = replaceVariable(message, "ip", ip);
    return message.s;
}

function getUpdatePath(config) {
    return `updates/${config.domain}.update`;
}

function writeUpdate(config, message) {
    var file = getUpdatePath(config);
    logger.debug(`writing update to ${file}`);
    return gutil.promise(fs.writeFile, file, message);
}

function execPromise(command) {
    return new Promise(function(fullfill, reject) {
        exec(command, function(code, stdout, stderr) {
            if(code != 0) {
                return reject(gutil.createError(`could not execute nsupdate stdout: ${stdout}, stderr: ${stderr}`));
            }
            fullfill(stdout, stderr);
        });
    });
}

function executeTheUpdate(config) {
    logger.info(`executing an update of domain ${config.domain}`);
    var update_path = path.resolve(getUpdatePath(config));
    var command = `nsupdate -k ${config.keyfile} ${update_path}`;
    return execPromise(command); 
}

function createPromise(config, message, ip) {
    var update = createUpdateMessage(config, message, ip);
    return writeUpdate(config, update).then(function() {
        return executeTheUpdate(config);
    });
}

function init(config) {
    logger.info(`calling init on domain ${config.domain}`);
    return gutil.promise(fs.stat, getUpdatePath(config)).then(function(stat) {
        return executeTheUpdate(config);
    }).catch(function(error) {
        // do nothing
        logger.info(`doing nothing with error ${error} on init`);
    });
}

module.exports = {
    send: createPromise,
    init: init
};
