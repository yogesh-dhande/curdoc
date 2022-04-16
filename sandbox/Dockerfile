
FROM continuumio/anaconda3

COPY environment.yaml* /tmp/conda-tmp/
RUN /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml \
    && rm -rf /tmp/conda-tmp

WORKDIR /app

EXPOSE 8080

COPY . ./

ARG USER=sandbox
RUN useradd -s /bin/bash -m ${USER} -u 1000
USER ${USER}

ENTRYPOINT [ "/bin/bash" ]