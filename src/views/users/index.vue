<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="Name or Mail Address" style="width: 400px;margin-right: 5px" class="filter-item" @keyup.enter.native="handleFindUser" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFindUser">
        Search
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      list: null,
      total: 0,
      user: null,
      listLoading: true,
      listQuery: {
        keyword: ""
      }
    }
  },
  created() {
  },
  methods: {
    handleFindUser() {

    }
  }
}
</script>