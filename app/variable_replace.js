const logger = require("gorlug-util").logger;

function replaceVariableConfig(string, key, config) {
    return replaceVariable(string, key, config[key]);
}

function replaceVariable(string, key, value) {
    logger.debug(`replacing key ${key} with value ${value}`);
    return string.replaceAll("${" + key + "}", value);
}

module.exports = {
    replace: replaceVariable,
    replaceConfig: replaceVariableConfig
}
