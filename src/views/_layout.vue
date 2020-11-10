<template>
  <el-container style="height: 100vh">
    <el-aside
      class="aside"
      :width="sideWidth"
    >
      <div
        class="logo"
        :class="{ 'is-active': !collapse }"
      >
        信息墙数据管理后台
      </div>
      <el-menu
        class="menu"
        background-color="#FFFFFF"
        text-color="#303133"
        active-text-color="#fff"
        router
        :default-active="defaultActive"
        :collapse="collapse"
        :collapse-transition="false"
      >
       <el-submenu index="1">
          <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <span>详情信息管理</span>
          </template>
          <el-menu-item index="/hotnodeInfo">热点新闻节点</el-menu-item>
          <el-menu-item index="/othernodeInfo">其他节点</el-menu-item>
      </el-submenu>
      <el-menu-item index="/tripleData">
          <span>三元组管理</span>
      </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container style="background-color: #F5F7FA;">
      <el-header class="header">
        <div
          class="collapse-button"
          :class="{ active: collapse }"
          @click="toggleCollapse"
        >
          <i class="el-icon-s-fold" style="color: black;"/>
        </div>
        <div
          class="logo-2"
          :class="{ 'is-active': collapse }"
        >
          信息墙数据管理后台
        </div>

      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import _ from 'lodash'

const menus = [
  // { name: '首页', path: '/' },
  { name: '用户信息管理', path: '/activity', icon: 'el-icon-present' },
  { name: ' ', path: '/product', icon: 'el-icon-goods' },
  { name: '订单管理', path: '/order', icon: 'el-icon-tickets' },
  { name: '教务系统', path: '/teach/student', icon: 'el-icon-date' },
  { name: '用户管理', path: '/user', icon: 'el-icon-user' },
  { name: '积分管理', path: '/score', icon: 'el-icon-coin' },
  { name: '活动管理', path: '/activity', icon: 'el-icon-present' },
  { name: '商品管理', path: '/product', icon: 'el-icon-goods' },
  { name: '订单管理', path: '/order', icon: 'el-icon-tickets' },
  { name: '教务系统', path: '/teach/student', icon: 'el-icon-date' },
  { name: '用户管理', path: '/user', icon: 'el-icon-user' },
  { name: '积分管理', path: '/score', icon: 'el-icon-coin' }
]

export default {
  data () {
    return {
      path:"/user",
      menus,
      collapse: false
    }
  },

  computed: {
    defaultActive () {
      // return '/hotnodeInfo'
      return  window.location.pathname;
      // const path = this.$route.path
      // const matches = this.menus.filter(m => path.indexOf(m.path) === 0)
      // if (matches.length === 0) return ''

      // const match = _.maxBy(matches, o => o.path.length)

      // return match.path
    },

    sideWidth () {
      return this.collapse ? '80px' : '200px'
    }
  },

  methods: {
    toggleCollapse () {
      this.collapse = !this.collapse
    },

    logout () {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.replace('/auth')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aside {
  transition: width 200ms ease;
  width: 300px;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;

  background: #FFFFFF;
  color: #FFFFFF;
  transition: 200ms color;

  font-weight: bold;
  &.is-active {
    color: #303133;
  }
}

.logo-2 {
  color: #FFFFFF;
  transition: 200ms color;
  &.is-active {
    color: #303133;
  }
}

.menu {
  height: calc(100vh - 60px);
  border: none;
}

.header {
  height: 60px;
  line-height: 60px;
  background: #FFFFFF;
  color: #fff;
  padding-left: 0;

  display: flex;

  .right {
    margin-left: auto;
  }
}

.collapse-button {
  width: 60px;
  height: 60px;
  text-align: center;
  transition: background 100ms;
  cursor: pointer;

  margin-right: 8px;

  &:hover {
    background: #FFFFFF
  }

  &.active i {
    transform: rotate(180deg)
  }
}

.el-main {
  padding: 0 20px 16px;
}

.el-menu-item {
  position: relative;
  &.is-active {
    background-color: #5F82FF !important;
    color: #FFFFFF !important;
    &::before {
      content: ' ';
      position: absolute;
      width: 3px;
      left: 0;
      top: 0;
      bottom: 0;
      background: #5F82FF;
      // height: 100%;
    }
  }
}
</style>
