import './common/rem';
import './globalInfo'
import Vue from 'vue';
import axios from 'axios'
import App from './App.vue';
import { router } from './router';
Vue.prototype.$ajax = axios

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
