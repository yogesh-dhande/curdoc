#!/bin/bash

gcloud builds submit --timeout=1200s

PROJECT_ID=$(gcloud config get-value project)

echo $PROJECT_ID

gcloud deploy releases create test-release-012 \
  --project=$PROJECT_ID \
  --region=us-central1 \
  --delivery-pipeline=my-demo-app-1 \
  --images=frontend=gcr.io/$PROJECT_ID/frontend:latest,lsp=gcr.io/$PROJECT_ID/lsp:latest,sandbox=gcr.io/$PROJECT_ID/sandbox:latest