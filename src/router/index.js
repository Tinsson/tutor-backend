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
import verifyWechat from '@/page/verify/wechat-list' //微信审核
import verifyQrcode from '@/page/verify/qrcode-list' //二维码审核
import verifyEdu from '@/page/verify/edu-list' //学历审核

//投诉管理
import complain from '@/page/complain/complain'

//配置管理
import baseConfig from '@/page/config/base-config' //基本配置
import resourceConfig from '@/page/config/resource-config' //渠道配置
import tagConfig from '@/page/config/tag-config' //标签配置

// 交易记录
import contactList from '@/page/trade/contact-list'
import auditList from '@/page/trade/audit-list'
import refList from '@/page/trade/refund-list'
import buyList from '@/page/trade/buy-list'
import buyRefund from '@/page/trade/buy-refund'

//助教管理
import assisList from '@/page/assistant/assis-list'

//统计管理
import statsIndex from '@/page/statis/index'
import statsDetail from '@/page/statis/detail'

//权限管理
import auth from '@/page/authority/auth'
import role from '@/page/authority/role'
import admin from '@/page/authority/admin'

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
          path: '/verify/wechat-list',
          name: 'verifyWechat',
          component: verifyWechat
        },{
          path: '/verify/qrcode-list',
          name: 'verifyQrcode',
          component: verifyQrcode
        },{
          path: '/verify/edu-list',
          name: 'verifyEdu',
          component: verifyEdu
        },{
          path: '/complain/complain-list',
          name: 'complain',
          component: complain
        },{
          path: '/config/base-config',
          name: 'baseConfig',
          component: baseConfig
        },{
          path: '/config/resource-config',
          name: 'resourceConfig',
          component: resourceConfig
        },{
          path: '/config/tag-config',
          name: 'tagConfig',
          component: tagConfig
        },{
          path: '/trade/contact-list',
          name: 'contactList',
          component: contactList
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
        },{
          path: '/assistant/assis-list',
          name: 'assisList',
          component: assisList
        },{
          path: '/statis/index',
          name: 'statsIndex',
          component: statsIndex
        },{
          path: '/statis/detail',
          name: 'statsDetail',
          component: statsDetail
        },{
          path: '/authority/auth',
          name: 'auth',
          component: auth
        },{
          path: '/authority/role',
          name: 'role',
          component: role
        },{
          path: '/authority/admin',
          name: 'admin',
          component: admin
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  //console.log(to.hash)

  let menu = localStorage.getItem('menu'),
      admin_role = localStorage.getItem('admin_role'),
      pureMenu = JSON.parse(menu),
      urlArr = [];

  if(menu){
    pureMenu.forEach(val=>{
      val.children.forEach(vval=>{
        urlArr.push(val.path+vval.path);
      })
    });
  }


  if (!localStorage.getItem('token') && to.path != '/login') {
    router.push('/login');
    return;
  }

  if(urlArr.indexOf(to.path) == -1 && to.path != '/home' && to.path != '/login'){
    router.push('/home');
    console.log(111);
    return;
  }


  localStorage.setItem('cur_path', to.path)
  store.commit('SET_CUR_PATH', to.path)
  next(() => {
    console.log(123123123);
  });
})


export default router;
