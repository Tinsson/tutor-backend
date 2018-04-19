<template>
<div id="user">
  <title-bar title="家教列表" @refresh="refresh">

  </title-bar>
  <search-group :searchList="searchList" @search="search">
  </search-group>
  <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
    <Table :columns="columns" :data="myData" border :loading="tableLoading" @on-selection-change="select"></Table>
  </table-container>

  <user-detail ref="userDetail"></user-detail>

</div>
</template>
<script>
import userDetail from './components/user-detail-new.vue'
export default {
  name: "user",
  data (){
    return {
      select_arr: [], //选择的用户列表
      // 高级筛选
      senior_search: false,  //高级检索模态框是否显示
      tableLoading: false, //表格是否加载

      // user_detail_show: false,

      columns: [
        {
          title: 'ID',
          key: 'id',
          align: 'center'
        },{
          title: '头像',
          key: 'portrait',
          align: 'center',
          render(h, params){
            return h('img',{
              style: {
                width: '50px',
                height: '50px'
              },
              attrs: {
                src: params.row.portrait
              }
            })
          }
        },{
          title: '微信号',
          key: 'wechat',
          align: 'center'
        },{
          title: 'openid',
          key: 'openid',
          align: 'center'
        },{
          title: '姓名',
          key: 'body_name',
          align: 'center'
        },{
          title: '手机',
          key: 'phone',
          align: 'center'
        }, {
          title: '认证状态',
          key: 'certime',
          align: 'center'
        }, {
          title: '是否预约',
          key: 'is_order',
          align: 'center',
          render(h, params){
            let text = '';
            if(params.row.is_order === 1){
              text = '预约';
            }else{
              text = '非预约'
            }
            return h('span', text);
          }
        }, {
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params) => {
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
                    this.$refs.userDetail.show(params.row.id)
                  }
                }
              }, '查看'),
              h('Button',{
                props: {
                  type: 'warning'
                },
                on: {
                  click: ()=>{
                    this.transRole(1, params.row.id);
                  }
                }
              }, '更改身份')
            ])
          }
        }
      ], //列配置数据

      myData: [], //表格数据

      searchList: [{   //搜索列表配置
        label: '姓名',
        type: 'input',
        placeholder: '输入姓名',
        model: 'body_name'
      },{
        label: '手机号',
        type: 'input',
        placeholder: '请输入手机号',
        model: 'phone'
      },{
        label: '城市',
        type: 'input',
        placeholder: '请输入筛选城市',
        model: 'city'
      },{
        label: '认证状态',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: '未审核',
          value: 0,
        },{
          label: '不通过',
          value: 1
        },{
          label: '通过',
          value: 2
        }],
        model: 'certime'
      },{
        label: '预约状态',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: '不接受预约',
          value: 0,
        },{
          label: '接受预约',
          value: 1
        }],
        model: 'is_order'
      }],

      pageprops: { //分页配置
        showSizer:true,
        total:0,
      },
      fy: { //当前分页属性
        page: 1,
        size: 10
      },
      searchForm: {}, //搜索框属性
      my_search: {} //固定搜索用户
    }
  },
  computed: {
    searchData () {
      return Object.assign(this.fy,this.searchForm,this.my_search);
    }
  },
  watch:{
    searchData:function () {
      this.getData()
    }
  },
  methods: {
    select(selection) {
      this.select_arr = selection
    },
    search(data) {
      this.searchForm = data;
      this.getData();
    },
    refresh() {
      console.log('刷新')
    },
    pageChange(page) {
      this.fy.page = page;
      this.getData();
    },
    pageSizeChange(size) {
      this.fy.page = 1;
      this.fy.size = size;
      this.getData();
    },
    getData () {
      this.tableLoading = true;
      this.axios.get(`tutor-list`,{
        params: this.searchData
      }).then(res => {
        this.tableLoading = false;
        if(res) {
          this.myData = res.data.list;
          this.pageprops.total = res.data.total;
        }
      })
    },
    transRole(role, uid){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认切换身份吗？</p>',
        onOk: () => {
          this.axios.post('trans-role',{
            role,
            uid
          }).then(d=>{
            if(d){
              this.$Message.success(d.message);
              this.getData();
            }
          })
        }
      });
    }
  },
  mounted() {
    this.getData();
  },
  components: {
    userDetail
  }
}
</script>
<style lang="scss" scoped>
.red {
    color: red;
}
.senior-search-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    > div {
        width: 40%;
        margin-bottom: 10px;
        .label {
            white-space: nowrap;
            margin-bottom: 10px;
            font-size: 14px;
        }
    }
}
.app-container{
  .chose-btn{
    height:33px;
    background:#eee;
    border-radius:5px;
    cursor: pointer;
  }
}
  .avatar-img{
    width: 120px;
    height: 120px;
  }
</style>
