FROM alpine
MAINTAINER Achim Rohn <achim@rohn.eu>

EXPOSE 9091
EXPOSE 53

RUN apk --no-cache add nodejs git
RUN adduser -D dyndns
USER dyndns
RUN git clone https://git.gorlug.de/nodejs/dyndns.git /home/dyndns/
RUN cd /home/dyndns; npm install
USER root
