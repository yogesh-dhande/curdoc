FROM node:14-alpine as builder

ARG DEPLOY_TARGET=staging
WORKDIR /app
ADD package*.json ./
RUN npm install
COPY . ./
ENV DEPLOY_TARGET=$DEPLOY_TARGET
RUN npm run build

FROM caddy

WORKDIR /app

COPY --from=builder ./app/dist ./dist/

ADD Caddyfile .

CMD ["caddy", "run"]
