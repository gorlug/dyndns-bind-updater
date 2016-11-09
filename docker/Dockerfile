FROM alpine
MAINTAINER Achim Rohn <achim@rohn.eu>

EXPOSE 3000
EXPOSE 53

RUN apk --no-cache add nodejs git bind bind-tools bash
RUN mkdir /files
COPY files/* /files/
RUN cp /files/named.conf /etc/bind/; \
    mkdir /host; \
    ln -s /host/conf/bind /etc/bind/conf
RUN adduser -D dyndns; mkdir /dyndns; chown dyndns:dyndns /dyndns
USER dyndns
RUN git clone https://git.gorlug.de/nodejs/dyndns.git /dyndns/
RUN cd /dyndns; npm install --production; \
    mv config config-template; \
    ln -s /host/conf/dyndns config; \
    rm -rf logs; ln -s /host/logs/dyndns logs;\
    rm -rf updates; ln -s /host/updates updates
USER root
COPY startup.sh /files/
VOLUME ["/host"]
ENTRYPOINT ["/bin/bash", "/files/startup.sh"]
