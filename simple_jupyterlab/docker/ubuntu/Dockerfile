FROM ubuntu:20.04

EXPOSE 8888
EXPOSE 8889

RUN DEBIAN_FRONTEND=noninteractive apt update && apt upgrade -y && apt install -y git

WORKDIR /usr/share/jupyterlab

RUN git clone https://github.com/jupyter-rtc/jupyterlab.git

WORKDIR /

RUN DEBIAN_FRONTEND=noninteractive apt install -y build-essential python3-dev python3-pip libargon2-0-dev \
    libffi-dev libpixman-1-dev libcairo2-dev libpangox-1.0-dev libjpeg-dev \
    libczmq-dev

RUN python3 -m pip install -U pip setuptools
RUN snap install node --classic --channel=14

WORKDIR /usr/share/jupyterlab/jupyterlab

RUN pip3 install -e .
RUN jlpm
RUN jlpm build
RUN jupyter lab build --app-dir /usr/share/jupyterlab/jupyterlab

RUN pip3 install jupyterlab-link-share
RUN jupyter lab build --app-dir /usr/share/jupyterlab/jupyterlab

WORKDIR /usr/workspace

CMD ["jupyter", "lab", "--LabApp.app_dir", "/usr/share/jupyterlab/jupyterlab", "--ip", "0.0.0.0", "--allow-root", "--dev-mode", "--collaborative", "true"]
