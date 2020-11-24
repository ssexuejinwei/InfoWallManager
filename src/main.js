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
import {VueEditor,Quill} from "vue2-editor";
import ImageResize from "quill-image-resize-module";
import { ImageDrop } from "quill-image-drop-module";
import {prefixApiUrl} from "./constant";
Vue.use(VueEditor);
// Vue.use(Quill);
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);
Vue.use(VueCookies);
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://6dad3df829d84022ac4b9f791969fc52@sentry.io/1889540',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}
Vue.prototype.$cookies = VueCookies
Vue.prototype.$axios = axios
// Vue.prototype.$baseURL = 'http://train.robizlab.com/infoWellApi/'
// axios.defaults.baseURL = 'http://train.robizlab.com/infoWellApi/'
Vue.prototype.$baseURL = prefixApiUrl
axios.defaults.baseURL = prefixApiUrl

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
