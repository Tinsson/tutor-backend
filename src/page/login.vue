<template>
  <div id="login" class="login">
    <div class="center-area">
      <h1 class="head-text">小程序（家教汪）后台</h1>
      <div class="input-box">
        <h2 class="tips">登陆</h2>
        <Input v-model="username"
               @on-enter="signIn"
               icon="person"
               placeholder="请输入账号"
               size="large"
               class="ipt"/>
        <Input v-model="password"
               @on-enter="signIn"
               icon="locked"
               type="password"
               placeholder="请输入密码"
               size="large"
               class="ipt"/>
        <div class="other">
          <Checkbox v-model="remember">记住密码</Checkbox>
        </div>
        <Button
          type="primary"
          size="large"
          @click="signIn"
          long>{{btnInfo}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
  // import { saveLocal,getLocal } from '@/util/util'
  // import router from '@/router'

  export default {
    name: 'Login',
    data () {
      return {
        msg: 'login',
        username: '',
        password: '',
        remember: true,
        btnInfo: '登录'
      }
    },
    methods:{
      signIn(){
          if(this.validateInfo()){
            return false;
          }
          const data = {
              admin_name: this.username,
              admin_password: this.password
          };
          this.btnInfo = '登录中...';
          this.axios.post('login-in', data).then(d=>{
            if(d === ''){
              this.btnInfo = '登录';
            }else{
              let referrer = document.referrer;
              console.log(referrer);
              if(/localhost/.test(referrer)){
                localStorage.setItem('is_auth', '1');
              }
              localStorage.setItem('menu', JSON.stringify(d.data.menu));
              localStorage.setItem('admin_name', this.username);
              //localStorage.setItem('admin_role', d.data.role);
              localStorage.setItem('token', d.data.token);
              this.$router.push('/home')
            }
            //console.log(d);
          })
          // setTimeout(()=>{
          //   sessionStorage.setItem('user_id','123123123')
          //   this.$router.push('/home')
          // },1000)
      },
      setFirstView(){
          // this.$post('Menuauth/listLeftAuthGet').then((d)=>{
          //     if(d.status === 1){
          //         const firstview = d.data[0].data[0].http;
          //         this.$store.commit('SET_FIRST_VIEW',firstview);
          //         this.$store.commit('SET_PATH', firstview);
          //         router.push({
          //           path: firstview
          //         })
          //     }
          // })
      },
      validateInfo(){
        if(this.username === ""){
          this.$Message.error("账号不能为空！");
          return true;
        }else if(this.password === ""){
          this.$Message.error("密码不能为空！");
          return true;
        }else{
          return false;
        }
      },
      test(){
        console.log(33333);
      }
    }
  }
</script>


<style lang="scss" scoped>
  .login{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #222729;
    //background: url('/static/images/sign_bg.jpg') no-repeat center;
    //background-size: 100% 100%;
    .center-area{
      position:absolute;
      top: 15%;
      left: 50%;
      width: 360px;
      margin-left: -180px;
      .head-text{
        color: #FFF;
        text-align: center;
        font-size: 32px;
        padding-bottom: 25px;
      }
      .input-box{
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        background: #FFF;
        .tips{
          text-align: center;
          font-size: 16px;
          padding: 0 0 15px;
        }
        .ipt{
          padding-bottom: 10px;
        }
        .other{
          padding-bottom: 10px;

        }
      }
    }
  }
</style>
