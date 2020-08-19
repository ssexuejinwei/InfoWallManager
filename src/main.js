import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/components'
import './plugins/element.js'
import http from './http/http'
import axios from 'axios'
import './http/axios'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://6dad3df829d84022ac4b9f791969fc52@sentry.io/1889540',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}
Vue.prototype.$cookies = VueCookies
Vue.prototype.$axios = axios
Vue.prototype.$baseURL = 'http://112.126.66.14:5000'
axios.defaults.baseURL = 'http://112.126.66.14:5000'

// axios.defaults.baseURL = ''
// axios 拦截器

Vue.config.productionTip = false
Vue.prototype.$http = http
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if (module.hot) {
  module.hot.accept() // already had this init code

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear()
  })
}
