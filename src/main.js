import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import Vuelidate from 'vuelidate'
import VueSweetalert2 from 'vue-sweetalert2'
import VueMask from 'v-mask'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueYoutube from 'vue-youtube'
import vco from "v-click-outside"
import Notification from 'vue-notification';
import router from './router'
import i18n from './i18n'
import store from './store'

import "@/assets/scss/app.scss"

Vue.config.productionTip = false
Vue.prototype.$backendUrl = process.env.VUE_APP_BACKEND_URL
Vue.use(VueYoutube)
Vue.use(BootstrapVue)
Vue.use(vco)
Vue.use(Vuelidate)
Vue.use(VueSweetalert2);
Vue.use(VueMask)
Vue.use(Notification);
Vue.use(require('vue-chartist'))
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE',
    libraries: 'places',
  },
  installComponents: true
})
Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')