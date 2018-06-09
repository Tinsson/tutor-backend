<template>
  <div id="income-detail">
    <title-bar title="联系人列表" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>

    <user-detail ref="userDetail" @save-over="getData"></user-detail>
  </div>
</template>
<script>
  import userDetail from '../user/components/user-detail-new.vue'

export default {
  name: "contact-list",
  components: {
    userDetail
  },
  data() {
    return {
      all_price: '',
      columns: [
        // {
        //   title: '解锁人角色',
        //   key: 'role',
        //   align: 'center',
        //   render: (h, params)=>{
        //     let role = params.row.role,
        //         text = '';
        //     if(role === 1){
        //       text = '家长'
        //     }else if(role === 2){
        //       text = '家教'
        //     }
        //     return h('span', text);
        //   }
        // },     主叫用户/被叫用户/虚拟号码/开始时间/结束时间/通话时长
        {
          title: '主叫用户',
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
                  let role = params.row.role;

                  this.$refs.userDetail.show(params.row.uid, params.row.lcity, role)
                }
              }
            }, params.row.phone);
          }
        },{
          title: '被叫用户',
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
                  let role = params.row.to_role;

                  this.$refs.userDetail.show(params.row.to_uid, '', role);
                }
              }
            }, params.row.to_phone);
          }
        },{
          title: '虚拟号码',
          key: 'number',
          align: 'center'
        },{
          title: '开始时间',
          key: 'start_at',
          align: 'center'
        },{
          title: '结束时间',
          key: 'end_at',
          align: 'center'
        },{
          title: '通话时长',
          key: 'time',
          align: 'center'
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '主叫手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'phone'
        },{
          label: '被叫手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'to_phone'
        },{
          label: '主叫角色',
          type: 'select',
          placeholder: '请选择',
          options: [{
            label: '家长',
            value: 1
          },{
            label: '家教',
            value: 2
          }],
          model: 'role'
        },{
          label: '时间',
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
    getData() {
      this.tableLoading = true;
      this.axios.get('contacts-list',{
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
