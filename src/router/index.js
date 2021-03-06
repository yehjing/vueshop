import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import CustomerOrders from '@/components/pages/CustomerOrders';
import Coupons from '@/components/pages/Coupons';
import Orders from '@/components/pages/Orders';
import CustomCheckOut from '@/components/pages/CustomCheckOut';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      // 假如用戶輸入的路徑不是所定義的，就導回login頁面
      // 避免用戶進入不存在之頁面
      path: '*',
      redirect: 'login',
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   // 路由元信息，確保進入這個頁面前是需要被驗證的
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          // 路由元信息，確保進入此頁面時是需要被驗證
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_orders', 
          name: 'CustomerOrders',
          component: CustomerOrders,
        },
        {
          path: 'customer_checkout/:orderId', 
          name: 'CustomCheckOut',
          component: CustomCheckOut,
        },
      ],
    }
  ],
});
