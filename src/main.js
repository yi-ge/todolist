import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import moment from 'moment'
import { getToken } from './util'
import { BASE_URL } from './config'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.min.css'

if (!window.localStorage) {
  alert('该系统需要localStorage支持')
}

Vue.prototype.$request = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      Authorization: getToken() ? 'Bearer ' + getToken() : ''
    }
  }
})

Vue.prototype.$moment = moment
Vue.prototype.$isDev = process.env.NODE_ENV !== 'production'

/**
 * deepCopy Object or Array
 * @param  {[type]} source
 * @return {[type]} new
 */
const deepCopy = (o) => {
  if (o === null) {
    return null
  } else if (Array.isArray(o)) {
    if (o.length === 0) {
      return []
    }
    let n = []
    for (let i = 0; i < o.length; i++) {
      n.push(deepCopy(o[i]))
    }
    return n
  } else if (typeof o === 'object') {
    let z = {}
    for (let m in o) {
      z[m] = deepCopy(o[m])
    }
    return z
  } else {
    return o
  }
}

Vue.prototype.deepCopy = deepCopy

Vue.use(Vuetify, {
  theme: {
    primary: '#4DBA87'
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
