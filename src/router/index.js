import Vue from '@/assets/js/vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

// 主页
import home from '@/page/home'  //主页
import login from '@/page/login' //登录页面
import defaultPage from '@/page/default-page' //默认模块

// 用户
import userParent from '@/page/user/parent-list' //家长列表
import userTutor from '@/page/user/tutor-list'  //家教列表

//审核管理
import verifyParent from '@/page/verify/parent-list' //审核家长
import verifyTutor from '@/page/verify/tutor-list'  //审核家教

//投诉管理
import complain from '@/page/complain/complain'


//配置管理
import baseConfig from '@/page/config/base-config' //基本配置

// 交易记录
import auditList from '@/page/trade/audit-list'
import refList from '@/page/trade/refund-list'
import buyList from '@/page/trade/buy-list'
import buyRefund from '@/page/trade/buy-refund'

//对账

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: function(path) {
        console.log(path);
        return localStorage.getItem('token')
          ? localStorage.getItem('cur_path')
          : '/login'
      }
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/',
          name: 'defaultPage',
          component: defaultPage
        }, {
          path: '/user/parent-list',
          name: 'userParent',
          component: userParent
        },{
          path: '/user/tutor-list',
          name: 'userTutor',
          component: userTutor
        },{
          path: '/verify/parent-list',
          name: 'verifyParent',
          component: verifyParent
        },{
          path: '/verify/tutor-list',
          name: 'verifyTutor',
          component: verifyTutor
        },{
          path: '/complain/complain',
          name: 'complain',
          component: complain
        },{
          path: '/config/base-config',
          name: 'baseConfig',
          component: baseConfig
        },{
          path: '/trade/audit-list',
          name: 'auditList',
          component: auditList
        },{
          path: '/trade/ref-list',
          name: 'refList',
          component: refList
        },{
          path: '/trade/buy-list',
          name: 'buyList',
          component: buyList
        },{
          path: '/trade/buy-refund',
          name: 'buyRefund',
          component: buyRefund
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  //console.log(to.hash)

  if (!localStorage.getItem('token') && to.path != '/login') {
    router.push('/login')
  }

  localStorage.setItem('cur_path', to.path)
  store.commit('SET_CUR_PATH', to.path)
  next(() => {
    console.log(123123123);
  });
})


export default router;
