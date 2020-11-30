# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.148.1/containers/python-3-miniconda/.devcontainer/base.Dockerfile

FROM continuumio/anaconda3

# Copy environment.yml (if found) to a temp locaition so we update the environment. Also
# copy "noop.txt" so the COPY instruction does not fail if no environment.yml exists.
COPY environment.yaml* /tmp/conda-tmp/
RUN if [ -f "/tmp/conda-tmp/environment.yaml" ]; then /opt/conda/bin/conda env update -n base -f /tmp/conda-tmp/environment.yaml; fi \
    && rm -rf /tmp/conda-tmp

# [Optional] Uncomment to install a different version of Python than the default
# RUN conda install -y python=3.6 \
#     && pip install --no-cache-dir pipx \
#     && pipx reinstall-all

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

ARG USER=client
RUN useradd -s /bin/bash -m ${USER}
USER ${USER}

WORKDIR /app

COPY . .

ARG PORT=5006
EXPOSE ${PORT}

CMD [ "/bin/bash", "start.sh" ]