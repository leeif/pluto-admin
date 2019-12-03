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
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="Scopes">
        <template slot-scope="scope">
          <div class="block">
            <el-tag v-for="s in scope.row.scopes" key="info" type="info" class="tag-item">
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
          <el-drag-select v-model="value" style="width:500px;" multiple placeholder="select scopes">
            <el-option v-for="scope in scopes" :key="scope.id" :label="scope.name" :value="scope.name" />
          </el-drag-select>
         </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="editRoleVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmEditRole">Confirm</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoleList" />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { getRoles, getScopes, createRole } from '@/api/rbac'
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
      role: Object.assign({}, defaultRole),
      scopes: null
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
        v.push(scope.name)
      })
      this.value = v
      this.editRoleVisible = true
    },
    async confirmNewRole() {
      var data = {
        app_id: this.application.id,
        name: this.role.name
      }
      await createRole(data)
      this.newRoleVisible = false
      this.getRoleList()
    },
    async confirmEditRole() {
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
