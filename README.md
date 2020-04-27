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

![login page](https://github.com/leeif/pluto-admin/blob/master/snapshots/login.png)

dashboard

![dashboard page](https://github.com/leeif/pluto-admin/blob/master/snapshots/dashboard.png)

rbac page

![rbac page](https://github.com/leeif/pluto-admin/blob/master/snapshots/rbac.png)

user management

![user_management page](https://github.com/leeif/pluto-admin/blob/master/snapshots/user_managment.png)

Development
===

```
# clone the project
git clone https://github.com/leeif/pluto-admin.git

cd pluto-admin

# install dependency
npm install

# develop, the base api url is default as http://localhost:8010
npm run dev

# staging/production, set the base api url of pluto server
VUE_APP_BASE_API=https://xxxx npm run staging/production
```

Change the proxy target to your own domain of the pluto server  in [vue.config.js](https://github.com/leeif/pluto-admin/blob/master/vue.config.js#L42).

Build
```
npm run build:stage
npm run build:prod
```

Update the env variable VUE_APP_BASE_API to your own domain of the pluto server in .env files.
