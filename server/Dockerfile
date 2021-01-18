
FROM python:3.8-buster

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] \
    http://packages.cloud.google.com/apt cloud-sdk main" \
    | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg \
    | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - \
    && apt-get update -y && apt-get install google-cloud-sdk -y \
    && pip uninstall crcmod && pip install --no-cache-dir -U crcmod

ARG USER=server
RUN groupadd docker && useradd -s /bin/bash -m ${USER} -u 1000 -g docker \
    && mkdir -p /projects && chown -R 1000 /projects

COPY src/scripts/docker-debian.sh .

RUN apt-get update \
    && /bin/bash docker-debian.sh \
    && apt-get autoremove -y && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && chmod 666 /var/run/docker.sock

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . /app

ENV PORT=5000
ENV SANDBOX_IMAGE=bokeh_play_sandbox
EXPOSE $PORT

USER ${USER}

CMD ["/bin/bash", "src/scripts/run.sh"]