
FROM python:3.7-stretch

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

ARG USER=server
RUN useradd -s /bin/bash -m ${USER} -u 1000 && mkdir -p /projects && chown -R 1000 /projects

COPY src/scripts/docker-debian.sh .

RUN apt-get update \
    && /bin/bash docker-debian.sh \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

ENV PORT=5000
ENV SANDBOX_IMAGE=bokeh_play_sandbox
EXPOSE $PORT

USER ${USER}

CMD ["/bin/bash", "src/scripts/run.sh"]