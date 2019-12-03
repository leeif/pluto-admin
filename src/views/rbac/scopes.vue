<template>
  <div class="app-container">
    <h3>You are now in the application: <span style="color:red;">{{ application.name }}</span></h3>
    <el-button type="primary" @click="handleAddScope">New Scope</el-button>
    <el-table v-loading="listLoading" :data="scopes" border fit highlight-current-row style="width: 100%;margin-top:30px">
      <el-table-column align="center" label="System ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="Scope Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="newScopeVisible" :title="'New Scope'">
      <el-form :model="scope" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="scope.name" placeholder="Scope Name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="newScopeVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmNewScope">Confirm</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getScopeList" />
  </div>
</template>

<script>
import { getScopes, createScope } from '@/api/rbac'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultScope = {
  name: ''
}

const defaultApplication = {
  name: ''
}

export default {
  name: 'Scopes',
  components: { Pagination },
  data() {
    return {
      scopes: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      appId: null,
      application: Object.assign({}, defaultApplication),
      newScopeVisible: false,
      scope: Object.assign({}, defaultScope)
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getScopeList'
  },
  created() {
    this.appId = this.$route.params && this.$route.params.appId
    this.getScopeList()
  },
  methods: {
    getScopeList() {
      if (!this.appId) {
        return
      }
      this.listLoading = true
      getScopes(this.appId).then(response => {
        console.log(response.body.scopes)
        this.application = response.body.application
        this.scopes = response.body.scopes
        this.total = this.scopes.length
        this.listLoading = false
      })
    },
    handleAddScope() {
      this.scope = Object.assign({}, defaultScope)
      this.newScopeVisible = true
    },
    async confirmNewScope() {
      var data = {
        app_id: this.application.id,
        name: this.scope.name
      }
      await createScope(data)
      this.newScopeVisible = false
      this.getScopeList()
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
