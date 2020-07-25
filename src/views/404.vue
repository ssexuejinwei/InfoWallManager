<template>
  <div>
    <h1>404 Not Found</h1>
    <el-link
      type="primary"
      href="/"
    >
      返回首页
    </el-link>
    <template v-if="prevRoute">
      <el-divider direction="vertical" />
      <el-link
        type="primary"
        :href="prevRoute.path"
      >
        返回上一页
      </el-link>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      prevRoute: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  }
}
</script>
