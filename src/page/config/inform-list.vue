<template>
  <div id="income-detail">
    <title-bar title="通知管理" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
  </div>
</template>
<script>
export default {
  name: "inform-list",
  data() {
    return {
      all_price: '',
      columns: [
        {
          title: '通知类型',
          key: 'type',
          align: 'center',
          render:(h, params)=>{
            let txt = '';
            if(params.row.type === 1){
              txt = '短信';
            }else{
              txt = '微信模版';
            }
            return h('span', txt);
          }
        },{
          title: '通知详情',
          key: 'content',
          align: 'center'
        },{
          title: '通知节点',
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
      this.axios.get('infom-list',{
        params:this.searchData
      }).then(res=>{
        if(res){
          this.tableLoading = false;
          this.myData = res.data.lists;
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
