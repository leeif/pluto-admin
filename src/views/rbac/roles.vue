<template>
  <div class="app-container">
    <h3>You are now in the application: <span style="color:red;">{{ application.name }}</span></h3>
    <el-button type="success" @click="handleAddRole">New Role</el-button>
    <el-table v-loading="listLoading" :data="roles" border fit highlight-current-row style="width: 100%;margin-top:30px">
      <el-table-column align="center" label="System ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="Role Name">
        <template slot-scope="scope">
          <svg-icon icon-class="star" style="color:#FFA500" v-show="application.default_role == scope.row.id"  />
          <span class="link-type" @click="handleSetDefaultRole(scope)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="Scopes">
        <template slot-scope="scope">
          <div class="block">
            <el-tag v-for="s in scope.row.scopes" :key="s.name" type="info" class="tag-item" style="margin-right:5px">
              {{ s.name }}
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

    <el-dialog :visible.sync="newRoleVisible" :title="'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="newRoleVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmNewRole">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editRoleVisible" :title="'Edit Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="Scopes">
          <el-drag-select v-model="value" style="width:500px;" multiple placeholder="select scopes" :disabled="dragSelectDisabled">
            <el-option v-for="scope in scopes" :key="scope.id" :label="scope.name" :value="scope.id" />
          </el-drag-select>
        </el-form-item>
        <div style="text-align:right;">
          <el-button type="danger" @click="editRoleVisible=false">Cancel</el-button>
          <el-button type="primary" @click="confirmEditRole">Confirm</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="setDefaultRoleVisible" :title="'Edit Role'">
      Set <span style="color:red;">{{ defaultRole.name }}</span> to default role ?
      <div style="text-align:right;">
        <el-button type="danger" @click="setDefaultRoleVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmSetDefaultRole">Confirm</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoleList" />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { getRoles, getScopes, createRole, setDefaultRole, roleScopesBatchUpdate } from '@/api/rbac'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultRole = {
  name: '',
  default_scope: null
}

const defaultApplication = {
  name: ''
}

export default {
  name: 'Roles',
  components: { Pagination, ElDragSelect },
  data() {
    return {
      value: [],
      roles: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      appId: null,
      application: Object.assign({}, defaultApplication),
      newRoleVisible: false,
      editRoleVisible: false,
      setDefaultRoleVisible: false,
      role: Object.assign({}, defaultRole),
      defaultRole: Object.assign({}, defaultRole),
      scopes: null,
      dragSelectDisabled: false
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getRoleList'
  },
  created() {
    this.appId = this.$route.params && this.$route.params.appId
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      if (!this.appId) {
        return
      }
      this.listLoading = true
      getRoles(this.appId).then(response => {
        console.log(response.body)
        this.application = response.body.application
        this.roles = response.body.roles
        this.total = this.roles.length
        this.listLoading = false
      })
    },
    getScopeList() {
      if (!this.appId) {
        return
      }
      getScopes(this.appId).then(response => {
        console.log(response.body.scopes)
        this.scopes = response.body.scopes
      })
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.newRoleVisible = true
    },
    handleEditRole(scope) {
      this.getScopeList()
      this.role = deepClone(scope.row)
      var v = []
      scope.row.scopes.forEach(function(scope) {
        v.push(scope.id)
      })
      this.value = v
      this.editRoleVisible = true
      this.scopeIDs = deepClone(this.value)
    },
    handleSetDefaultRole(scope) {
      this.defaultRole = deepClone(scope.row)
      this.setDefaultRoleVisible = true
    },
    async confirmNewRole() {
      var data = {
        app_id: this.application.id,
        name: this.role.name
      }
      await createRole(data)
      this.newRoleVisible = false
      await this.getRoleList()
    },
    async confirmEditRole() {
      var data = {
        role_id: this.role.id,
        scopes: this.value
      }
      await roleScopesBatchUpdate(data)
      this.editRoleVisible = false
      await this.getRoleList()
    },
    async confirmSetDefaultRole() {
      var data = {
        app_id: this.application.id,
        role_id: this.defaultRole.id
      }
      await setDefaultRole(data)
      this.setDefaultRoleVisible = false
      await this.getRoleList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
