import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes'

//Confi Routes
Vue.config.productionTip = false;
Vue.use(VueRouter);
const router = new VueRouter({routes});


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
