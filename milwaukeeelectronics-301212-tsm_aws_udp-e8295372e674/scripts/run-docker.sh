#!/bin/bash

ACCOUNT_ID=802312969274
REGION=us-east-1
IMAGE_NAME=dev-udp-server

echo "Running docker"

# dev us-east-1
if [ "$DEPLOYMENT_GROUP_NAME" == "dev-udp-server-deployment-group" ]
then 
  echo "Configured for dev environment group"
  # Usage: on target EC2 instances, put the env file into `/home/environment/variables`
  docker run -d -p 9000:9000/udp --name=udp-server-container --restart=always -e PORT=9000 -e HOST=0.0.0.0 -e API_URL=https://senuep1p03.execute-api.us-east-1.amazonaws.com/prod/ -e CLOUDWATCH_LOGS_GROUP_NAME=dev-udp-server -e CLOUDWATCH_LOGS_REGION=us-east-1 -e CLOUDWATCH_LOGS_STREAM_NAME=dev $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$IMAGE_NAME
fi

# prod-us-east-2 & prod-ca-central-1
if [ "$DEPLOYMENT_GROUP_NAME" == "usprod-udp-server-deployment-group" ]
then 
  echo "Configured for prod environment group"

  # Usage: on target EC2 instances, put the env file into `/home/environment/variables`
  docker run -d -p 9000:9000/udp --name=udp-server-container --restart=always -e PORT=9000 -e HOST=0.0.0.0 -e API_URL=https://yn7cqpq107.execute-api.us-east-2.amazonaws.com/prod/ -e CLOUDWATCH_LOGS_GROUP_NAME=usprod-udp-server -e CLOUDWATCH_LOGS_REGION=us-east-2 -e CLOUDWATCH_LOGS_STREAM_NAME=usprod $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$IMAGE_NAME
fi