# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.148.1/containers/python-3-miniconda/.devcontainer/base.Dockerfile

FROM continuumio/anaconda3

COPY environment.yaml* /tmp/conda-tmp/
RUN /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml \
    && rm -rf /tmp/conda-tmp

ARG USER=client
RUN useradd -s /bin/bash -m ${USER}
USER ${USER}

WORKDIR /app

COPY . .

ARG PORT=5006
EXPOSE ${PORT}

CMD [ "/bin/bash", "start.sh" ]