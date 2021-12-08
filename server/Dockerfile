
FROM continuumio/anaconda3

RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | tee /etc/apt/trusted.gpg.d/caddy-stable.asc \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt update \
    && apt install caddy
    
RUN apt-get install lsof

COPY environment.yaml* /tmp/conda-tmp/
RUN /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml \
    && rm -rf /tmp/conda-tmp

RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install nodejs -yq && apt-get autoclean

WORKDIR /app

RUN mkdir lsp
COPY lsp/package*.json lsp
RUN cd lsp && npm install

ARG PORT=8080
ENV PORT=$PORT
EXPOSE $PORT



COPY . .

RUN cd sandbox/static/envs && /opt/conda/bin/conda env export --name base > base.yaml

ARG USER=sandbox
RUN useradd -s /bin/bash -m ${USER} -u 1000 \
    && mkdir -p /projects && chown -R 1000 /projects

USER ${USER}

CMD ["/bin/bash", "run.sh"]