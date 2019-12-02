<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>
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
      <el-table-column align="center" label="Edit" width="120">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-edit">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoleList" />
  </div>
</template>

<script>
import { getRoles } from '@/api/rbac'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Roles',
  components: { Pagination },
  data() {
    return {
      roles: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      appId: null,
      appName: null
    }
  },
  created() {
    this.appId = this.$route.params && this.$route.params.appId
    this.appName = this.$route.params && this.$route.params.appName
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      if (!this.appId) {
        return
      }
      this.listLoading = true
      getRoles(this.appId).then(response => {
        console.log(response.body.roles)
        this.roles = response.body.roles
        this.total = this.roles.length
        this.listLoading = false
      })
    },
    handleAddRole() {

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
