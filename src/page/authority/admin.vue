<template>
  <div id="base-template">
    <title-bar title="账户列表" @refresh="refresh"></title-bar>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
      <div slot="btn">
        <Button type="primary" @click="user_modal=true">添加账号</Button>
      </div>
      <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>

    <Modal v-model="user_modal" title="账户信息" @on-visible-change="userModalChange">
      <div class="">
        <Form ref="user_form1" :model="user_form" :rules="user_rules" :label-width="120">
          <FormItem label="用户名">
            <Input v-model="user_form.admin_name" :disabled="user_form.admin_id!=''" />
          </FormItem>
          <FormItem label="用户密码" v-if="!user_form.admin_id">
            <Input v-model="user_form.admin_password" />
          </FormItem>
          <FormItem label="手机号码">
            <Input v-model="user_form.admin_mobile" />
          </FormItem>
          <FormItem label="是否超级管理员" prop="is_super">
            <RadioGroup v-model="user_form.is_super">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="省/直辖市：" v-if="user_form.is_super === 0">
            <div class="city-box">
              <div>
                <Tag v-for="(item, index) in provinceTags" type="dot" :key="index" :name="item.name" :color="item.color" closable @on-close="rmProvince">{{item.name}}</Tag>
              </div>
              <Select style="width: 80px" v-model="provinceSelect" @on-change="getProvince">
                <Option v-for="item in cityData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <p>若小标点为红色表示包括全部省/直辖市</p>
          </FormItem>
          <FormItem label="城市：" v-if="provinceTags.length > 0 && user_form.is_super === 0">
            <div class="city-box">
              <div>
                <Tag v-for="(item, index) in cityVal" :key="index" :name="item" color="green" closable @on-close="rmCity">{{item}}</Tag>
              </div>
              <Cascader style="width: 120px" :data="cityArr" v-model="cityChoseArr" @on-change="getCity">
                <Button icon="ios-plus-empty" type="dashed" size="small">添加城市</Button>
              </Cascader>
            </div>
          </FormItem>
          <FormItem label="备注">
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
      cityVal: [],
      cityData: [],
      cityChoseArr: [],
      province: [],
      provinceTags: [],
      provinceSelect: '',
      user_modal: false,
      cityData: [],
      user_form: {
        admin_name:'',
        admin_password: '',
        admin_mobile:'',
        is_super: 0,
        remark: '',
        admin_id:''
      },
      user_rules: {
        admin_name: [{required:true,message:'请输入用户名'}],
        admin_password: [{required:true,message: '请输入用户密码'}],
        admin_mobile: [{required:true,message: '请输入'}],
        is_super: [{required:true,message: '请选择是否管理员'}],
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
                    let row = params.row;
                    this.user_modal = true;
                    for(let key in this.user_form) {
                      this.user_form[key] = row[key];
                    }

                    if(row.province !== ''){
                      this.provinceTags = [];
                      this.province = [];
                      row.province.split(',').forEach(val=>{
                        this.provinceTags.push({
                          color: 'red',
                          name: val
                        });
                        this.province.push(val);
                      })
                    }

                    if(row.city !== ''){
                      this.cityVal = [];
                      row.city.split(',').forEach(val=>{
                        this.cityData.forEach(pVal=>{
                          pVal.children.forEach(cVal=>{
                            if(val == cVal.value){
                              this.cityVal.push(`${pVal.value}/${val}`);
                              if(this.province.indexOf(pVal.value) == -1){
                                this.province.push(pVal.value);
                                this.provinceTags.push({
                                  color: 'blue',
                                  name: pVal.value
                                })
                              }
                            }
                          })
                        })
                      })
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
    cityArr(){
      let newArr = [];
      this.cityData.forEach(val=>{
        if(this.province.indexOf(val.value) > -1){
          newArr.push(val);
        }
      });
      return newArr;
    }
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
      let params = this.$copyObj(this.user_form);
      let p_arr = [],
        c_arr = [];
      this.provinceTags.forEach(val=>{
        if(val.color == 'red'){
          p_arr.push(val.name)
        }
      });
      this.cityVal.forEach(val=>{
        c_arr.push(val.split('/')[1]);
      });
      if(params.is_super == 0){
        params.province = p_arr.join(',');
        params.city = c_arr.join(',');
      }


      this.axios.post(this.user_form.admin_id?'admin-edit':'admin-add',params).then(res=>{
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
        //this.$refs['user_form1'].resetFields();
        for(let key in this.user_form) {
          this.user_form[key] = '';
        }
        this.cityChoseArr = [];
        this.cityVal = [];
        this.province = [];
        this.provinceTags = [];
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
    getCityData(){
      this.axios.get('city-list').then(d=>{
        this.cityData = d.data.list;
      })
    },

    getProvince(val){
      if(val == ""){
        return;
      }
      this.provinceTags.push({
        color: 'red',
        name: val
      });
      this.province.push(val);

    },

    rmProvince(e, name){
      let tagIndex = '';
      this.provinceTags.forEach((val, index)=>{
        if(val.name == name){
          tagIndex = index
        }
      });
      const index = this.province.indexOf(name);
      this.province.splice(index, 1);
      this.provinceTags.splice(tagIndex, 1);
    },

    getCity(val){
      if(this.cityVal.indexOf(val.join('/')) > -1){
        return;
      }
      this.provinceTags.map((vval, index)=>{
        if(vval.name == val[0]){
          vval.color = 'blue'
        }
        return vval;
      });
      this.cityVal.push(val.join('/'));
      this.cityChoseArr = [];
    },

    rmCity(e, name){
      const index = this.cityVal.indexOf(name);
      this.cityVal.splice(index, 1);
      let province = name.split('/')[0],
        p_status = true;
      this.cityVal.forEach(val=>{
        if(val.indexOf(province) > -1){
          p_status = false
        }
      });
      if(p_status){
        this.provinceTags.map((val, index)=>{
          if(val.name == province){
            val.color = 'red'
          }
          return val;
        });
      }
    }
  },
  mounted() {
    this.getCityData();
    this.getData();
    this.getRole();
  }
}
</script>
<style lang="scss" scoped>
  .city-box{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
