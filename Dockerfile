FROM caddy

WORKDIR /app

ADD client/dist dist

ADD Caddyfile .

CMD ["caddy", "run"]