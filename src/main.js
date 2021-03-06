// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from '@/assets/js/vue'
import App from './App'
import router from './router'
import 'normalize.css'
import '@/assets/css/common.css'
import '@/assets/css/iview.css'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import store from '@/store'
Vue.use(iview)
import components from '@/assets/js/components'
import VueAxios from 'vue-axios'
import axios from '@/assets/js/axios'
import { uploadPic, copyObj, simpleCopy } from '@/utils/common.js'

import '@/mockjs'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.use(components);

Vue.prototype.$uploadPic = uploadPic;
Vue.prototype.$copyObj = copyObj;
Vue.prototype.$simpleCopy = simpleCopy;
Vue.prototype.$copyWords = '有内鬼，中止交易';


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
