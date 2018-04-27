<template>
  <div id="income-detail">
    <title-bar title="投诉列表" @refresh="refresh"></title-bar>
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
          title: '投诉人手机',
          key: 'phone',
          align: 'center'
        },{
          title: '被投诉人手机',
          key: 'to_phone',
          align: 'center'
        },{
          title: '投诉原因',
          key: 'type',
          align: 'center'
        },{
          title: '备注',
          key: 'remark',
          align: 'center'
        },{
          title: '截图',
          key: 'img',
          align: 'center',
          render:(h, params)=>{
            if(params.row.img === ""){
              return h('span', '暂无');
            }else{
              return h('img',{
                style: {
                  width: '50px',
                  height: '80px'
                },
                attrs: {
                  src: params.row.img
                },
                on: {
                  click: ()=>{
                    this.$refs['bigPic'].show(params.row.img);
                  }
                }
              })
            }
          }
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params)=>{
            let status = params.row.status;
            if(status === 0){
              return h('Button', {
                props: {
                  type: 'warning'
                },
                on: {
                  click: () => {
                    this.setStatus(params.row.id);
                  }
                }
              },'待处理')
            }else{
              return h('span', '已处理')
            }
          }
        }
      ],
      myData: [],
      tableLoading: false,
      searchList: [
        {
          label: '投诉项',
          type: 'select',
          placeholder: '输入关键词',
          options: [],
          model: 'type'
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

    },
    getData() {
      this.tableLoading = true;
      this.axios.get('complain-list',{
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
    this.getCates();
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
