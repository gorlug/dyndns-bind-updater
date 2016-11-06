const logger = require("gorlug-util").logger;
const nsupdate = require("./nsupdate");

function RequestHandler(config, message) {
    this.config = config;
    this.message = message;
}

RequestHandler.prototype.handler = function(request, response) {
    var ip = request.headers.http_x_forwarded_for;
    logger.info(`request from ${ip}`);
    nsupdate.send(this.config, this.message, ip); 
    response.end("");
}

module.exports = RequestHandler;
