<template>
<div id="role">
  <title-bar title="角色列表" @refresh="refresh"></title-bar>
  <table-container>
    <div slot="btn">
      <Button type="primary" @click="role_show=true">添加角色</Button>
    </div>
    <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
  </table-container>
  <Modal v-model="authority_show" title="权限分配" width="800" @on-visible-change="modalChange">
    <div v-if="authority_list.length!=0">
      <div class="authority-group" v-for="(item,pindex) in authority_list">
        <div class="node-title">
          <Checkbox :indeterminate="check_authority_list[pindex].indeterminate" :value="check_authority_list[pindex].checkAll" size="large" @click.prevent.native="handleCheckAll(pindex)">{{item.display_name}}</Checkbox>
        </div>
        <CheckboxGroup v-model="check_authority_list[pindex].children" @on-change="checkChange">
          <div class="node-list">
            <div class="node-item" v-for="(child,index) in item.children" @click="setPindex(pindex)">
              <Checkbox :label="child.id">{{child.display_name}}</Checkbox>
            </div>
          </div>
        </CheckboxGroup>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" @click="authority_submit">确定</Button>
    </div>
  </Modal>
  <Modal v-model="role_show" title="角色添加" @on-visible-change="roleModalChange">
    <Form ref="form" :model="form" :rules="rules" :label-width="90">
      <FormItem label="角色Key" prop="name">
        <Input v-model="form.name"></Input>
      </FormItem>
      <FormItem label="角色显示名" prop="display_name">
        <Input v-model="form.display_name"></Input>
      </FormItem>
      <FormItem label="角色描述">
        <Input v-model="form.description"></Input>
      </FormItem>
      <FormItem label="是否启用" prop="status">
        <RadioGroup v-model="form.status">
          <Radio label="1">启用</Radio>
          <Radio label="0">禁用</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="role_submit">确定</Button>
    </div>
  </Modal>
</div>
</template>
<script>
export default {
  name: "role",
  data() {
    return {
      role_show: false,
      form: {
        name: '',
        display_name: '',
        status: 1,
        id:'',
        description:''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入角色名'
        }],
        display_name: [{
          required: true,
          message: '请输入角色显示名'
        }],
        status: [{
          required: true,
          message: '请选择是否启用'
        }]
      },

      authority_show: false,
      authority_list: [],
      check_authority_list: [],
      checked_list: [],
      pindex: 0,
      role_id: '',

      columns: [{
        title: '角色编号',
        key: 'id',
        align: 'center'
      },{
        title: '角色Key',
        key:'name',
        align:'center'
      }, {
        title: '角色名称',
        key: 'display_name',
        align: 'center'
      },{
        title: '角色描述',
        key:'description',
        align:'center'
      }, {
        title: '状态',
        key: 'status',
        align: 'center',
        render: (h, params) => {
          return h('span', params.row.status == 1 ? '已启用' : '已禁用')
        }
      }, {
        title: '创建时间',
        key: 'create_at',
        align: 'center'
      }, {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 230,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  for(let key in this.form) {
                    this.form[key] = params.row[key]
                  }
                  this.role_show = true;
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  this.authority_show = true;
                  this.role_id = params.row.id;
                  this.getAuthority(params.row.id)
                }
              }
            }, '权限分配'),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  this.del(params.row.id);
                }
              }
            }, '删除')
          ])
        }
      }],
      myData: [],
      tableLoading: false,
    }
  },
  methods: {
    role_submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.axios.post(this.form.id?'role-edit':'role-add',this.form).then(res=>{
            if(res){
              this.role_show = false;
              this.getData();
            }
          })
        }
      })
    },
    authority_submit() {
      let arr = [];
      for (let i = 0; i < this.check_authority_list.length; i++) {
        if (this.check_authority_list[i].indeterminate || this.check_authority_list[i].checkAll) {
          arr.push(this.check_authority_list[i].pid);
        }
        arr = arr.concat(this.check_authority_list[i].children);
      }

      this.axios.post('auth-role-add', {
        permission_id: arr.join(','),
        id: this.role_id
      }).then(res => {
        if (res) {
          this.$Message.success('修改成功');
          this.authority_show = false;
        }
      })
    },
    del(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该角色吗</p>',
        onOk: ()=>{
          this.axios.post('role-del', {
            id: id
          }).then(res => {
            if (res) {
              this.$Message.success('删除成功');
              this.getData();
            }
          })
        }
      });
    },

    modalChange(show) {
      if (!show) {
        for (let i = 0; i < this.check_authority_list.length; i++) {
          this.check_authority_list[i].children = [];
          this.check_authority_list[i].indeterminate = false;
          this.check_authority_list[i].checkAll = false;
        }
      }
    },
    roleModalChange(show) {
      if(!show) {
        this.$refs['form'].resetFields();
        for(let key in this.form) {
          this.form[key] = '';
        }
      }
    },

    handleCheckAll(pindex) {
      if (this.check_authority_list[pindex].indeterminate) {
        this.check_authority_list[pindex].checkAll = false;
      } else {
        this.check_authority_list[pindex].checkAll = !this.check_authority_list[pindex].checkAll;
      }
      this.check_authority_list[pindex].indeterminate = false;

      this.check_authority_list[pindex].children = [];
      if (this.check_authority_list[pindex].checkAll) {
        for (let i = 0; i < this.authority_list[pindex].children.length; i++) {
          this.check_authority_list[pindex].children.push(this.authority_list[pindex].children[i].id);
        }
      }
    },
    setPindex(pindex) {
      this.pindex = pindex
    },

    refresh() {
      this.getData()
    },
    getData() {
      this.axios.get(`role-list`).then(res => {
        if (res) {
          this.myData = res.data.list
        }
      })
    },
    getAuthority(id) {
      this.checked_list = [];
      this.axios.get(`role-html?id=${id}`).then(res => {
        this.checked_list = res.data.list;
        for (let i = 0; i < this.authority_list.length; i++) {
          for (let k = 0; k < this.authority_list[i].children.length; k++) {
            if (this.checked_list.indexOf(this.authority_list[i].children[k].id) !== -1) {
              this.check_authority_list[i].children.push(this.authority_list[i].children[k].id);
              this.check_authority_list[i].indeterminate = true;
            }
          }
          if (this.check_authority_list[i].children.length == this.authority_list[i].children.length) {
            this.check_authority_list[i].indeterminate = false;
            this.check_authority_list[i].checkAll = true;
          }
        }
      })
    },
    getAuthorityList() {
      this.axios.get('auth-role-all').then(res => {

        this.authority_list = res.data.list;
        this.check_authority_list = [];
        for (let i = 0; i < this.authority_list.length; i++) {
          this.$set(this.check_authority_list, i, {
            children: [],
            indeterminate: false,
            checkAll: false,
            pid: this.authority_list[i].id
          });
        }
      })
    },
    checkChange(data) {
      this.check_authority_list[this.pindex].children = data;
      if (data.length == this.authority_list[this.pindex].children.length) {
        this.check_authority_list[this.pindex].indeterminate = false
        this.check_authority_list[this.pindex].checkAll = true
      } else if (data.length > 0) {
        this.check_authority_list[this.pindex].indeterminate = true
        this.check_authority_list[this.pindex].checkAll = false
      } else {
        this.check_authority_list[this.pindex].indeterminate = false
        this.check_authority_list[this.pindex].checkAll = false
      }
    }
  },
  mounted() {
    this.getData();
    this.getAuthorityList();
  }
}
</script>
<style lang="scss" scoped>
.node-title {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
}
.node-list {
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    .node-item {
        padding: 5px 0;
    }
}
</style>
