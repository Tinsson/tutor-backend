<template>
<div id="my-menu">
  <Menu theme="dark" @on-select="goRoute" accordion :active-name="cur_path" :open-names="cur_open">
    <div class="layout-logo-left">
      <img class="logo" src="../assets/images/logo.png" alt=""> 小程序后台管理
    </div>
    <div class="user-panel">
      <div class="pull-left">
        <p class="text">Tinsson</p>
        <p class="state"><i class="icon-state"></i>online</p>
      </div>
    </div>
    <Submenu v-for="(group,pindex) in arr" :name="group.path" :key="pindex">
      <template slot="title">
          <Icon type="ios-paper"></Icon>
          {{group.name}}
      </template>
      <MenuItem v-for="(item,index) in group.children" :name="group.path+item.path" :key="index">{{item.name}}</MenuItem>
    </Submenu>
  </Menu>
</div>
</template>
<script>
export default {
  name: "my-menu",
  data: () => ({
    arr: [{
      id: '1',
      name: '用户管理',
      path: '/user',
      children: [{
        id: '2',
        name: '家长列表',
        path: '/parent-list'
      },{
        id: '3',
        name: '家教列表',
        path: '/tutor-list'
      }]
    },{
      id: '3',
      name: '审核管理',
      path: '/verify',
      children: [{
        id: '4',
        name: '家长审核列表',
        path: '/parent-list'
      },{
        id:'11',
        name: '家教审核列表',
        path:'/tutor-list'
      }]
    },{
      id:'20',
      name:'管理配置',
      path:'/config',
      children:[{
        id:'23',
        name:'基本配置',
        path:'/base-config'
      }]
    },{
      id: '12',
      name: '交易记录',
      path: '/trade',
      children: [{
        id: '13',
        name: '认证支付流水',
        path: '/audit-list'
      },{
        id: '14',
        name: '认证退款流水',
        path: '/ref-list'
      },{
        id: '15',
        name: '购买联系方式流水',
        path: '/buy-list'
      }]
    },{
      id: '9',
      name: '投诉管理',
      path: '/complain',
      children: [{
        id: '10',
        name: '投诉列表',
        path: '/complain'
      }]
    }]
  }),
  computed: {
    cur_path() {
      return this.$store.state.common.cur_path
    },
    cur_open() {
      return ['/'+this.$store.state.common.cur_path.split('/')[1]]
    }
  },
  methods: {
    goRoute(path) {
      this.$router.push(path);
    }
  }
}
</script>
<style lang="scss" scoped>
#my-menu {
    background-color: #373e4f;
    position:fixed;
    top:0;
    left:0;
    height: 100vh;
    overflow: auto;
}

.layout-logo-left {
    width: 90%;
    font-size: 18px;
    color: #FFF;
    text-align: center;
    border-radius: 3px;
    height:60px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
        width: 35px;
        height: 35px;
        margin-right: 5px;
    }
}
/*右边用户信息*/
.user-panel {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px;
    overflow: hidden;
    background-color: #283238;
    justify-content: center;
    .pull-left {
        padding-right: 10%;
        color: #FFF;
        &.hand {
            cursor: pointer;
        }
        .avator {
            width: 45px;
            object-fit: cover;
            border-radius: 50%;
            margin-right: 3px;
        }
        .text {
            font-size: 16px;
        }
        .state {
            font-size: 14px;
            .icon-state {
                width: 12px;
                height: 12px;
                margin-right: 5px;
                vertical-align: middle;
                border-radius: 50%;
                display: inline-block;
                background-color: #3c763d;
            }
        }
    }
}
</style>
