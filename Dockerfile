FROM caddy

WORKDIR /app

ADD Caddyfile .

CMD ["caddy", "run"]

