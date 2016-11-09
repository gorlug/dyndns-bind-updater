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
copyIfNotExists /files/domain.conf /host/conf/bind/domain.conf
copyIfNotExists /dyndns/config-template/config.json.template /host/conf/dyndns/config.json.template
copyIfNotExists /dyndns/config-template/update_example /host/conf/dyndns/update_example

chown -R dyndns:dyndns /host/conf/dyndns
chown -R dyndns:dyndns /host/logs/dyndns
chown -R dyndns:dyndns /host/updates

named
cd /dyndns
exec su dyndns -c "exec npm start"
