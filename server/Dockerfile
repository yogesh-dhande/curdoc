
FROM python:3.7-stretch

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

COPY docker-debian.sh .

RUN apt-get update \
    && /bin/bash docker-debian.sh \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ARG USER=server
RUN useradd -s /bin/bash -m ${USER}
USER ${USER}

ENV PORT=8000
ENV SANDBOX_IMAGE=bokeh_play_sandbox
EXPOSE $PORT

CMD ["/bin/bash", "run.sh"]