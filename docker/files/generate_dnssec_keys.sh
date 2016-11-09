#!/bin/bash
cd /host/conf/bind
dnssec-keygen -a hmac-sha512 -b 512 -n HOST $1
