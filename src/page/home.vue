<template>
<div id="home">
  <div class="home-content">
    <my-menu></my-menu>
    <div class="layout-header">
      <Dropdown style="float: right" @on-click="handleDrop">
        <div class="down-box">
          <img class="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" alt="">
          <span>{{admin_name}}</span>
        </div>
        <DropdownMenu slot="list">
          <DropdownItem name="1">
            <Icon type="person"></Icon>
            <span>修改密码</span>
          </DropdownItem>
          <DropdownItem name="2" divided>
            <Icon type="power"></Icon>
            <span>退出登陆</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="my-body">
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
  <Modal v-model="pwd_modal" title="修改密码" @on-visible-change="hidePwd">
    <Form ref="pwd_form" :model="pwd_form" :rules="pwd_rules" :label-width="120">
      <FormItem label="老密码：" prop="admin_password">
        <Input type="password" v-model="pwd_form.admin_password" />
      </FormItem>
      <FormItem label="新密码：" prop="new_password">
        <Input type="password" v-model="pwd_form.new_password" />
      </FormItem>
      <FormItem label="新密码确认：" prop="new_password_confirm">
        <Input type="password" v-model="pwd_form.new_password_confirm" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="submit">提交</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import myMenu from '@/components/menu'
export default {
  name: "",
  data: () => ({
    admin_name: '',
    pwd_modal: false,
    pwd_form: {
      admin_password: '',
      new_password: '',
      new_password_confirm: ''
    },
    pwd_rules: {
      admin_password: [{required:true,message:'请输入老密码'}],
      new_password: [{required:true,message: '请输入新密码'}],
      new_password_confirm: [{required:true,message: '请再次输入新密码'}]
    }
  }),
  methods: {
    Login() {
      this.$router.push('/login')
    },
    LogOut(){
      this.axios.post('log-out').then(d=>{

        localStorage.clear();
        this.$router.push('/login')
      })
    },
    updatePwd(){
      this.pwd_modal = true;
    },
    hidePwd(type){
      if(!type){
        this.$refs['pwd_form'].resetFields();
        for(let i in this.pwd_form){
          this.pwd_form[i] = '';
        }
      }
    },
    submit(){
      this.$refs['pwd_form'].validate(valid=>{
        if(valid){
          this.axios.post('update-pwd', this.pwd_form).then(d=>{
            if(d){
              this.pwd_modal = false;
              this.$Message.success('密码更新成功');
            }
          });
        }
      })
    },
    handleDrop(name){
      if(name == 1){
        this.updatePwd();
      }else if(name == 2){
        this.LogOut();
      }
    }
  },
  created(){
    this.admin_name = localStorage.getItem('admin_name');
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
      .down-box{
        width: 150px;
        height: 60px;
        cursor: pointer;
        font-size: 16px;
        text-align: center;
        line-height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        &:hover{
          background-color: #d5eeff;
        }
        .avatar{
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
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
