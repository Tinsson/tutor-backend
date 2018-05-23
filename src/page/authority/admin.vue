<template>
  <div id="base-template">
    <title-bar title="账户列表" @refresh="refresh"></title-bar>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
      <div slot="btn">
        <Button type="primary" @click="user_modal=true">添加账号</Button>
      </div>
      <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>

    <Modal v-model="user_modal" title="添加用户" @on-visible-change="userModalChange">
      <div class="">
        <Form ref="user_form" :model="user_form" :rules="user_rules" :label-width="120">
          <FormItem label="用户名" prop="admin_name">
            <Input v-model="user_form.admin_name" :disabled="user_form.admin_id!=''" />
          </FormItem>
          <FormItem label="用户密码" prop="admin_password" v-if="!user_form.admin_id">
            <Input v-model="user_form.admin_password" />
          </FormItem>
          <FormItem label="手机号码" prop="admin_mobile">
            <Input v-model="user_form.admin_mobile" />
          </FormItem>
          <FormItem label="是否超级管理员" prop="is_super">
            <RadioGroup v-model="user_form.is_super">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="user_form.remark" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <!-- <Button>取消</Button> -->
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="role_modal" title="分配角色">
      <div class="">
        <Form ref="role_form" :model="role_form" :label-width="80">
          <FormItem label="选择角色">
            <CheckboxGroup v-model="role_form.role_id">
                <Checkbox v-for="item in role_list" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <!-- <Button>取消</Button> -->
        <Button type="primary" @click="role_submit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "base-template",
  data() {
    return {
      user_modal: false,
      user_form: {
        admin_name:'',
        admin_password: '',
        admin_mobile:'',
        is_super: '0',
        remark: '',
        admin_id:'',
      },
      user_rules: {
        admin_name: [{required:true,message:'请输入用户名'}],
        admin_password: [{required:true,message: '请输入用户密码'}]
      },

      role_list: [],
      role_modal: false,
      role_form: {
        id:'',
        role_id:[]
      },


      columns: [
        {
          title: '账号id',
          key: 'admin_id',
          align: 'center'
        },{
          title: '账号名',
          key: 'admin_name',
          align: 'center'
        }, {
          title: '手机号码',
          key: 'admin_mobile',
          align: 'center'
        }, {
          title: '登录ip',
          key: 'login_ip',
          align: 'center'
        }, {
          title: '备注',
          key: 'remark',
          align: 'center'
        },{
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h,params)=>{
            return h('span',params.row.status==1?'正常':'禁用')
          }
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          width:230,
          render: (h, params) => {
            /*if(params.row.is_super == 1){
              return h('span', '超级管理员，无法操作')
            }*/
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.user_modal = true;
                    for(let key in this.user_form) {
                      this.user_form[key] = params.row[key];
                    }
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: ()=>{
                    this.role_modal = true;
                    this.role_form.id = params.row.admin_id
                    this.role_form.role_id = params.row.adminRole
                  }
                }
              }, '分配角色'),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: ()=>{
                    this.switch(params.row)
                  }
                }
              }, params.row.status==1?'禁用':'恢复'),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: ()=>{
                    this.DelOpt(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      myData: [],
      tableLoading: false,
      pageprops: { //分页配置
        showSizer:true,
        total:0,
      },
      fy: { //当前分页属性
        page: 1,
        size: 10
      },
    }
  },
  computed: {
  },
  methods: {
    role_submit() {
      this.axios.post('admin-role-add',{
        admin_id:this.role_form.id,
        role_id:this.role_form.role_id.join(',')
      }).then(res=>{
        if(res){
          this.role_modal = false;
          this.getData();
          this.$Message.success('操作成功');
        }
      })
    },
    submit() {
      this.axios.post(this.user_form.admin_id?'admin-edit':'admin-add',this.user_form).then(res=>{
        if(res){
          this.user_modal = false;
          this.getData();
          this.$Message.success('操作成功');
        }
      })
    },
    DelOpt(row){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该账号吗？</p>',
        onOk: ()=>{
          this.axios.post('admin-del',{
            admin_id: row.admin_id
          }).then(res=>{
            if(res){
              this.getData();
              this.$Message.success('删除成功');
            }
          })
        }
      })
    },
    switch(user) {
      this.axios.post('admin-status',{
        admin_id:user.admin_id,
        status:user.status == 1?2:1
      }).then(res=>{
        if(res){
          this.getData();
          this.$Message.success('操作成功');
        }
      })

    },
    userModalChange(show) {
      if(!show) {
        this.$refs['user_form'].resetFields();
        for(let key in this.user_form) {
          this.user_form[key] = '';
        }
      }
    },
    getRole() {
      this.axios.get('admin-role-all').then(res=>{
        if(res){
          this.role_list = res.data.list
        }
      })
    },
    refresh() {
      this.getData();
    },
    pageChange(page) {
      this.fy.page = page;
      this.getData();
    },
    pageSizeChange(size) {
      this.fy.page = 1;
      this.fy.size = size;
      this.getData();
    },
    getData() {
      this.axios.get('admin-list').then(res=>{
        if(res){
          this.myData = res.data.list
        }
      })
    },
  },
  mounted() {
    this.getData();
    this.getRole();
  }
}
</script>
<style lang="scss" scoped>
</style>
