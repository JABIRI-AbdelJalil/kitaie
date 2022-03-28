# Overview

The UDP Server which receives payloads from client devices.

## Scripts

See scripts in `package.json`

`yarn build` - Transpile typescript code to javascript

`yarn dev`- Run server in development mode (uses typescript files directly)

`yarn start` - Run server using the production build

`yarn test` - Run unit tests (jest)

## Building and Running Docker

The ECR image is updated by AWS CodePipelien when code is pushed to the master branch of the CodeCommit repository.

The "Develop" branch creates a development ECR image and deploys it to the development EC2 servers:

IP Address:
54.173.216.171:9000

The "master" branch creates a main ECR image and deploys it to the production EC2 server:

//@todo - Add production ip address here when the server is deployed.