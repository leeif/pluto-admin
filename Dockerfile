FROM node:11 as build

ADD . /pluto-admin

WORKDIR /pluto-admin

ARG VUE_APP_BASE_API

RUN rm -rf node_modules/ && rm -rf package-lock.json && npm install
RUN VUE_APP_BASE_API=$VUE_APP_BASE_API npm run build:prod

FROM ubuntu:18.04

COPY --from=build /pluto-admin/dist /pluto-admin/dist

RUN apt-get update && apt-get install -y python3

WORKDIR /pluto-admin/dist


ENTRYPOINT python3 -m http.server 8888