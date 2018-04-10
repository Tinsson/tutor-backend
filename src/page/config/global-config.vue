<template>
  <div id="task-newcomer">
    <title-bar title="全局配置" @refresh="refresh"></title-bar>
    <table-container>
      <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
    <Modal v-model="edit_show" title="修改配置">
      <Form ref="edit_form" :model="edit_form" :rules="edit_rules" :label-width="80">
        <FormItem label="标题" prop="title">
            <Input v-model="edit_form.title"></Input>
        </FormItem>
        <FormItem label="文字描述" prop="tag">
            <Input v-model="edit_form.tag"></Input>
        </FormItem>
        <FormItem label="数值" prop="value">
            <InputNumber :min="0" v-model="edit_form.value"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {copyObj} from '@/utils/common'
export default {
  name: "task-newcomer",
  data() {
    function checkTag (rule,value,callback) {
      if(value.indexOf('{<>}')==-1){
        callback(new Error('请使用{<>}代替数值将要插入的地方'))
      }else{
        callback();
      }
    }
    return {
      edit_item: {},
      edit_show: false,
      edit_form: {
        title: '',
        tag: '',
        value: null
      },
      edit_rules: {
        title: [
          {required: true,message: '请输入配置标题'}
        ],
        tag: [
          {validator: checkTag}
        ],
        value: [
          {required: true,message: '请输入数值'}
        ]
      },

      columns: [
        {
          title: '配置项',
          key: 'title',
          align: 'center'
        },{
          title: '数值',
          key: 'num',
          align: 'center',
          render: (h,params)=>{
            return h('span',params.row.tag.replace('{<>}',params.row.value))
          }
        },{
          title: '操作',
          align:'center',
          render: (h,params)=>{
            return h('Button',{
              props:{
                type: 'text'
              },
              on: {
                click: ()=>{
                  this.edit_form = copyObj(params.row);
                  this.edit_show = true
                }
              }
            },'编辑')
          }
        }
      ],
      myData: [],
      tableLoading: false,
    }
  },
  methods: {
    submit() {
      this.$refs.edit_form.validate((valid)=>{
        if(valid) {
          this.axios.post('system-edit-config',{
            key: this.edit_form.key,
            title: this.edit_form.title,
            tag: this.edit_form.tag,
            value: this.edit_form.value
          }).then(res=>{
            if(res){
              this.edit_show = false;
              this.getData();
            }
          })
        }
      })
    },

    add_task() {
      this.$refs.add_task.show();
    },

    refresh() {
      this.getData();
    },
    getData() {
      this.tableLoading = true
      this.axios.get('system-config-list').then(res=>{
        this.tableLoading = false
        if(res){
          this.myData = res.data['config-list']
        }
      })
    },
  },
  mounted() {
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
