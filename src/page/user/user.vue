<template>
<div id="user">
  <title-bar title="用户列表" @refresh="refresh">

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
import msgBtn from './components/user-msg-btn.vue'
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
        }, {
          title: '昵称',
          key: 'nickname',
          align: 'center'
        },{
          title: 'openid',
          key: 'openid',
          align: 'center'
        },{
          title: '性别',
          key: 'gender',
          align: 'center',
          render: (h,params)=>{
            let gender;
            switch(params.row.gender) {
              case 1:gender = '男';break;
              case 2:gender = '女';break;
            }
            return h('span',gender)
          }
        }, {
          title: '省',
          key: 'province',
          align: 'center'
        }, {
          title: '城市',
          key: 'city',
          align: 'center'
        },{
          title: '头像',
          key: 'avatarulr',
          width: '80',
          align:'center',
          render: (h,params)=>{
            return h('img',{
              attrs: {
                src: params.row.avatarulr
              },
              style: {
                width: "45px",
                height: "45px",
                marginTop: "5px"
              }
            })
          }
        }, {
          title: '登录时间',
          key: 'created_at',
          align: 'center'
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
                on: {
                  click: () => {
                    this.$refs.userDetail.show(params.row.openid)
                  }
                }
              }, '查看')
            ])
          }
        }
      ], //列配置数据

      myData: [], //表格数据

      searchList: [{   //搜索列表配置
        label: '检索',
        type: 'input',
        placeholder: '输入关键词',
        model: 'keyword'
      },{
        label: '性别',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: '全部',
          value: '',
        },{
          label: '男',
          value: 1
        },{
          label: '女',
          value: 2
        }],
        model: 'sex'
      },{
        label: '注册时间',
        type: 'daterange',
        placeholder: '请选择注册时间',
        model: 'register_time',
        start_end: ['start_time','end_time']
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
      this.axios.get(`user-list`,{
        params: this.searchData
      }).then(res => {
        this.tableLoading = false;
        if(res) {
          this.myData = res.data.list;
          this.pageprops.total = res.data.total;
        }
      })
    }
  },
  mounted() {
    this.getData();
  },
  components: {
    msgBtn,
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
