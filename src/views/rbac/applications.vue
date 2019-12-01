<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddApplication">New Application</el-button>
    <el-table v-loading="listLoading" :data="applications" border fit highlight-current-row style="width: 100%;margin-top:30px">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="Application Name">
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
      <el-table-column align="center" label="Roles" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-document">
            Roles
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Scopes" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-document">
            Scopes
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getApplications } from '@/api/rbac'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'ArticleList',
  components: { Pagination },
  data() {
    return {
      applications: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getApplications().then(response => {
        console.log(response.body.applications)
        this.applications = response.body.applications
        this.total = this.applications.length
        this.listLoading = false
      })
    },
    handleAddApplication() {

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