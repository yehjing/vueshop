// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 載入npm套件
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';

// 載入自訂義內容
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

// 導航守衛  驗證用戶是否登入
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // console.log("這裡需要驗證");
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        // 如果成功登入就放行
        next();
      } else {
        // 如果沒有，就回到登入頁面
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
});
