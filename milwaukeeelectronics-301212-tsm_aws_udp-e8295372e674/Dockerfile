FROM node:14-alpine as ts-build

#FIXME: This dockerfile has not been updated since the refactor to place CDK
#        At the top level

#############################
#
# This Dockerfile is has 2 stages
# 
# Stage 1. Build
#   1. Creates a build directory (/home/node/build)
#   2. Install dev dependencies for nodejs, which includes build dependencies
#   3. Build
# 
#############################

WORKDIR /home/node/app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# @fixme - node:12 ++ to node: 18
FROM node:14-alpine as app
WORKDIR /home/node/app
COPY package.json .
COPY --from=ts-build /home/node/app/dist .
RUN npm install --production

EXPOSE 9000

ENTRYPOINT ["node", "index.js"]
