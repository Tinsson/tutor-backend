<template>
  <div id="income-detail">
    <title-bar title="购买联系方式流水" @refresh="refresh"></title-bar>
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
          title: '购买人角色',
          key: 'nickname',
          align: 'center'
        }, {
          title: '购买人昵称',
          key: 'nickname',
          align: 'center'
        }, {
          title: '购买人微信号',
          key: 'phone',
          align: 'center'
        },{
          title: '购买人手机号',
          key: 'body_name',
          align: 'center'
        },{
          title: '购买人姓名',
          key: 'addtime',
          align: 'center'
        },{
          title: '微信订单流水号',
          key: 'wx_order_sn',
          align: 'center'
        },{
          title: '支付金额',
          key: 'amount',
          align: 'center'
        },{
          title: '支付状态',
          key: 'status',
          align: 'center'
        },{
          title: '被购买者姓名',
          key: 'rz_status',
          align: 'center'
        },{
          title: '被购买者手机号',
          key: 'asdf'
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '用户手机号',
          type: 'input',
          placeholder: '输入手机号',
          model: 'phone'
        },{
          label: '支付状态',
          type: 'select',
          placeholder: '请选择',
          options: [{
            label: '取消',
            value: -1
          },{
            label: '成功',
            value: 1
          },{
            label: '失败',
            value: 2
          }],
          model: 'status'
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
      this.axios.get('buy-list',{
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
