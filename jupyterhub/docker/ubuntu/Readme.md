## Hot to test

Use docker compose to launch the services:

```bash
docker compose up --build
```

Go to [http://localhost:8000/hub/home](http://localhost:8000/hub/home) and login
using the testing user `user1:user1`. You will find the collaboration jupyterlab
as a service in jupyterhub.

![jupyterhub_services](jupyterhub_services.png)