<template>
  <div id="income-detail">
    <title-bar title="课程列表" @refresh="refresh"></title-bar>
    <search-group :searchList="searchList" @search="search"></search-group>
    <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
      <!--<div slot="btn">-->
        <!--<Button type="info" @click="CreateCourse">创建</Button>-->
      <!--</div>-->
      <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
    <user-detail ref="userDetail" @save-over="getData"></user-detail>
    <first-model ref="firstModel" @save-over="getData"></first-model>
    <Modal v-model="remark_show" title="课程反馈">
      <div class="content">
        <div class="info-box">
          {{remark}}
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import userDetail from '../user/components/user-detail-new.vue'
  import firstModel from './components/first-class-model'

  export default {
    name: "consult",
    components: {
      userDetail,
      firstModel
    },
    data() {
      return {
        remark_show: false,
        remark: '',
        all_price: '',
        img_src: '',
        columns: [
          {
            title: '家长',
            key: 'learn_name',
            align: 'center'
          },{
            title: '手机号',
            key: 'learn_phone',
            align: 'center'
          },{
            title: '家教',
            key: 'tutor_name',
            align: 'center'
          },{
            title: '上课时间',
            key: 'create_at',
            width: 100,
            align: 'center'
          },{
            title: '下课时间',
            key: 'update_at',
            width: 100,
            align: 'center'
          },{
            title: '课时数量',
            key: 'class_hour',
            align: 'center'
          },{
            title: '剩余课时',
            key: 'free_hour',
            align: 'center'
          },{
            title: '课程反馈',
            key: 'operation',
            align: 'center',
            render: (h, params)=>{
              return h('div', [h('Button',{
                style: {
                  marginRight: '5px'
                },
                props: {
                  type: 'success'
                },
                on: {
                  click: ()=>{
                    this.CheckOpt(params.row);
                  }
                }
              }, '查看')]);
            }
          }
        ],
        myData: [],
        tableLoading: false,
        searchList: [
          {
            label: '家长姓名',
            type: 'input',
            placeholder: '输入手机号',
            model: 'learn_name'
          },{
            label: '家长手机号',
            type: 'input',
            placeholder: '输入手机号',
            model: 'learn_phone'
          },{
            label: '上课时间',
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
        this.axios.get('class-list',{
          params:this.searchData
        }).then(res=>{
          if(res){
            this.tableLoading = false;
            this.myData = res.data.lists;
            this.pageprops.total = res.data.total;
          }
        })
      },
      CreateCourse(){
        this.$refs['firstModel'].show();
      },
      CheckOpt(row){
        this.remark_show = true;
        this.remark = row.remark;
        console.log(row.remark);
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>
<style lang="scss" scoped>
</style>
