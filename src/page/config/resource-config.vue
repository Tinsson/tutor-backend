<template>
  <div id="resource">
    <title-bar title="渠道配置"/>

    <table-container>
      <div slot="btn">
        <Button type="info" @click="addResource">新增渠道</Button>
      </div>
      <Table :columns="columns" :data="myData" border></Table>
    </table-container>

    <resourceModal ref="infoModal" @close="initData"></resourceModal>
    <big-pic ref="bigPic" :maxWidth="400"></big-pic>
  </div>
</template>

<script>
    import resourceModal from './components/resource-modal'
    export default {
      name: "resource-config",
      components: {
        resourceModal
      },
      data(){
        return{
          columns: [{
            title: '渠道id',
            key: 'id',
            align: 'center'
          },{
            title: '渠道名',
            key: 'name',
            align: 'center'
          },{
            title: '类型',
            key: 'direction',
            align: 'center',
            render: (h, params)=>{
              let txt = '',
                  dir = params.row.direction;
              switch (dir){
                case 1:
                  txt = '线上';
                  break;
                case 2:
                  txt = '线下';
                  break;
              }
              return h('span', txt);
            }
          },{
            title: '面向群体',
            key: 'role',
            align: 'center',
            render: (h, params)=>{
              let txt = '',
                dir = params.row.role;
              switch (dir){
                case 1:
                  txt = '家长';
                  break;
                case 2:
                  txt = '家教';
                  break;
              }
              return h('span', txt);
            }
          },{
            title: '推广二维码',
            key: 'qrcode',
            align: 'center',
            render: (h, params)=>{
              return h('span',{
                style: {
                  cursor: 'pointer',
                  color: '#2db7f5',
                },
                on: {
                  click: ()=>{
                    this.$refs['bigPic'].show(params.row.qrcode);
                  }
                }
              }, '查看')
            }
          },{
            title: '创建时间',
            key: 'addtime',
            width: '100',
            align: 'center'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (h, params)=>{
              return h('div',[h('Button',{
                props: {
                  type: 'primary'
                },
                style: {
                  'marginRight': '5px'
                },
                on: {
                  click: () => {
                    this.$refs['infoModal'].show(params.row);
                  }
                }
              }, '编辑')])
            }
          }],
          myData: [],

        }
      },
      created(){
        this.initData();
      },
      methods: {
        initData(){
          this.axios.get('get-resource-list').then(d=>{
            this.myData = d.data.list;
          })
        },
        addResource(){
          this.$refs['infoModal'].show();
        }
      }
    }
</script>

<style scoped>

</style>
