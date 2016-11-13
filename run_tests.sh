#!/bin/sh

export NODE_ENV=test
mocha=./node_modules/.bin/mocha

$mocha app/nsupdate.test.js
$mocha app/request_handler.test.js
$mocha app/scripts/domain_conf.test.js
