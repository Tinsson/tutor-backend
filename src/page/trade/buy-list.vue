<template>
  <div id="income-detail">
    <title-bar title="课程充值列表" @refresh="refresh"></title-bar>
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
          title: '家长',
          key: 'learn_name',
          align: 'center'
        },{
          title: '手机号',
          key: 'learn_phone',
          align: 'center'
        },{
          title: '姓名',
          key: 'tutor_name',
          align: 'center'
        },{
          title: '课时单价',
          key: 'price',
          align: 'center'
        },{
          title: '课时数量',
          key: 'class_hour',
          align: 'center'
        },{
          title: '课时总价',
          key: 'amount',
          align: 'center'
        },{
          title: '充值时间',
          key: 'create_at',
          width: 100,
          align: 'center'
        }/*,{
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params)=>{
            return h('div', [h('Button',{
              style: {
                marginRight: '5px'
              },
              props: {
                type: 'success'
              },
              on: {
                click: ()=>{
                  this.RefundOpt(params.row);
                }
              }
            }, '退款')]);
          }
        }*/
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '姓名',
          type: 'input',
          placeholder: '输入姓名',
          model: 'name'
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
      this.axios.get('order-list',{
        params:this.searchData
      }).then(res=>{
        if(res){
          this.tableLoading = false;
          this.myData = res.data.lists;
          this.pageprops.total = res.data.total;
        }
      })
    },
    RefundOpt(row){

    }
  },
  mounted() {
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
