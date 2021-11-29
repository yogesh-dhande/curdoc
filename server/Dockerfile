
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


RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV PORT=5000
EXPOSE $PORT

ENV SANDBOX_IMAGE=bokeh_play_sandbox

ARG USER=server
RUN useradd -s /bin/bash -m ${USER} -u 1000 -g 999 \
    && mkdir -p /projects && chown -R 1000 /projects

# USER ${USER}


CMD ["/bin/bash", "src/scripts/run.sh"]