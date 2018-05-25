<template>
  <div id="income-detail">
    <title-bar title="订单列表" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
  </div>
</template>
<script>
export default {
  name: "income-detail",
  data() {
    return {
      all_price: '',
      img_src: '',
      columns: [
        {
          title: '服务费',
          key: 'amount',
          align: 'center'
        },{
          title: '订单号',
          key: 'order_sn',
          align: 'center'
        },{
          title: '支付状态',
          key: 'status',
          align: 'center',
          render: (h, params)=>{
            let txt = '';
            switch (params.row.status){
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
                txt = '退款';
                break;
            }
            return h('span', txt);
          }
        },{
          title: '家教手机号',
          key: 'tutor_phone',
          align: 'center'
        },{
          title: '家长手机号',
          key: 'learn_phone',
          align: 'center'
        },{
          title: '订单生成时间',
          key: 'create_at',
          align: 'center'
        },{
          title: '订单完成时间',
          key: 'finish_at',
          align: 'center'
        },{
          title: '家教姓名',
          key: 'tutor_name',
          align: 'center'
        },{
          title: '家长姓名',
          key: 'learn_name',
          align: 'center',
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '家长姓名',
          type: 'input',
          placeholder: '请输入家长姓名',
          model: 'learn'
        },{
          label: '家教姓名',
          type: 'input',
          placeholder: '请输入家教姓名',
          model: 'tutor'
        },{
          label: '手机号',
          type: 'input',
          placeholder: '请输入手机号',
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
      this.axios.get('complain-edit',{
        params: {id}
      }).then(d=>{
        if(d){
          this.$Message.success(d.message);
          this.getData();
        }
      })
    },
    getCates(){
      this.axios.get('get-comlt').then(d=>{
        if(d){
          this.searchList[0].options = [];
          d.data.forEach(val=>{
            this.searchList[0].options.push({
              label: val.namecn,
              value: val.id
            })
          })
        }
      })
    },
    getData() {
      this.tableLoading = true;
      this.axios.get('order-list',{
        params:this.searchData
      }).then(res=>{
        if(res){
          this.tableLoading = false;
          this.myData = res.data.order_list;
          this.pageprops.total = res.data.total;
        }
      })
    },
  },
  mounted() {
    this.getCates();
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
