const http = require("http"); 
const url = require("url");
const util = require("util");
const fs = require("fs-extra");
const S = require("string");
const port = 3000

const config = fs.readJsonSync("config/config.json");
const update = createUpdateMessage();

function replaceVariable(string, key, value) {
    return string.replaceAll("${" + key + "}", value);
}

function createUpdateMessage() {
    var message = fs.readFileSync("config/update");
    message = S(message);
    message = replaceVariable(message, "target_server", config.target_server);
    return message.s;
}

const requestHandler = (request, response) => {  
  console.log(request.url);
  var parsed_url = url.parse(request.url, true);
  console.log(parsed_url.query);
  console.log(request.headers);
  var update = fs.readFileSync("config/update");
  var http_x_forwarded_for = request.headers.http_x_forwarded_for;
  var hello = "Hello Node.js Server! %s";
  hello = util.format(hello, http_x_forwarded_for);
  response.end(update)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

