# bokeh-play

A playground for building and deploying bokeh apps

## Develop on the local machine

- `docker compose up --build`

## Develop locally on minikube

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

## Deploy to staging

- Update `DEPLOY_TARGET` in `skaffold.yaml` to `staging`.
- Update `.env.staging.local`
  - NUXT_APP_ORIGIN_DOMAIN=curdoc.dev
  - NUXT_APP_WEB_PROTOCOL=https
  - NUXT_APP_WEBSOCKET_PROTOCOL=wss
- Update `sandbox-deployment.yaml`
  - name: ORIGIN_DOMAIN
    value: "curdoc.dev"
  - name: ORIGIN_PROTOCOL
    value: https
