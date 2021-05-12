FROM alpine:latest

EXPOSE 8888
EXPOSE 8889

RUN apk update && apk add git

WORKDIR /usr/share/jupyterlab

RUN git clone https://github.com/jupyter-rtc/jupyterlab.git

WORKDIR /

RUN apk add build-base python3 python3-dev py3-pip py3-pyzmq py3-argon2-cffi libffi-dev
RUN python3 -m pip install -U pip setuptools
RUN apk add nodejs nodejs-dev npm pixman-dev cairo-dev pango-dev jpeg-dev

WORKDIR /usr/share/jupyterlab/jupyterlab

RUN pip3 install -e .
RUN jlpm
RUN jlpm build
RUN jupyter lab build --app-dir /usr/share/jupyterlab/jupyterlab

RUN pip3 install jupyterlab-link-share
RUN jupyter lab build --app-dir /usr/share/jupyterlab/jupyterlab

WORKDIR /usr/workspace

CMD ["jupyter", "lab", "--LabApp.app_dir", "/usr/share/jupyterlab/jupyterlab", "--ip", "0.0.0.0", "--allow-root", "--dev-mode", "--collaborative", "true"]
