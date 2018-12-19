import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.less';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './element-variables.scss';
import Vuex from 'vuex';

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
