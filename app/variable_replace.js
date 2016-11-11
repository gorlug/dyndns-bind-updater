const logger = require("gorlug-util").logger;
const S = require("string");

function replaceVariableConfig(string, key, config) {
    return replaceVariable(string, key, config[key]);
}

function replaceVariable(string_value, key, value) {
    logger.debug(`replacing key ${key} with value ${value}`);
    var string = S(string_value);  
    return string.replaceAll("${" + key + "}", value).s;
}

module.exports = {
    replace: replaceVariable,
    replaceConfig: replaceVariableConfig
}
