<template>
  <div id="income-detail">
    <title-bar title="认证支付流水" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
  </div>
</template>
<script>
export default {
  name: "contact-list",
  data() {
    return {
      all_price: '',
      columns: [
        {
          title: '解锁人角色',
          key: 'role',
          align: 'center',
          render: (h, params)=>{
            let role = params.row.role,
                text = '';
            if(role === 1){
              text = '家长'
            }else if(role === 2){
              text = '家教'
            }
            return h('span', text);
          }
        }, {
          title: '解锁人手机号',
          key: 'phone',
          align: 'center'
        },{
          title: '被解锁人手机号',
          key: 'to_phone',
          align: 'center'
        },{
          title: '消耗机会',
          key: 'chance',
          align: 'center'
        },{
          title: '当前机会余额',
          key: 'rest_chance',
          align: 'center'
        },{
          title: '时间',
          key: 'create_at',
          align: 'center'
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '解锁人手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'phone'
        },{
          label: '被解锁人手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'to_phone'
        },{
          label: '解锁者角色',
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
      this.axios.get('contact-list',{
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
