const logger = require("gorlug-util").logger;
const fs = require("fs-extra");
const S = require("string");
const gutil = require("gorlug-util").util;

function replaceVariableConfig(string, key, config) {
    return replaceVariable(string, key, config[key]);
}

function replaceVariable(string, key, value) {
    logger.debug(`replacing key ${key} with value ${value}`);
    return string.replaceAll("${" + key + "}", value);
}

function createUpdateMessage(config, message, ip) {
    logger.info(`creating the update message with ip ${ip}`);
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
    return gutil.promise(fs.writeFile, file, message);
}

function createPromise(config, message, ip) {
    var update = createUpdateMessage(config, message, ip);
    return writeUpdate(config, update);
}

module.exports = createPromise;
