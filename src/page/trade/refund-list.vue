<template>
  <div id="income-detail">
    <title-bar title="退款列表" @refresh="refresh"></title-bar>
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
          title: '订单号',
          key: 'order_sn',
          align: 'center'
        },{
          title: '姓名',
          key: 'body_name',
          align: 'center'
        }, {
          title: '手机号',
          key: 'phone',
          align: 'center'
        },{
          title: '角色',
          key: 'role',
          align: 'center',
          render: (h, params)=>{
            let txt = '';
            switch(params.row.role){
              case 0:
                txt = '未知';
                break;
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
          title: '订单总金额',
          key: 'total_fee',
          align: 'center'
        },{
          title: '退款状态',
          key: 'status',
          align: 'center',
          render: (h, params)=>{
            let txt = '';
            switch(params.row.status){
              case 0:
                txt = '待退款';
                break;
              case 1:
                txt = '退款成功';
                break;
              case 2:
                txt = '退款失败';
                break;
            }
            return h('span', txt);
          }
        },{
          title: '操作人',
          key: 'editor',
          align: 'center'
        },{
          title: '退款单号',
          key: 'refund_sn',
          align: 'center'
        },{
          title: '退款申请时间',
          key: 'create_at',
          align: 'center'
        },{
          title: '操作',
          key: 'operate',
          align: 'center',
          render: (h, params)=>{
            if(params.row.status == 0){
              return h('div',[h('Button',{
                props: {
                  type: 'info'
                },
                on: {
                  click: ()=>{
                    this.RefundOpt(params.row);
                  }
                }
              }, '退款')])
            }
          }
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
          label: '退款状态',
          type: 'select',
          placeholder: '请选择',
          options: [{
            label: '待退款',
            value: 0
          },{
            label: '退款成功',
            value: 1
          },{
            label: '退款失败',
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
      this.axios.get('ref-list',{
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
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认对该订单进行退款？</p>',
        onOk: ()=>{
          this.axios.post('ref-btn',{
            order_sn: row.order_sn
          }).then(res=>{
            if(res){
              this.$Message.success(res.message);
              this.getData();
            }
          })
        }
      })
    }
  },
  mounted() {
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
