FROM alpine
MAINTAINER Achim Rohn <achim@rohn.eu>

EXPOSE 3000
EXPOSE 53

RUN apk --no-cache add nodejs git bind
RUN mkdir /files
COPY files/* /files/
RUN cp /files/named.conf /etc/bind/; \
    mkdir /host; \
    ln -s /host/conf/bind /etc/bind/conf
RUN adduser -D dyndns; mkdir /dyndns; chown dyndns:dyndns /dyndns
#USER dyndns
#RUN git clone https://git.gorlug.de/nodejs/dyndns.git /dyndns/
#RUN cd /dyndns; npm install
