<template>
  <div id="income-detail">
    <title-bar title="会员充值订单列表" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
        <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
    <user-detail ref="userDetail" @save-over="getData" :role="1"></user-detail>
  </div>
</template>
<script>
  import userDetail from '../user/components/user-detail-new.vue'

export default {
  name: "income-detail",
  components: {
    userDetail
  },
  data() {
    return {
      all_price: '',
      img_src: '',
      columns: [
        {
          title: '用户姓名',
          key: 'body_name',
          align: 'center'
        },{
          title: '手机号',
          key: 'phone',
          align: 'center'
        },{
          title: '角色',
          key: 'role',
          align: 'center',
          render: (h, params)=>{
            let txt = '';
            switch (params.row.role){
              case 1:
                txt = "家长";
                break;
              case 2:
                txt = '家教';
                break;
            }
            return h('span', txt);
          }
        },{
          title: '充值金额',
          key: 'amount',
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
              case 4:
                txt = '已退款';
                break;
            }
            return h('span', txt);
          }
        },{
          title: '生成时间',
          key: 'create_at',
          align: 'center'
        },{
          title: '充值完成时间',
          key: 'finish_at',
          align: 'center'
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 100,
          render: (h, params)=>{
            return h('div', [
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  'marginRight': '5px'
                },
                on: {
                  click: () => {
                    this.$refs.userDetail.show(params.row.uid, '', params.row.role)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '姓名',
          type: 'input',
          placeholder: '请输入姓名',
          model: 'body_name'
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
    //作废订单
    delOrder(order_sn){
      console.log(order_sn);
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认作废此订单吗？</p>',
        onOk: ()=>{
          this.axios.post('del-order',{
            order_sn
          }).then(d=>{
            if(d){
              this.$Message.success(d.message);
              this.getData();
            }
          })
        }
      })
    },
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
    //this.getCates();
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
