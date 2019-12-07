FROM node:11

ADD . /pluto-admin

WORKDIR /pluto-admin

RUN rm -rf node_modules/ && rm -rf package-lock.json && npm install && npm i -g simple-server
RUN apt-get update && apt-get install -y python3

ENV VUE_APP_BASE_API=http://localhost:8010

ENTRYPOINT npm run build:prod && cd dist && python3 -m http.server 8888