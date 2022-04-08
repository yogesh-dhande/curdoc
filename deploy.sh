#!/bin/bash

PROJECT_ID=$(gcloud config get-value project)

echo $PROJECT_ID

gcloud builds submit --timeout=1800s

gcloud deploy apply --file clouddeploy.yaml --region=us-central1 --project=$PROJECT_ID

gcloud deploy releases create 'rel-$DATE-$TIME' \
  --project=$PROJECT_ID \
  --region=us-central1 \
  --delivery-pipeline=curdoc-deployment \
  --images=frontend=us-docker.pkg.dev/$PROJECT_ID/gcr.io/frontend,lsp=us-docker.pkg.dev/$PROJECT_ID/gcr.io/lsp,sandbox=us-docker.pkg.dev/$PROJECT_ID/gcr.io/sandbox

# cd client && npm run deploy
