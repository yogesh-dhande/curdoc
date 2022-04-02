#!/bin/bash

PROJECT_ID=$(gcloud config get-value project)

echo $PROJECT_ID

gcloud deploy apply --file clouddeploy.yaml --region=us-central1 --project=$PROJECT_ID

# gcloud builds submit --timeout=1200s

gcloud deploy apply --file clouddeploy.yaml --region=us-central1 --project=$PROJECT_ID

gcloud deploy releases create 'rel-$DATE-$TIME' \
  --project=$PROJECT_ID \
  --region=us-central1 \
  --delivery-pipeline=curdoc-deployment \
  --images=frontend=gcr.io/$PROJECT_ID/frontend:latest,lsp=gcr.io/$PROJECT_ID/lsp:latest,sandbox=gcr.io/$PROJECT_ID/sandbox:latest
