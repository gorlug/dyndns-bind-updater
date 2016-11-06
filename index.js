const http = require("http"); 
const logger = require("gorlug-util").logger;
const config = require("gorlug-util").config;
const gutil = require("gorlug-util").util;
const fs = require("fs-extra");
const request_handler = require("./app/request_handler");

var conf;
var update;

logger.info("starting dyndns listener");
config.initPromise("config/config.json").then(function(configInit) {
    conf = configInit;
    return gutil.promise(fs.readFile, "config/update"); 
}).then(function(update_example) {
    update = update_example + "";
    var handler = request_handler.bind({ config: conf, message: update });

    const server = http.createServer(handler)

    server.listen(conf.port, function(err) {  
      if (err) {
        return logger.error("something bad happened", err);
      }
      logger.info(`server is listening on ${conf.port}`)
    });
});
