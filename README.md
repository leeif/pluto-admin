Pluto Admim
===
Admin page of the pluto. Build on the [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin).

We separate the admin page from the pluto server repository for which you can deploy the admin page everywhere your want.

Feature
===

* pluto account login

* rbac mangement

* user management

Snapshots
===

login page

dashboard

rbac page

user management

Development
===

```
# clone the project
git clone https://github.com/leeif/pluto-admin.git

cd pluto-admin

# install dependency
npm install

# develop
npm run dev
```

Build
```
npm run build:stage
npm run build:prod
```

Docker
===

```
docker build -t pluto-admin .

docker run -e VUE_APP_BASE_API=http://<pluto server endpoint> -t pluto-admin -d
```
