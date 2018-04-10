<template>
  <div id="base-template">
    <title-bar title="基础" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
      <div slot="btn">
      </div>
      <Table :columns="columns" :data="myData" border :loading="tableLoading" @on-selection-change="select"></Table>
    </table-container>
  </div>
</template>
<script>
export default {
  name: "base-template",
  data() {
    return {
      columns: [
        {
        type: 'selection',
        width: 60,
        align: 'center'
        },{
          title: '用户ID',
          key: 'uuid',
          align: 'center'
        },{
          title: '用户账号',
          key: 'account',
          align: 'center'
        }, {
          title: '用户昵称',
          key: 'user_name',
          align: 'center'
        }, {
          title: '注册时间',
          key: 'register_time',
          align: 'center'
        }, {
          title: '绑定手机号',
          key: 'mobile',
          align: 'center'
        }, {
          title: '授权微信',
          key: 'wx',
          align: 'center'
        }, {
          title: '认证图',
          key: 'pic',
          align: 'center'
        }, {
          title: '审核状态',
          key: 'status',
          align: 'center'
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
              }, '查看'),
              h('Button', {
                props: {
                  type: 'text'
                }
              }, '删除')
            ])
          }
        }
      ],
      myData: [{uuid:1}],
      tableLoading: false,
      searchList: [
        {
          label: '用户账号',
          type: 'input',
          placeholder: '用户ID/账号',
          model: 'uuid'
        },{
          label: '用户昵称',
          type: 'input',
          placeholder: '用户昵称',
          model: 'nickname'
        },{
          label: '注册时间',
          type: 'daterange',
          placeholder: '请选择时间',
          model: 'register_time',
          start_end: ['start_time','end_time']
        },{
          label: '审核状态',
          type: 'select',
          placeholder: '选择审核状态',
          model: 'status',
          options:[{
            label: '通过',
            value: '1'
          },{
            label: '未通过',
            value: '0'
          }]
        }
      ],
      select_arr: [], //选择的用户列表
      pageprops: { //分页配置
        showSizer:true,
        total:0,
      },
      fy: { //当前分页属性
        page: 1,
        size: 10
      },
      searchForm: {} //搜索框属性
    }
  },
  computed: {
    searchData () {
      return Object.assign(this.fy,this.searchForm);
    }
  },
  methods: {
    refresh() {
      console.log('刷新')
    },
    select(selection) {
      this.select_arr = selection
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
      this.fy.page = 1;
      this.fy.size = size;
      this.getData();
    },
    getData() {
      console.log(this.searchData)
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
