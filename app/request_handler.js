const logger = require("gorlug-util").logger;
const nsupdate = require("./nsupdate");

function handler(request, response) {
    var ip = request.headers["x-forwarded-for"];
    logger.info(`request from ${ip}`);
    nsupdate.send(this.config, this.message, ip).then(function() {
        response.end();
    }).catch(function(error) {
        logger.error(error);
        response.statusCode = 500;
        response.end();
    });
}

module.exports = handler;
