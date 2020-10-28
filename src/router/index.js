import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '../views/_layout'

import store from '../store'

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters['user/isLogin']) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters['user/isLogin']) {
    next()
    return
  }
  next('/auth')
}

/** @type {import('vue-router').RouteConfig[]} */
const routes = [
  {
    path: '/',
    component: Layout,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: '/tripleData',
        component: () => import('@/views/TripleData/index')
      },
      {
        path: '/hotnodeInfo',
        component: () => import('@/views/HotNodeInfo/index'),
      },
      {
        path: '/othernodeInfo',
        component: () => import('@/views/OtherNodeInfo/index')
      }
    ]
  },

  {
    path: '/auth',
    component: () => import('@/views/Auth/index'),
    beforeEnter: ifNotAuthenticated
  },

  {
    path: '*',
    component: () => import('@/views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
