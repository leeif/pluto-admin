<template>
  <div class="app-container">
    <h3>
      You are now in the application:
      <span style="color:red;">{{ applicationName }}</span>
    </h3>
    <el-button type="success" @click="handleNewName">New I18n Name</el-button>
    <el-table
      v-loading="listLoading"
      :data="i18nNames"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:30px"
    >
      <el-table-column align="center" min-width="100px" label="Language">
        <template slot-scope="scope">
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.i18n_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Edit" width="120">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="handleEditName(scope)"
          >Edit</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Delete" width="120">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDeleteName(scope)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="newDialogVisible" :title="'New I18N Name'">
      <el-form :model="editName" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="editName.tag" placeholder="Language" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="editName.i18nName" placeholder="Name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="newDialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmNewName">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editDialogVisible" :title="'Edit I18N Name'">
      <el-form :model="editName" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="editName.tag" placeholder="Language" :disabled="true" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="editName.i18nName" placeholder="Name" />
        </el-form-item>
        <div style="text-align:right;">
          <el-button type="danger" @click="editDialogVisible=false">Cancel</el-button>
          <el-button type="primary" @click="confirmEditName">Confirm</el-button>
        </div>
      </el-form>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getAppI18nNames"
    />
  </div>
</template>

<script>
import { getAppI18nNames, setAppI18nNames } from '@/api/rbac'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultName = {
  tag: '',
  i18nName: ''
}

export default {
  name: 'I18nNames',
  components: { Pagination },
  data() {
    return {
      value: [],
      i18nNames: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      appId: null,
      applicationName: '',
      editDialogVisible: false,
      newDialogVisible: false,
      editName: Object.assign({}, defaultName)
    }
  },
  watch: {
    // call again the method if the route changes
    $route: 'getAppI18nNames'
  },
  created() {
    this.appId = this.$route.params && this.$route.params.appId
    this.getAppI18nNames()
  },
  methods: {
    getAppI18nNames() {
      if (!this.appId) {
        return
      }
      this.listLoading = true
      getAppI18nNames(this.appId).then((response) => {
        console.log(response.body)
        this.applicationName = response.body.app_name
        this.i18nNames =
          response.body.i18n_names == null ? [] : response.body.i18n_names
        this.total = this.i18nNames.length
        this.listLoading = false
      })
    },
    handleNewName() {
      this.editName = Object.assign({}, defaultName)
      this.newDialogVisible = true
    },
    handleEditName(scope) {
      this.editName = {
        tag: scope.row.tag,
        i18nName: scope.row.i18n_name
      }
      this.editDialogVisible = true
    },
    async confirmNewName() {
      let existing = false
      const updatedNames = this.i18nNames.map((name) => {
        if (name.tag === this.editName.tag) {
          name.i18n_name = this.editName.i18nName
          existing = true
        }
        return name
      })
      if (!existing) {
        updatedNames.push({
          tag: this.editName.tag,
          i18N_name: this.editName.i18nName
        })
      }
      await setAppI18nNames({
        app_id: parseInt(this.appId),
        i18n_names: updatedNames
      })
      this.newDialogVisible = false
      await this.getAppI18nNames()
    },
    async handleDeleteName(scope) {
      const updatedNames = this.i18nNames.filter((name) => {
        return name.tag !== scope.row.tag
      })
      await setAppI18nNames({
        app_id: parseInt(this.appId),
        i18n_names: updatedNames
      })
      await this.getAppI18nNames()
    },
    async confirmEditName() {
      const updatedNames = this.i18nNames.map((name) => {
        if (name.tag === this.editName.tag) {
          name.i18n_name = this.editName.i18nName
        }
        return name
      })
      await setAppI18nNames({
        app_id: parseInt(this.appId),
        i18n_names: updatedNames
      })
      this.editDialogVisible = false
      await this.getAppI18nNames()
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

.permission-alert {
  margin-top: 15px;
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}
</style>
