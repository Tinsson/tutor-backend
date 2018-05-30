<template>
<div id="user">
  <title-bar title="用户列表" has_refresh="1" @refresh="refresh">
  </title-bar>
  <table-card v-if="is_front" :columns="cardColumns" :data="cardData" card_style="width:35%;" container_style="justify-content: between;" @change="cardChange"></table-card>
  <search-group ref="search-box" :searchList="searchList" @search="search">
  </search-group>
  <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
    <div class="resource-box" slot="btn">
      <span class="total">总计：<span class="num">{{pageprops.total}}</span></span>
      <span>来源：</span>
      <Select v-model="my_search.resource_id" style="width: 150px" clearable filterable remote :remote-method="getResource">
        <Option v-for="item in resourceArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <Table :columns="columnsFilter" :data="myData" border :loading="tableLoading" @on-selection-change="select"></Table>
  </table-container>

  <user-detail ref="userDetail" @save-over="getData" :role="user_role"></user-detail>

</div>
</template>
<script>
import userDetail from './components/user-detail-new.vue'
import Clipboard from 'clipboard'

export default {
  name: "user",
  data (){
    return {
      is_front: false,
      front_uid: '',
      select_arr: [], //选择的用户列表
      // 高级筛选
      senior_search: false,  //高级检索模态框是否显示
      tableLoading: false, //表格是否加载
      user_role: 1,
      // user_detail_show: false,
      cardColumns: [
        {
          title: '匹配用户',
          unit: '',
          key: '0',
          type: 1,
          icon:'checkmark-circled'
        },{
          title: '非匹配用户',
          unit: '',
          key: '1',
          type: 0,
          icon: 'close-circled'
        }
      ],
      cardData: ['0','0'],

      columns: [
        {
          title: '姓名',
          key: 'body_name',
          align: 'center',
          render: (h, params)=>{
            return h('div',{
              'class': {
                clipBtn : true
              },
              style:{
                cursor: 'pointer',
                color: '#0f76c7'
              },
              attrs:{
                src: params.row.body_name
              }
            }, params.row.body_name);
          }
        },{
          title: '手机',
          key: 'phone',
          align: 'center',
          render: (h, params)=>{
            return h('div',{
              'class': {
                clipBtn : true
              },
              style:{
                cursor: 'pointer',
                color: '#0f76c7'
              },
              attrs:{
                src: params.row.phone
              }
            }, params.row.phone);
          }
        },{
          title: '微信昵称',
          key: 'nickname',
          align: 'center',
          render: (h, params)=>{
            return h('div',{
              'class': {
                clipBtn : true
              },
              style:{
                cursor: 'pointer',
                color: '#0f76c7'
              },
              attrs:{
                src: params.row.nickname
              }
            }, params.row.nickname);
          }
        },{
          title: '客户类型',
          key: 'role',
          align: 'center',
          render: (h, params)=>{
            let text = '',
                color = '';
            if(params.row.role === 1){
              text = '家长';
              color = '#ff5722';
            }else if(params.row.role === 2){
              text = '家教';
              color = '#009688';
            }
            return h('span',{
              style: {
                color
              }
            }, text);
          }
        },{
          title: '城市',
          key: 'city',
          align: 'center'
        },{
          title: '审核状态',
          key: 'certime',
          align: 'center'
        }, {
          title: '是否预约',
          key: 'is_order',
          align: 'center',
          render(h, params){
            let text = '';
            if(params.row.is_order === 1){
              text = '是';
            }else{
              text = '否'
            }
            return h('span', text);
          }
        }, {
          title: '来源渠道',
          key: 'resource',
          align: 'center'
        },{
          title: '客户等级',
          key: 'level',
          align: 'center'
        },{
          title: '备注',
          key: 'remark',
          width: 150,
          align: 'center',
          render: (h, params)=>{
            let q_remark = params.row.quick_remark,
                remark = params.row.remark;
            let TagArr = [];
            if(q_remark){
              q_remark.split(',').forEach(val=>{
                TagArr.push(h('Tooltip',{
                  props: {
                    placement: 'top'
                  }
                }, [h('Tag',{
                  props: {
                    type: 'border',
                    color: 'blue'
                  }
                }, val), h('div',{
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, val)]));
              });
            }
            if(remark){

              TagArr.push(h('Tooltip',{
                props: {
                  placement: 'top'
                }
              }, [h('Tag',{
                props: {
                  type: 'border',
                  color: 'red'
                }
              }, remark), h('div',{
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, remark)]));
            }
            return h('div', TagArr);
          }
        },{
          title: '所属助教',
          key: 'assistant',
          align: 'center'
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
                    this.user_role = params.row.role;
                    this.$refs.userDetail.show(params.row.id, params.row.city, this.user_role)
                  }
                }
              }, '查看')
            ])
          }
        }
      ], //列配置数据

      myData: [], //表格数据

      searchBase: [{   //搜索列表配置
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
        label: '微信昵称',
        type: 'input',
        placeholder: '请输入微信昵称',
        model: 'nickname'
      },{
        label: '城市',
        type: 'input',
        placeholder: '请输入筛选城市',
        model: 'city'
      },{
        label: '是否预约',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: '否',
          value: 0,
        },{
          label: '是',
          value: 1
        }],
        model: 'is_order'
      },{
        label: '是否备注',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: '是',
          value: 1
        },{
          label: '否',
          value: 0
        }],
        model: 'is_remark'
      },{
        label: '客户等级',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: 'A',
          value: 'A'
        },{
          label: 'B',
          value: 'B'
        },{
          label: 'C',
          value: 'C'
        }],
        model: 'level'
      }],
      searchMore: [{
        label: '客户类型',
        type: 'select',
        placeholder: '请选择类型',
        model: 'role',
        options: [{
          label: '家长',
          value: 1
        },{
          label: '家教',
          value: 2
        }]
      },{
        label: '审核状态',
        type: 'select',
        placeholder: '请选择',
        options: [{
          label: '未认证',
          value: -1,
        },{
          label: '审核中',
          value: 0
        },{
          label: '认证失败',
          value: 1
        },{
          label: '认证成功',
          value: 2
        }],
        model: 'certime'
      }],

      resourceArr: [],

      pageprops: { //分页配置
        current: 1,
        showSizer:true,
        total:0,
      },
      fy: { //当前分页属性
        page: 1,
        size: 10
      },
      searchForm: {
      }, //搜索框属性
      my_search: {
        resource_id: '',
        is_match: 1
      } //固定搜索用户
    }
  },
  computed: {
    searchData () {
      return Object.assign(this.fy,this.searchForm,this.my_search);
    },
    searchList(){
      if(this.is_front){
        return this.searchBase;
      }else{
        return [...this.searchBase, ...this.searchMore];
      }
    },
    columnsFilter(){
      if(this.is_front){
        let newCol = this.columns;

        newCol.splice(9, 0, {
          title: '距离',
          key: 'distance',
          align: 'center'
        });
        return newCol;
      }else{
        return this.columns;
      }
    }
  },
  watch:{
    searchData:function (val) {
      console.log(val);
      this.getData()
    }
  },
  methods: {
    cardChange(type) {
      console.log(type);
      this.fy.page = 1;
      this.fy.size = 10;
      this.my_search.is_match = type;
    },
    select(selection) {
      this.select_arr = selection
    },
    search(data) {
      this.searchForm = data;
      this.fy.page = 1;
      this.fy.size = 10;
      this.$set(this.pageprops, 'current' , 1);
      this.getData();
    },
    refresh() {
      this.$refs['search-box'].reset_search();
      this.getData();
      //console.log('刷新');
    },
    pageChange(page) {
      this.$set(this.pageprops, 'current' , page);
      this.fy.page = page;
      console.log(this.pageprops);
      this.getData();
    },
    pageSizeChange(size) {
      this.fy.page = 1;
      this.fy.size = size;
      this.getData();
    },
    getNeedConf(){
      this.axios.get('need-config').then((res)=>{
        if(res.status === 1){
          let list = res.data.list;
          this.$store.commit('CONFIG_SET', list);
        }
      })
    },
    getData () {
      this.tableLoading = true;
      let params = this.$copyObj(this.searchData),
          url = this.is_front?'front-list':'user-list';
      if(this.is_front){
        params.front_uid = this.front_uid;
      }
      this.axios.get(url,{
        params
      }).then(res => {
        this.tableLoading = false;
        if(res) {
          this.myData = res.data.list;
          this.pageprops.total = res.data.total;
          if(this.is_front){
            let info = res.data;
            this.cardData = [`${info.total1}/${info.total_all}`,`${info.total2}/${info.total_all}`];
          }
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
    },
    getResource(query){
      this.axios.get('get-resource',{
        params: {
          resource: query
        }
      }).then(d=>{
        if(d.status == 1){
          this.resourceArr = d.data.list;
        }
      })
    }
  },
  created(){
    let query = this.$route.query;
    if('front_uid' in query){
      this.front_uid = query.front_uid;
      this.is_front = true;
    }
  },
  mounted() {
    //this.getNeedConf();
    this.getData();

    //剪切板功能
    this.ClipBoard = new Clipboard('.clipBtn',{
      text: function(elm){
        return elm.getAttribute('src');
      }
    });
    this.ClipBoard.on('success',(e)=>{
      //e.trigger.style.color = '#F00';
      this.$Message.success('复制成功！！！');
    });
  },
  destroyed() {
    this.ClipBoard.destroy();
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
  .resource-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    .total{
      padding-right: 25px;
      .num{
        color: red;
      }
    }
  }
</style>
