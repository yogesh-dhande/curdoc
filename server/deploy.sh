#!/bin/bash
if [[ -z $1 ]]; then
    echo please provide one of: staging or production
elif [ $1 = "staging" ]; then
    echo staging
    # gcloud config set project databrowser-ykd && gcloud builds submit
elif [ $1 = "prod" ]; then
    echo prod
    # gcloud config set project bokeh-gcp-deploy && gcloud builds submit
fi