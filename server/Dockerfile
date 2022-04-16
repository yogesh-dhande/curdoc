FROM python:3.9

RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | tee /etc/apt/trusted.gpg.d/caddy-stable.asc \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt update \
    && apt install caddy
    
RUN apt-get install lsof

WORKDIR /app

COPY ./requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

ARG USER=server
RUN useradd -s /bin/bash -m ${USER} -u 1000 \
    && mkdir -p /projects && chown -R 1000 /projects

USER ${USER}

CMD ["/bin/bash", "run.sh"]
