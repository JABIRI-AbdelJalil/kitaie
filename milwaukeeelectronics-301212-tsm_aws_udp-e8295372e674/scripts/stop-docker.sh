#!/bin/bash

ACCOUNT_ID=802312969274
REGION=us-east-1
IMAGE_NAME=dev-udp-server

# Docker containers need to be obliterated 

echo $ACCOUNT_ID $REGION $IMAGE_NAME

# TODO: The following line will fail on the first deployment. After the first run, uncomment this line.
docker system prune --volumes --force || true && docker stop udp-server-container || true && docker rm -f udp-server-container || true
