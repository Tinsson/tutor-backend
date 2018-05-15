<template>
  <div id="user">
    <title-bar title="助教列表" @refresh="refresh">

    </title-bar>
    <search-group :searchList="searchList" @search="search">
    </search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
      <div slot="btn">
        <Button type="success" @click="assisAdd">新增</Button>
      </div>
      <Table :columns="columns" :data="myData" border :loading="tableLoading" @on-selection-change="select"></Table>
    </table-container>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
    <assis-model ref="assisModel" @optOver="refresh"></assis-model>

  </div>
</template>
<script>
  import assisModel from './components/assis-model'

  export default {
    name: "user",
    data (){
      return {
        select_arr: [], //选择的用户列表
        // 高级筛选
        senior_search: false,  //高级检索模态框是否显示
        tableLoading: false, //表格是否加载
        user_role: 1,
        // user_detail_show: false,

        columns: [
          {
            title: '助教姓名',
            key: 'name',
            align: 'center'
          },{
            title: '助教手机',
            key: 'phone',
            align: 'center'
          },{
            title: '二维码',
            key: 'phone',
            align: 'center',
            render: (h, params)=>{
              return h('span',{
                style: {
                  cursor: 'pointer',
                  color: '#2db7f5',
                },
                on: {
                  click: ()=>{
                    this.$refs['bigPic'].show(params.row.long_qrcode);
                  }
                }
              }, '查看')
            }
          },{
            title: '城市',
            key: 'citys',
            align: 'center'
          },{
            title: '助教id',
            key: 'aid',
            align: 'center'
          },{
            title: '就职状态',
            key: 'role',
            align: 'center',
            render: (h, params)=>{
              let text = '';
              if(params.row.status === 0){
                text = '离职';
              }else if(params.row.status === 1){
                text = '在职'
              }
              return h('span', text);
            }
          },{
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
                      this.$refs['assisModel'].show(params.row);
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ], //列配置数据

        myData: [], //表格数据

        searchList: [{   //搜索列表配置
          label: '助教姓名',
          type: 'input',
          placeholder: '输入姓名',
          model: 'name'
        },{
          label: '城市',
          type: 'input',
          placeholder: '请输入城市名',
          model: 'city'
        },{
          label: '就职状态',
          type: 'select',
          placeholder: '请选择',
          options: [{
            label: '离职',
            value: 0,
          },{
            label: '就职',
            value: 1
          }],
          model: 'status'
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
        this.getData();
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
        this.axios.get(`assis-list`,{
          params: this.searchData
        }).then(res => {
          this.tableLoading = false;
          if(res) {
            this.myData = res.data.list;
            this.pageprops.total = res.data.total;
          }
        })
      },
      assisAdd(){
        this.$refs['assisModel'].show();
      }
    },
    mounted() {
      this.getData();
    },
    components: {
      assisModel
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
