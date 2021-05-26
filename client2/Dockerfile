FROM node

RUN npm install -g firebase-tools && apt-get update && apt-get install -y openjdk-8-jre

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 8080

ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL

USER node

CMD ["npm", "run", "serve"]