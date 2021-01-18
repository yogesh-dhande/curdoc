FROM continuumio/anaconda3

RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install nodejs -yq

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN pip install python-language-server[all]

EXPOSE 3000

CMD ["node", "app.js"]




