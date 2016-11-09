require("shelljs/global");
const fs = require("fs");

cd("/host/conf/bind");
var domain = process.argv[2];
exec(`dnssec-keygen -a hmac-sha512 -b 512 -n HOST ${domain}`);
