import Axios from 'axios'
import { Message } from 'element-ui'

const tokenKey = 'nike#token'

const state = {
  username: '',
  token: localStorage.getItem(tokenKey) || '',
  loading: false,
  error: null
}

const getters = {
  isLogin (state) {
    return !!state.token
  }
}

const mutations = {
  DO_LOGIN (state) {
    state.loading = true
  },
  LOGIN (state, { username = '', token = '', error = null }) {
    state.loading = false
    state.username = username
    state.token = token
    state.error = error
  },
  LOGOUT (state) {
    state.username = ''
    state.token = ''
  }
}

const actions = {
  login ({ commit }, { username, password }) {
    commit('DO_LOGIN')
    const token ='123'
    localStorage.setItem(tokenKey, token)
    commit('LOGIN', { username, token })
  },
  logout ({ commit }) {
    localStorage.removeItem(tokenKey)
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
