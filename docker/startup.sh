#!/bin/sh
mkdir -p /host/conf/bind
mkdir -p /host/conf/dyndns
mkdir -p /host/logs/dyndns
mkdir -p /host/updates

function copyIfNotExists {
    if [ ! -e "$2" ]
    then
            cp $1 $2
    fi 
}
copyIfNotExists /dyndns/config-template/update_example /host/conf/dyndns/update
if [ ! -e "/host/conf/dyndns/config.json" ]
then
        node /dyndns/app/scripts/docker_setup.js
fi 

chown -R dyndns:dyndns /host/conf/dyndns
chown -R dyndns:dyndns /host/logs/dyndns
chown -R dyndns:dyndns /host/updates

named
cd /dyndns
exec su dyndns -c "exec npm start"
