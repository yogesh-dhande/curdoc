# bokeh-play

A playground for building and deploying bokeh apps

## Develop locally using docker compose

- `docker compose up --build`

---

## Develop locally using kubernates on minikube

- `minikube start`
- Update `.env.staging.local`
  - NUXT_APP_ORIGIN_DOMAIN=127.0.0.1:4503
  - NUXT_APP_WEB_PROTOCOL=http
  - NUXT_APP_WEBSOCKET_PROTOCOL=ws
- Update `sandbox-deployment.yaml`
  - name: ORIGIN_DOMAIN
    value: "127.0.0.1:4503"
  - name: ORIGIN_PROTOCOL
    value: http
- From the command palette, select `Run on Kubernates` and select minikube as the context.

---

## Deploy to staging

- `./deploy.sh`
