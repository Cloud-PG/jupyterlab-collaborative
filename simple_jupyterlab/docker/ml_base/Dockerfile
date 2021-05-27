FROM tensorflow/tensorflow:2.4.1-gpu

RUN DEBIAN_FRONTEND=noninteractive apt update && apt upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt install -y git

WORKDIR /usr/share

RUN git clone https://github.com/jupyter-rtc/jupyterlab.git

WORKDIR /

RUN DEBIAN_FRONTEND=noninteractive apt install -y build-essential python3-dev python3-pip libargon2-0-dev \
    libffi-dev libpixman-1-dev libcairo2-dev libpangox-1.0-dev libjpeg-dev \
    libczmq-dev

RUN python3 -m pip install -U pip setuptools
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y curl

RUN python3 -m pip install --no-cache-dir idna==2.10
RUN python3 -m pip install --no-cache-dir importlib-metadata==3.10.1
RUN python3 -m pip install --no-cache-dir jupyterlab==v3.1.0a10
RUN python3 -m pip install --no-cache-dir jupyterlab-link-share

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
RUN DEBIAN_FRONTEND=noninteractive apt install -y pandoc texlive-xetex texlive-fonts-recommended texlive-generic-recommended
RUN python3 -m pip install pandoc

RUN DEBIAN_FRONTEND=noninteractive apt install -y libcurl4-openssl-dev libssl-dev
RUN python3 -m pip install --no-cache-dir jupyterhub pycurl
RUN npm install -g configurable-http-proxy
RUN jupyter serverextension enable --py jupyterlab --sys-prefix

COPY jupyterhub_config.py /etc/jupyterhub/

WORKDIR /usr/share/workspace

COPY requirements.txt /usr/share/workspace
RUN DEBIAN_FRONTEND=noninteractive apt install -y wget graphviz
RUN python3 -m pip install --no-cache-dir -r requirements.txt && rm requirements.txt
RUN python3 -m pip install --no-cache-dir scikit-image
RUN python3 -m pip install --no-cache-dir opencv-python
RUN DEBIAN_FRONTEND=noninteractive apt install -y libgl1
RUN apt clean

ADD jlab_collaborative_ext.tar.gz /usr/local/share

WORKDIR /usr/local/share/jupyterlab_collaborative_extension

RUN jupyter labextension install

WORKDIR /usr/share/workspace

CMD ["jupyter", "lab", "--ip=0.0.0.0", "--allow-root", "--debug", \
    "--LabApp.collaborative=True", \
    "--ServerApp.allow_password_change=False", \
    "--ServerApp.keyfile=/usr/local/share/certs/jupyter/hostcert.key", \
    "--ServerApp.certfile=/usr/local/share/certs/jupyter/hostcert.pem", \
    "--MappingKernelManager.cull_idle_timeout=10800", \
    "--MappingKernelManager.cull_connected=True"]
