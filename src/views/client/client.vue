<template>
  <div class="app-container">
    <h2><span style="color:#6495ED;">Clients</span></h2>
    <el-button type="warning" style="margin:15px 0;" @click="handleNewClient">New Client</el-button>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Key">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>

      <el-table-column v-if="currentRole === 'admin'" align="center" width="180px" label="Approved">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.boolStatus" @change="handleUpdateClientStatus(scope.row.key, scope.row.boolStatus)" />
        </template>
      </el-table-column>

      <el-table-column v-if="currentRole !== 'admin'" align="center" width="180px" label="Status">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="newClientVisible" title="New Client">
      New Client
      <el-form :model="client" label-width="80px" label-position="left">
        <el-form-item label="Key">
          <el-input v-model="client.key" placeholder="key" />
        </el-form-item>
        <el-form-item label="Secret">
          <el-input v-model="client.secret" placeholder="secret" />
        </el-form-item>
        <el-form-item label="redirect_uri">
          <el-input v-model="client.redirect_uri" placeholder="redirect uri" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="newClientVisible=false">Cancel</el-button>
        <el-button type="primary" @click="newClient">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { validURL } from '@/utils/validate.js'
import { getClients, newClient, updateClientStatus } from '@/api/oauth'
import { Message } from 'element-ui'
export default {
  name: 'Logs',
  components: {},
  data() {
    return {
      list: [],
      listLoading: true,
      passwordType: 'password',
      client: {
        key: '',
        secret: '',
        redirect_uri: ''
      },
      newClientVisible: false,
      currentRole: 'user'
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getClients()
    this.currentRole = this.role
    console.log(this.currentRole)
  },
  methods: {
    async getClients() {
      this.listLoading = true
      var res = await getClients()
      console.log(res)
      this.list = res.body.clients
      for (var client of res.body.clients) {
        client.boolStatus = client.status === 'approved'
      }
      this.listLoading = false
    },
    async handleNewClient() {
      this.client = deepClone({})
      this.newClientVisible = true
    },
    async handleUpdateClientStatus(key, approved) {
      var status = approved ? 'approved' : 'denied'
      try {
        await updateClientStatus({
          key: key,
          status: status
        })
        Message.success(`Update client status to ${status}`)
      } catch (err) {
        Message.error(err)
      }
      await this.getClients()
    },
    async newClient() {
      if (!validURL(this.client.redirect_uri)) {
        Message.error('invalid redirect uri')
        return
      }
      try {
        await newClient(this.client)
        Message.success('New client created')
      } catch (err) {
        Message.error(err)
        return
      }
      await this.getClients()
      this.newClientVisible = false
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.secret.focus()
      })
    }
  }
}
</script>
