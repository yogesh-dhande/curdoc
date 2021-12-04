
FROM continuumio/anaconda3

RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | tee /etc/apt/trusted.gpg.d/caddy-stable.asc \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt update \
    && apt install caddy
    
RUN apt-get install lsof

COPY environment.yaml* /tmp/conda-tmp/
RUN /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml \
    && rm -rf /tmp/conda-tmp

ARG PORT=8080
ENV PORT=$PORT
EXPOSE $PORT

ARG USER=server
RUN useradd -s /bin/bash -m ${USER} -u 1000 \
    && mkdir -p /projects && chown -R 1000 /projects

USER ${USER}

WORKDIR /app

COPY . .

CMD ["/bin/bash", "src/scripts/run.sh"]