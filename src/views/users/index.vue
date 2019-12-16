<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="Name or Mail Address" style="width: 400px;margin-right: 5px" class="filter-item" @keyup.enter.native="handleFindUser" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFindUser">
        Search
      </el-button>
    </div>

    <div v-if="users" class="block">
      <el-tag v-for="u in users" :key="u.id" :type="u.id == user.id ? 'danger' : 'info'" class="tag-item" style="margin-right:5px">
        <span class="link-type" @click="selectUser(u)">{{ u.name }} ({{ u.login_type }})</span>
      </el-tag>
    </div>

    <div v-if="(!users || users.length == 0) && !user">
      No User Found
    </div>
    <div v-if="user" style="margin-top:10px">
      <el-col :span="6" :xs="24">
        <user-card :user="user" />
      </el-col>
      <el-col :span="14" :xs="24">
        <el-table :data="user.applications" border fit highlight-current-row style="width: 100%;margin-left:30px;margin-bottom:30px">
          <el-table-column align="center" label="Application Name" width="100px">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>

          <el-table-column align="center" min-width="100px" label="Roles">
            <template slot-scope="scope">
              <div class="block">
                <el-tag v-for="r in scope.row.roles" :key="r.name" type="info" class="tag-item" style="margin-right:5px">
                  {{ r.name }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Edit" width="120">
            <template slot-scope="scope">
              <el-button type="success" size="small" icon="el-icon-edit" @click="handleEditRole(scope)">
                Edit
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </div>
    <el-dialog :visible.sync="editRoleVisible" :title="'Edit Application'">
      <el-form :model="application" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="application.name" placeholder=" Name" :disabled="true" />
        </el-form-item>
        <el-form-item label="Roles">
          <el-select v-model="value" style="width:500px;" placeholder="select roles">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <div style="text-align:right;">
          <el-button type="danger" @click="editRoleVisible=false">Cancel</el-button>
          <el-button type="primary" @click="confirmEditRole">Confirm</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { findUser } from '@/api/user'
import { getRoles, setUserRole } from '@/api/rbac'
import { deepClone } from '@/utils'
import UserCard from './components/UserCard'

const defaultApplication = {
  name: ''
}

export default {
  name: 'User',
  components: { UserCard },
  data() {
    return {
      application: Object.assign({}, defaultApplication),
      roles: null,
      value: null,
      editRoleVisible: false,
      user: null,
      users: null,
      applications: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        keyword: ''
      }
    }
  },
  created() {
  },
  methods: {
    async handleFindUser() {
      try {
        var res = await findUser(this.listQuery.keyword)
        console.log(res.body.users)
        this.users = res.body.users
        this.user = this.users[0]
        this.applications = res.body.applications
      } catch (error) {
        console.log(error)
        this.users = null
        this.user = null
      }
    },
    async handleEditRole(scope) {
      this.application = deepClone(scope.row)
      var res = await getRoles(this.application.id)
      console.log(res.body.roles)
      this.roles = res.body.roles
      if (scope.row.roles.length > 0) {
        this.value = scope.row.roles[0].id
      } else {
        this.value = null
      }
      this.editRoleVisible = true
    },
    async confirmEditRole() {
      var data = {
        app_id: this.application.id,
        user_id: this.user.id,
        role_id: this.value
      }
      await setUserRole(data)
      this.editRoleVisible = false
      await this.handleFindUser()
    },
    selectUser(user) {
      this.user = user
    }
  }
}
</script>
