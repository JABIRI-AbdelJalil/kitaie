#!/bin/bash

docker run -p 9000:9000/udp -e PORT=9000 -e HOST=0.0.0.0 -e API_URL=https://senuep1p03.execute-api.us-east-1.amazonaws.com/prod/ acg-udp-server:latest index.js