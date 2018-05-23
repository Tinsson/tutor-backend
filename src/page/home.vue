<template>
<div id="home">
  <div class="home-content">
    <my-menu></my-menu>
    <div class="layout-header">
      <p class="login-out" @click="LogOut">
        <Icon type="power"></Icon>
        退出登录
      </p>
    </div>
    <div class="my-body">
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import myMenu from '@/components/menu'
export default {
  name: "",
  data: () => ({

  }),
  methods: {
    Login() {
      this.$router.push('/login')
    },
    LogOut(){
      /*this.axios.post('log-out').then(d=>{

      })*/
      localStorage.clear();
      this.$router.push('/login')
    }
  },
  components: {
    myMenu
  }
}
</script>
<style lang="scss" scoped>
#home {
    min-width: 1000px;
}
.home-content {
    background: #f8f8f8;
    .layout-header {
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        .login-out {
            width: 120px;
            height: 60px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            line-height: 60px;
            float: right;
            &:hover {
                color: #FFF;
                background: #333;
            }
        }
    }
    &:after {
        content: '';
        display: block;
        clear: both;
    }
    .my-body {
        padding: 15px;
        margin-left: 240px;
        >div{
          background: #fff;
          padding:10px;
        }
    }
}
</style>
