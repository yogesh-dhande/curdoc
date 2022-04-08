# bokeh-play

A playground for building and deploying bokeh apps

## Develop locally using docker compose

- `cd client && npm run emulators`
- `docker compose up --build`

---

## Develop locally using kubernates on minikube

- `cd client && npm run emulators`
- `minikube start`
- From the command palette, select `Run on Kubernates` and select minikube as the context.

---

## Deploy to production

- `./deploy.sh`
