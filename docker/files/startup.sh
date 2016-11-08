#!/bin/sh
mkdir -p /host/conf/bind

if [ ! -e "/host/conf/bind/domain.conf" ]
then
        cp /files/domain.conf /host/conf/bind/
fi 
