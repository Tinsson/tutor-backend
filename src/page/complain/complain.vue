<template>
  <div id="income-detail">
    <title-bar title="投诉列表1" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <!--<Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>-->
    </table-container>
  </div>
</template>
<script>
export default {
  name: "income-detail",
  data() {
    return {
      all_price: '',
      columns: [
        {
          title: '昵称',
          key: 'nickname',
          align: 'center'
        }, {
          title: '余额',
          key: 'balance_money',
          align: 'center'
        }, {
          title: '状态',
          key: 'type',
          align: 'center'
        },{
          title: '生成时间',
          key: 'created_at',
          align: 'center'
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '检索',
          type: 'input',
          placeholder: '输入关键词',
          model: 'keyword'
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
        pay_type: 2
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
      this.axios.get('bill-list',{
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
