# Docker container

Build the image by running

```
sh docker/build.sh
```

Create a container with docker-compose

```
docker-compose up -d
```

The container will quickly terminate because some configuration is needed.

# Config

Copy or move `update_example` in `data/conf/dyndns` to `update` and adjust if necessary.

Generate dnssec keys in:

```
docker exec -it dyndns_server_1 "cd /host/conf/bind; dnssec-keygen -a hmac-sha512 -b 512 -n HOST www.example.com" 
```

Replace `www.example.com` with your actual domain.
