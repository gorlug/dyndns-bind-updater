#!/bin/sh
mkdir -p /host/conf/bind
mkdir -p /host/conf/dyndns
mkdir -p /host/logs/dyndns
mkdir -p /host/logs/bind
mkdir -p /host/updates

function copyIfNotExists {
    if [ ! -e "$2" ]
    then
            cp $1 $2
    fi 
}
copyIfNotExists /dyndns/config-template/update_example /host/conf/dyndns/update
cp /files/docker_setup.js /dyndns/app/scripts/docker_setup.js
chown -R dyndns:dyndns /dyndns
if [ ! -e "/host/conf/dyndns/config.json" ]
then
        node /dyndns/app/scripts/docker_setup.js
fi 

chown -R dyndns:dyndns /host/conf/dyndns
chown -R dyndns:dyndns /host/logs/dyndns
chown -R dyndns:dyndns /host/updates
chown dyndns:dyndns /host/conf/bind/K$DOMAIN*

named
cd /dyndns
exec su dyndns -c "exec npm start"
