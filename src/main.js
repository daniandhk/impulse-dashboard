import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import Vuelidate from 'vuelidate'
import VueSweetalert2 from 'vue-sweetalert2'
import VueMask from 'v-mask'
import VueYoutube from 'vue-youtube'
import vco from "v-click-outside"
import Notification from 'vue-notification'
import router from './router'
import i18n from './i18n'
import store from './store'
import VueHtmlToPaper from 'vue-html-to-paper'
import VueScreen from 'vue-screen';

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import "@/assets/scss/app.scss"

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  timeout: 1000,
  autoClose: true,
}

Vue.config.productionTip = false
Vue.prototype.$backendUrl = process.env.VUE_APP_BACKEND_URL
Vue.use(VueHtmlToPaper, options)
Vue.use(VueYoutube)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(vco)
Vue.use(Vuelidate)
Vue.use(VueSweetalert2);
Vue.use(VueMask)
Vue.use(Notification);
Vue.use(require('vue-chartist'))
Vue.use(VueScreen);
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')