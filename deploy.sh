#!/bin/bash

PROJECT_ID=$(gcloud config get-value project)
REGION=us-central1
IMAGE_REGISTRY=us-docker.pkg.dev/$PROJECT_ID/gcr.io

echo $PROJECT_ID

gcloud builds submit --timeout=1800s

gcloud deploy apply --file clouddeploy.yaml --region=us-central1 --project=$PROJECT_ID

gcloud deploy releases create 'rel-$DATE-$TIME' \
  --project=$PROJECT_ID \
  --region=$REGION \
  --delivery-pipeline=curdoc-deployment \
  --images=frontend=$IMAGE_REGISTRY/frontend,lsp=$IMAGE_REGISTRY/lsp,sandbox=$IMAGE_REGISTRY/sandbox

# cd client && npm run deploy

echo https://console.cloud.google.com/deploy/delivery-pipelines/$REGION/curdoc-deployment?project=$PROJECT_ID