<template>
  <div id="income-detail">
    <title-bar title="咨询列表" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
    <user-detail ref="userDetail" @save-over="getData"></user-detail>
  </div>
</template>
<script>
  import userDetail from '../user/components/user-detail-new.vue'

export default {
  name: "consult",
  components: {
    userDetail
  },
  data() {
    return {
      all_price: '',
      img_src: '',
      columns: [
        {
          title: '操作角色',
          key: 'role',
          align: 'center',
          render: (h, params)=>{
            let txt = '';
            switch (params.row.role){
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
          title: '操作人手机/昵称',
          key: 'phone',
          align: 'center',
          render: (h, params)=>{
            return h('span',{
              style: {
                color: '#2db7f5',
                cursor: 'pointer'
              },
              on: {
                click: ()=>{
                  this.$refs.userDetail.show(params.row.uid, params.row.lcity, params.row.role)
                }
              }
            }, `${params.row.phone} / ${params.row.nickname}`);
          }
        },{
          title: '被操作人手机/昵称',
          key: 'to_phone',
          align: 'center',
          render: (h, params)=>{
            return h('span',{
              style: {
                color: '#f44336',
                cursor: 'pointer'
              },
              on: {
                click: ()=>{
                  let role = params.row.role;
                  if(role == 1){
                    role = 2
                  }else{
                    role = 1;
                  }
                  this.$refs.userDetail.show(params.row.to_uid, params.row.lcity, role);
                }
              }
            }, `${params.row.to_phone} / ${params.row.to_nickname}`);
          }
        },{
          title: '操作时间',
          key: 'create_at',
          align: 'center'
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params)=>{
            let status = params.row.status;
            if(status === 0){
              return h('Button', {
                props: {
                  type: 'warning'
                },
                on: {
                  click: () => {
                    this.setStatus(params.row.id);
                  }
                }
              },'待处理')
            }else{
              return h('span', '已处理')
            }
          }
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '角色',
          type: 'select',
          placeholder: '选择关键词',
          options: [{
            label: '家长',
            value: 1
          },{
            label: '家教',
            value: 2
          }],
          model: 'role'
        },{
          label: '操作人手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'phone'
        },{
          label: '生成时间',
          type: 'daterange',
          placeholder: '请选择时间',
          model: 'created_time',
          start_end: ['start_time','end_time']
        }
      ],
      pageprops: { //分页配置
        showSizer:true,
        total:0,
      },
      fy: { //当前分页属性
        page: 1,
        size: 10
      },
      searchForm: {}, //搜索框属性
      my_search: {
      }
    }
  },
  computed: {
    searchData () {
      return Object.assign(this.fy,this.searchForm,this.my_search);
    }
  },
  methods: {
    refresh() {
      this.getData();
    },
    search(data) {
      this.searchForm = data;
      this.getData();
    },
    pageChange(page) {
      this.fy.page = page;
      this.getData();
    },
    pageSizeChange(size) {
      this.fy.size = size;
      this.getData();
    },
    setStatus(id){
      this.axios.post('operation-edit',{
        id,
        status: 1
      }).then(d=>{
        if(d){
          this.$Message.success(d.message);
          this.getData();
        }
      })
    },
    getData() {
      this.tableLoading = true;
      this.axios.get('operation-list',{
        params:this.searchData
      }).then(res=>{
        if(res){
          this.tableLoading = false;
          this.myData = res.data.list;
          this.pageprops.total = res.data.total;
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
