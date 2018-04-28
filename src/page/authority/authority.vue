<template>
  <div id="authority">
    <title-bar title="权限列表" @refresh="refresh"></title-bar>
    <table-container>
      <Tree :data="myData" :render="renderTree"></Tree>
    </table-container>

    <!-- 群发站内信模态框 -->
    <Modal v-model="modal_show" title="添加/修改子节点" @on-visible-change="changeModal">
      <div class="">
        <Form ref="form" :model="form" :rules="rules" :label-width="80">
          <FormItem label="节点名称" prop="display_name">
            <Input v-model="form.display_name"></Input>
          </FormItem>
          <FormItem label="节点key" prop="name">
            <Input v-model="form.name"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button>取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "authority",
  data: () => ({
    test_index:0,
    form: {
      display_name: '',
      name: '',
      pid: '',
      id: '',
    },
    rules: {
      display_name: [
        {
          required: true,
          message: '请填写节点名称',
          trigger: 'blur'
        }
      ],
      name: [
        {
          required: true,
          message: '请填写节点key',
          trigger: 'blur'
        }
      ]
    },
    myData: [],

    modal_show: false
  }),
  methods: {
    changeModal(show){
      if(!show) {
        this.form = {
          name: '',
          pid: '',
          display_name:'',
          id:''
        }
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.axios.post(this.form.id?'permission-edit':'permission-add',this.form).then(res=>{
            if(res){
              this.modal_show = false;
              this.getData();
              this.$Message.success('操作成功');
            }
          })
        }
      })
    },
    refresh() {
      this.$refs.playgroud.show([123,123,123])
    },
    getData() {
      this.axios.get('permission-list').then(res=>{
        if(res){
          // console.log(res);
          this.myData = res.data.permission
          this.$set(this.myData[0],'expand',true)
        }
      })
    },
    renderTree(h,{root,node,data}) {
      return h('div',{
        style: {
          display:'inline-block',
        }
      },[
          h('span',{
            style:{
              fontSize:'15px',
              marginLeft:'5px'
            }
          },data.display_name),
          (data.level != 3&& h('Button',{
            props:{
              type:'primary',
              size:'small'
            },
            style: {
              marginLeft:'30px'
            },
            on: {
              click: ()=>{
                this.modal_show = true;
                this.form.pid = data.id;
              }
            }
          },'添加')),
          h('Button',{
            props: {
              type:'info',
              size:'small'
            },
            style: {
              marginLeft: data.level!=3?'10px':'30px'
            },
            on: {
              click: ()=>{
                this.modal_show = true;
                // this.form.pid = data.pid;
                // this.form.id = data.id;
                for(let key in this.form){
                  this.form[key] = data[key];
                }
              }
            }
          },'编辑')
      ])
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
</style>
