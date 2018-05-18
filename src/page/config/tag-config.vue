<template>
  <div class="tags">
    <title-bar title="标签配置"/>
    <table-container title="通用标签">
      <div slot="btn">
        <Button type="info" @click="addTags(0)">新增标签</Button>
      </div>
      <Table :columns="columns" :data="myData0" border></Table>
    </table-container>
    <table-container title="家长专属标签">
      <div slot="btn">
        <Button type="info" @click="addTags(1)">新增标签</Button>
      </div>
      <Table :columns="columns" :data="myData1" border></Table>
    </table-container>
    <table-container title="家教专属标签">
      <div slot="btn">
        <Button type="info" @click="addTags(2)">新增标签</Button>
      </div>
      <Table :columns="columns" :data="myData2" border></Table>
    </table-container>
    <tagModal ref="tag_modal" @refresh="editOver"></tagModal>
  </div>
</template>

<script>
  import tagModal from './components/tag-modal'

  export default {
    name: "tag-config",
    components: {
      tagModal
    },
    data(){
      return{
        columns: [{
          title: '序号',
          key: 'id',
          align: 'center'
        },{
          title: '标签名',
          key: 'name',
          align: 'center'
        },{
          title: '创建时间',
          key: 'create_at',
          align: 'center'
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params)=>{
            return h('div', [
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.delTags(params.row);
                  }
                }
              }, '删除')
            ]);
          }
        }],
        myData0: [],
        myData1: [],
        myData2: []
      }
    },
    created(){
      this.initData();
    },
    methods: {
      initData(){
        this.reqData(0);
        this.reqData(1);
        this.reqData(2);
      },
      editOver(type){
        this.reqData(type);
      },
      reqData(type){
        this.axios.get('tag-list',{
          params:{
            type
          }
        }).then(d=>{
          this['myData'+type] = d.data.list;
        })
      },
      addTags(type){
        let data = {
          type,
          is_edit: false
        }
        this.$refs['tag_modal'].show(data);
      },
      delTags(row){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认删除此便签吗？</p>',
          onOk: ()=>{
            this.axios.post('del-tag',{
              id: row.id
            }).then(d=>{
              this.$Message.success(d.message);
              this.reqData(row.type);
            });
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
