FROM ubuntu:20.04

EXPOSE 8000
EXPOSE 8888

RUN DEBIAN_FRONTEND=noninteractive apt update && apt upgrade -y && apt install -y git

WORKDIR /usr/share

RUN git clone https://github.com/jupyter-rtc/jupyterlab.git

WORKDIR /

RUN DEBIAN_FRONTEND=noninteractive apt install -y build-essential python3-dev python3-pip libargon2-0-dev \
    libffi-dev libpixman-1-dev libcairo2-dev libpangox-1.0-dev libjpeg-dev \
    libczmq-dev

RUN python3 -m pip install -U pip setuptools
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y curl

WORKDIR /usr/share/jupyterlab

COPY force_collab.patch .

RUN git apply force_collab.patch
RUN pip3 install idna==2.10
RUN python3 setup.py install
RUN pip3 install jupyterlab-link-share

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
RUN jlpm
RUN npm run-script "build:dev:prod:release"
RUN /bin/bash -c "mkdir -p /usr/local/share/jupyter/lab/"
RUN /bin/bash -c "jupyter lab build"
RUN /bin/bash -c "cp -r /usr/share/jupyterlab/dev_mode/{static,schemas,themes} /usr/local/share/jupyter/lab/"

WORKDIR /usr/share/workspace

RUN DEBIAN_FRONTEND=noninteractive apt install -y libcurl4-openssl-dev libssl-dev
RUN pip3 install jupyterhub pycurl
RUN npm install -g configurable-http-proxy
COPY jupyterhub_config.py /etc/jupyterhub/
RUN jupyter serverextension enable --py jupyterlab --sys-prefix

RUN groupadd jupytershare
RUN useradd -m -G jupytershare user0
RUN useradd -m -G jupytershare user1

CMD ["jupyterhub", "-f", "/etc/jupyterhub/jupyterhub_config.py"]
