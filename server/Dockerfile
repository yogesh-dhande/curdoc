
FROM continuumio/anaconda3

RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | tee /etc/apt/trusted.gpg.d/caddy-stable.asc \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt update \
    && apt install caddy
    
RUN apt-get install lsof

COPY environment.yaml* /tmp/conda-tmp/
RUN /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml \
    && rm -rf /tmp/conda-tmp

WORKDIR /app

EXPOSE 8080

COPY . ./

RUN /opt/conda/bin/conda env export --name base > public/base.yaml

ARG USER=sandbox
RUN useradd -s /bin/bash -m ${USER} -u 1000 \
    && mkdir -p /projects && chown -R 1000 /projects

USER ${USER}

CMD ["/bin/bash", "run.sh"]