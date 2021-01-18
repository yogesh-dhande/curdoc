FROM continuumio/anaconda3

COPY environment.yaml* /tmp/conda-tmp/
RUN /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml \
    && rm -rf /tmp/conda-tmp

WORKDIR /app

COPY . .

ARG PORT=5006
EXPOSE ${PORT}

ARG USER=sandbox
RUN useradd -s /bin/bash -m ${USER}
USER ${USER}

CMD [ "/bin/bash", "start.sh" ]