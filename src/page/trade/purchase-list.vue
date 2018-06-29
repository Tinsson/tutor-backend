<template>
  <div id="income-detail">
    <title-bar title="会员充值列表" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
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
          title: '家教',
          key: 'body_name',
          align: 'center'
        },{
          title: '手机号',
          key: 'phone',
          align: 'center'
        },{
          title: '充值金额',
          key: 'amount',
          align: 'center'
        },{
          title: '充值时间',
          key: 'create_at',
          align: 'center'
        },{
          title: '到期时间',
          key: 'valid_at',
          align: 'center',
        },{
          title: '订单状态',
          key: 'status',
          align: 'center',
          render: (h, params) =>{
            let status = params.row.status,
                txt = '';
            switch(status){
              case 0:
                txt = '待支付';
                break;
              case 1:
                txt = '已支付';
                break;
              case 2:
                txt = '支付失败';
                break;
              case 3:
                txt = '退款中';
                break;
              case 4:
                txt = '已退款';
                break;
              default:
                txt = '未知'
            }
            return h('span', txt);
          }
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '姓名',
          type: 'input',
          placeholder: '输入姓名',
          model: 'body_name'
        },{
          label: '用户手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'phone'
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
      this.axios.get('recharge-list',{
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
