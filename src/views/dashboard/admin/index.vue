<template>
  <div class="dashboard-editor-container">

    <panel-group :user-data="userData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pie-chart :user-data="userData" />
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import { usersCount } from '@/api/user'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup, PieChart
  },
  data() {
    return {
      userData: {
        total: 0,
        mail: 0,
        google: 0,
        apple: 0
      }
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'usersCount'
  },
  created() {
    this.usersCount()
  },
  methods: {
    usersCount() {
      var self = this
      usersCount().then(function(response) {
        console.log(response)
        self.userData = response.body
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
}

@media (max-width:1024px) {

}
</style>
