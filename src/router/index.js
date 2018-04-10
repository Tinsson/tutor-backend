import Vue from '@/assets/js/vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

// 主页
import home from '@/page/home'  //主页
import login from '@/page/login' //登录页面
import defaultPage from '@/page/default-page' //默认模块

// 用户
import user from '@/page/user/user' //用户管理

//审核管理
import verifyParent from '@/page/verify/parent-list' //审核家长

//投诉管理
import complain from '@/page/complain/complain'


//配置管理
import globalConfig from '@/page/config/global-config' //全局配置
import taskNewcomer from '@/page/config/task-newcomer' //新手任务配置
import taskDaily from '@/page/config/task-daily' //每日任务配置
import coinConfig from '@/page/config/coin-config' //金币配置
import dialConfig from '@/page/config/dial-config' //大转盘配置

// 内容管理

//对账

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: function(path) {
        console.log(path);
        return sessionStorage.getItem('user_id')
          ? '/home'
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
          path: '/user/users',
          name: 'user',
          component: user
        },{
          path: '/verify/parent-list',
          name: 'verifyParent',
          component: verifyParent
        },{
          path: '/complain/complain',
          name: 'complain',
          component: complain
        },{
          path: '/config/task-newcomer',
          name: 'taskNewcomer',
          component: taskNewcomer
        },{
          path: '/config/task-daily',
          name: 'taskDaily',
          component:taskDaily
        },{
          path: '/config/global-config',
          name: 'globalConfig',
          component: globalConfig
        },{
          path:'/config/coin-config',
          name:'coinConfig',
          component:coinConfig
        },{
          path:'/config/dial-config',
          name:'dialConfig',
          component:dialConfig
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to.hash)
  if (!sessionStorage.getItem('user_id') && to.path != '/login') {
    router.push('/login')
  }
  sessionStorage.setItem('cur_path', to.path)
  store.commit('SET_CUR_PATH', to.path)
  next(() => {
    console.log(123123123);
  });
})

export default router;
