# About

This implementation provides a way to update a bind server with dyndns ip. This is mainly intended for the FritzBox dyndns service and it is unclear how well it performs for other dyndns clients.

# Docker container

Build the image by running

```
sh docker/build.sh
```

Adapt docker-compose to your needs, especially the domain. Then create a container with docker-compose

```
docker-compose up -d
```

To check if it runs: 

```
curl --header "http_x_forwarded_for: 192.168.0.1" http://localhost:3000
nslookup www.example.com 127.0.0.1
```

The port 3000 is supposed to run behind a web server like nginx with basic authentication.
