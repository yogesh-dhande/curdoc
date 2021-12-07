FROM continuumio/anaconda3

RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install nodejs -yq

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN pip install python-language-server[all]

ARG PORT=8080
ENV PORT=$PORT
EXPOSE $PORT

ARG USER=lsp
RUN useradd -s /bin/bash -m ${USER}
USER ${USER}

CMD ["node", "app.js"]




