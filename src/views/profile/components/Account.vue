<template>
  <div>
    <el-form>
      <el-form-item label="Name">
        <el-input v-model.trim="user.name" :disabled="true" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model.trim="user.email" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="true" @click="submit">Update</el-button>
        <span class="link-type" style="margin-left:10px" @click="handleResetMail">reset password</span>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="resetMailVisiable" :title="'Reset Passowrd'">
      Send reset password mail to <span style="color:red;">{{ user.email }}</span> ?
      <div style="margin-top:10px">
        <span v-show="countDownTime>0">Retry after <span style="color:red;">{{ countDownTime }}</span> s</span>
      </div>
      <div style="text-align:right;">
        <el-button type="danger" @click="resetMailVisiable=false">Cancel</el-button>
        <el-button v-show="countDownTime<=0" type="primary" @click="confirmResetMail">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetPassword } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      resetMailVisiable: false,
      countDownTime: 0
    }
  },
  methods: {
    submit() {
      // this.$message({
      //   message: 'User information has been updated successfully',
      //   type: 'success',
      //   duration: 5 * 1000
      // })
    },
    handleResetMail() {
      this.resetMailVisiable = true
    },
    async confirmResetMail() {
      var data = {
        mail: this.user.email
      }
      console.log(data)
      await resetPassword(data)
      this.$notify({
        title: 'Success',
        message: 'Reset Mail Send Successfully, Retry after 60s',
        type: 'success',
        duration: 2000
      })
      this.resetMailVisiable = false
      await this.countDown(60)
    },
    async countDown(duration) {
      var self = this
      this.countDownTime = duration
      return new Promise(function(resolve, reject) {
        var interval = setInterval(function() {
          duration--
          self.countDownTime = duration
          if (!duration) {
            clearInterval(interval)
            resolve()
          }
        }, 1000)
      })
    }
  }
}
</script>
