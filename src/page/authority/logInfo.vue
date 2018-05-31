<template>
  <div id="income-detail">
    <title-bar title="操作日志" @refresh="refresh"></title-bar>
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
            title: '登录姓名',
            key: 'admin_name',
            align: 'center'
          },{
            title: '登录id',
            key: 'admin_id',
            align: 'center'
          },{
            title: '操作路径',
            key: 'module',
            align: 'center'
          },{
            title: '操作IP',
            key: 'ip',
            align: 'center'
          },{
            title: '内容',
            key: 'content',
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
        this.axios.get('log-list',{
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
