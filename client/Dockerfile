FROM node

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8080

ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL

CMD ["npm", "run", "serve"]