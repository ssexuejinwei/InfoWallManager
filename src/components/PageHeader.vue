<template>
  <header class="header">
    <div
      v-if="title"
      class="title"
    >
      <template v-if="back">
        <a
          href="javascript:void(0);"
          @click="$router.back()"
        >
          <i
            class="el-icon-arrow-left"
          />
          <span>返回</span>
        </a>
        <el-divider direction="vertical" />
      </template>
      {{ title }}
    </div>
    <div>
      <slot />
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    back: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  margin: 0 -20px 16px;
}

.title {
  border-bottom: 1px rgba(0,0,0,0.15) solid;
  padding: 12px 20px;
  color: #444;
}
</style>
