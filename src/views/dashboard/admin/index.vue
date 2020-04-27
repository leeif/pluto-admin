<template>
  <div class="dashboard-editor-container">

    <panel-group :user-data="userData" />

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import { usersCount } from '@/api/user'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup
  },
  data() {
    return {
      userData: {
        total: 0
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
