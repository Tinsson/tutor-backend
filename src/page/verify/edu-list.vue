<template>
<div id="user">
  <title-bar title="学历审核列表" @refresh="refresh" />
  <table-card :columns="cardColumns" :data="cardData" card_style="width:30%;" container_style="justify-content: between;" @change="cardChange"></table-card>
  <search-group :searchList="searchList" @search="search">
  </search-group>
  <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
    <Table :columns="columns" :data="myData" border :loading="tableLoading" @on-selection-change="select"></Table>
  </table-container>
  <edu-info ref="eduModel"></edu-info>
  <user-detail ref="userDetail" :role="user_role"></user-detail>
</div>
</template>
<script>
import eduInfo from './components/edu-info'
import userDetail from '../user/components/user-detail-new.vue'

export default {
  name: "user",
  components: {
    eduInfo,
    userDetail
  },
  data (){
    return {
      select_arr: [], //选择的用户列表
      // 高级筛选
      senior_search: false,  //高级检索模态框是否显示
      user_role: 2,
      tableLoading: false, //表格是否加载

      // user_detail_show: false,
      cardColumns: [
        {
          title: '待审核',
          unit: '',
          key: '0',
          type: 0,
          icon:'help-circled'
        },{
          title: '不通过',
          unit: '',
          key: '1',
          type: 1,
          icon: 'close-circled'
        },{
          title: '通过',
          unit: '',
          key: '2',
          type: 2,
          icon: 'checkmark-circled'
        }
      ],
      cardData: [],

      columns: [
        {
          title: '姓名',
          key: 'body_name',
          align: 'center'
        },{
          title: '手机号',
          key: 'phone',
          align: 'center'
        }/*, {
          title: '学历信息',
          key: 'edu',
          align: 'center',
          render: (h, params)=>{
            return h('span',{
              style: {
                color: '#2db7f5',
                cursor: 'pointer'
              },
              on: {
                click: ()=>{
                  this.$refs['eduModel'].show(params.row);
                }
              }
            },'查看')
          }
        }*/,{
          title: '用户信息',
          align: 'center',
          render: (h, params)=>{
            return h('div', [
              h('span', {
                style: {
                  color: '#2db7f5',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    //this.user_role = params.row.role;
                    this.user_role = 2;
                    this.$refs.userDetail.show(params.row.uid, params.row.city, 2)
                  }
                }
              }, '查看')
            ])
          }
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          width: '250',
          render: (h, params) => {
            return h('div', [h('Button', {
              props: {
                type: 'info'
              },
              style: {
                'marginRight': '5px'
              },
              on: {
                click: () => {
                  this.passVerify(params.row.uid, 1, 2);
                }
              }
            }, '通过'),
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.passVerify(params.row.uid, 0, 2);
                  }
                }
              }, '不通过')]
            )
          }
        }
      ], //列配置数据

      myData: [], //表格数据

      searchList: [{   //搜索列表配置
        label: '姓名',
        type: 'input',
        placeholder: '请输入姓名',
        model: 'name'
      },{
        label: '时间',
        type: 'daterange',
        placeholder: '请选择时间',
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
      searchForm: {
        type: 0
      }, //搜索框属性
      my_search: {} //固定搜索用户
    }
  },
  computed: {
    searchData () {
      return Object.assign(this.fy,this.searchForm,this.my_search);
    }
  },
  watch:{
    // searchData:function () {
    //   this.getData()
    // }
  },
  methods: {
    cardChange(type) {
      this.searchForm.type = type;
      this.getData();
    },
    select(selection) {
      this.select_arr = selection;
      this.getData();
    },
    search(data) {
      console.log(data);
      this.my_search = data;

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
      this.axios.get(`verify-edu-list`,{ params: this.searchData}).then(res => {
        this.tableLoading = false;
        if(res) {
          this.myData = res.data.list;

          this.pageprops.total = res.data.total;

        }
      })
    },
    passVerify(uid ,status, role){
      let text = "";
      if(status === 0){
        text = '确认该用户学历审核不通过？'
      }else if(status === 1){
        text = '确认该用户学历审核通过？'
      }
      this.$Modal.confirm({
        title: '提示',
        content: `<p>${text}</p>`,
        onOk: () => {
          this.axios.post("verify-audit", {
            uid,
            type: 2,
            status,
            role
          }).then(d=>{
            if(d.status === 1){
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
