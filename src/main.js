import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import moment from 'moment'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.prototype.$request = axios.create()
Vue.prototype.$moment = moment
Vue.prototype.$isProd = process.env.NODE_ENV === 'production'

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
