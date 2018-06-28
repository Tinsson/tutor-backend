<template>
<div id="user">
  <title-bar title="家教审核列表" @refresh="refresh">
  </title-bar>
  <table-card :columns="cardColumns" :data="cardData" card_style="width:30%;" container_style="justify-content: between;" @change="cardChange"></table-card>
  <search-group :searchList="searchList" @search="search">
  </search-group>
  <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
    <Table :columns="columns" :data="myData" border :loading="tableLoading" @on-selection-change="select"></Table>
  </table-container>
  <edu-info ref="eduModel"></edu-info>
</div>
</template>
<script>
import eduInfo from './components/edu-info'

export default {
  name: "user",
  components: {
    eduInfo
  },
  data (){
    return {
      select_arr: [], //选择的用户列表
      // 高级筛选
      senior_search: false,  //高级检索模态框是否显示
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
          title: '序号',
          key: 'id',
          align: 'center'
        }, {
          title: '头像',
          key: 'nickname',
          align: 'center',
          render: (h, params)=>{
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
          title: 'openid',
          key: 'openid',
          align: 'center'
        },{
          title: '微信号',
          key: 'wechat',
          align: 'center'
        },{
          title: '手机号',
          key: 'phone',
          align: 'center'
        }, {
          title: '姓名',
          key: 'body_name',
          align: 'center'
        },{
          title: '学历',
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
        }/*,{
          title: '认证状态',
          key: 'status',
          align: 'center'
        }*/,{
          title: '身份证审核',
          key: 'idcard_v',
          align: 'center',
          render(h, params){
            return h('span', params.row.auth.identify);
          }
        },{
          title: '微信审核',
          key: 'wechat_v',
          align: 'center',
          render(h, params){
            return h('span', params.row.auth.wechat);
          }
        },{
          title: '学历审核',
          key: 'edu',
          align: 'center',
          render(h, params){
            return h('span', params.row.auth.education);
          }
        },{
          title: '地址',
          key: 'geo_name',
          align: 'center'
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          width: '250',
          render: (h, params) => {
            return h('div', [
              h('Dropdown', {
                style:{
                  marginRight: '10px'
                },
                attrs:{
                  trigger: 'click'
                }
              }, [h('Button',{
                props: {
                  type: 'success'
                }
              }, ['微信审核 ',h('Icon',{
                props: {
                  type: 'arrow-down-b'
                }
              })]),h('DropdownMenu',{
                slot: 'list'
              },[
                h('DropdownItem',[h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.passVerify(params.row.id, 1, 3);
                    }
                  }
                }, '通过')]),
                h('DropdownItem',[h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.passVerify(params.row.id, 0, 3);
                    }
                  }
                }, '不通过')])
              ])]),
              h('Dropdown', {
                style:{
                  marginRight: '10px'
                },
                attrs:{
                  trigger: 'click'
                }
              }, [h('Button',{
                props: {
                  type: 'primary'
                }
              }, ['学历审核 ',h('Icon',{
                props: {
                  type: 'arrow-down-b'
                }
              })]),h('DropdownMenu',{
                slot: 'list'
              },[
                h('DropdownItem',[h('Button', {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.passVerify(params.row.id, 1, 2);
                    }
                  }
                }, '通过')]),
                h('DropdownItem',[h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.passVerify(params.row.id, 0, 2);
                    }
                  }
                }, '不通过')])
              ])])
            ]);
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
    },
    select(selection) {
      this.select_arr = selection
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
      this.axios.get(`verify-tutor-list`,{ params: this.searchData}).then(res => {
        this.tableLoading = false;
        if(res) {
          this.myData = res.data;

          //this.pageprops.total = res.data.total;

        }
      })
    },
    passVerify(uid ,status, type){
      this.axios.post("set-tutor-status", {
        uid,
        status,
        type
      }).then(d=>{
        if(d.status === 1){
          this.$Message.success(d.message);
          this.getData();
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
