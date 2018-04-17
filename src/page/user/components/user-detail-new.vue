<template lang="html">
  <div class="user-detail">
    <Modal v-model="if_show" title="用户详情" width="1200" cancel-text>
      <Row :gutter='5'>
        <Col span="17">
          <div class="user_tag">
              <img class="user_img" :src="myData.portrait">
              <div class="money_msg">
                <span>姓名: {{myData.head_name}}</span>
                <span>手机号:  {{myData.phone}} </span>
                <div style="marginTop: 5px">
                  <span style="marginRight:50px">微信号:  {{myData.wechat}}</span>
                  <span>预约状态:  {{myData.is_order === 1?'接受预约':'不接受预约'}}</span>
                </div>
                <div style="fontSize: 16px;marginTop:5px">openid: {{myData.openid}}</div>
                <div style="fontSize: 16px;marginTop:5px">需求：{{myData.remark == ''?'无':myData.remark}}</div>
              </div>
          </div>
          <Row>
            <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
              <div slot="btn">
                <Button @click="changeType(1)" :type="btnType[0]">购买记录</Button>
                <Button @click="changeType(2)" :type="btnType[1]">地址管理</Button>
                <Button @click="changeType(3)" :type="btnType[2]">投诉记录</Button>
                <!--<DatePicker type="daterange" v-model="register_time" confirm :clearable="false" :editable="false" @on-ok="search" @on-clear="clear"></DatePicker>
                <span>共{{pageprops.total}}条</span>-->
              </div>
              <div class="count-box" v-show="type === 1 || type === 3">
                <Select v-model="buyType" v-show="type === 1" style="width: 150px;marginRight: 30px" @on-change="choseClass">
                  <Option :value="1">全部</Option>
                  <Option :value="2">我购买的</Option>
                  <Option :value="3">购买我的</Option>
                </Select>
                <p class="count-text">总计：{{myData.total}}</p>
              </div>
              <Table :columns="$data['columns'+type]" :data="list" border :loading="tableLoading"></Table>
            </table-container>
          </Row>
        </Col>
        <Col span="7">
          <Card>
            <div class="msg">
              <Tabs value="name1">
                <TabPane label="认证状态" name="name1">
                  <div class="tab-box">
                    <h2 class="tab-title">注册时间:</h2>
                    <p class="tab-info">{{myData.addtime}}</p>
                    <h2 class="tab-title">支付实名认证:</h2>
                    <p class="tab-info">{{myData.identity}}</p>
                    <h2 class="tab-title">认证通过时间:</h2>
                    <p class="tab-info">{{myData.identity_time}}</p>
                    <h2 class="tab-title">微信审核状态:</h2>
                    <p class="tab-info">{{myData.wechat_auth}}</p>
                    <h2 class="tab-title">认证通过时间:</h2>
                    <p class="tab-info">{{myData.wechat_auth_time}}</p>
                  </div>
                </TabPane>
                <TabPane label="个性化资料" name="name2">
                  <div class="tab-box">
                    <h2 class="tab-title">需求范围:</h2>
                    <p class="tab-info" v-if="('learn_range' in myData)" style="padding-top: 10px">年级段: {{myData.learn_range }}</p>
                    <p class="tab-info" v-if="('teach_range' in myData)" style="padding-top: 10px">年级段: {{myData.teach_range.join('，')}}</p>
                    <p class="tab-info" v-if="('learn_subject' in myData)">科目: {{myData.learn_subject}}</p>
                    <p class="tab-info" v-if="('teach_subject' in myData)">科目：{{myData.teach_subject.join('，')}}</p>
                    <p class="tab-info">教学特点: {{myData.tags}}</p>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </Col>
      </Row>
    </Modal>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
  </div>
</template>

<script>
export default {
  name: 'user-detail',
  props: {
    isParent: Boolean,
    default: ()=> true
  },
  data(){return {
    buyType: 1,
    columns1: [{
      title: '序号',
      key: 'id',
      align: 'center'
    }, {
      title: '用户ID',
      key: 'uid',
      align: 'center'
    }, {
      title: '联系人用户ID',
      key: 'to_uid',
      align: 'center'
    }, {
      title: '价格',
      key: 'money',
      align: 'center'
    }, {
      title: '时间',
      key: 'create_at',
      align: 'center'
    }, {
      title: '头像',
      key: 'money',
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
    }, {
      title: '姓名',
      key: 'head_name',
      align: 'center'
    }, {
      title: '联系方式',
      key: 'phone',
      align: 'center'
    }, {
      title: '购买',
      key: 'buy',
      align: 'center',
      render: (h, params)=>{
        let text = '';
        if(params.row.buy === 1){
          text = '购买的'
        }else{
          text = '被购买的'
        }
        return h('span', text);
      }
    },{
      title: '操作',
      key: 'opt',
      align: 'center',
      width: '90',
      render: (h, params)=>{
        return h('Button', {
          props: {
            type: 'success'
          },
          on:{
            click: ()=>{
              this.refundMoney(params.row);
            }
          }
        }, '退款');
      }
    }],
    columns2: [{
      title: '用户ID',
      key: 'uid',
      align: 'center'
    }, {
      title: '地址名称',
      key: 'geo_name',
      align: 'center'
    }, {
      title: '创建时间',
      key: 'create_at',
      align: 'center'
    }, {
      title: '是否默认地址',
      key: 'status',
      align: 'center',
      render(h,params){
        return h('span', params.row.status === 1?'是':'否')
      }
    }],
    columns3: [{
      title: '投诉人微信',
      key: 'to_wechat',
      align: 'center'
    },{
      title: '投诉人手机号',
      key: 'to_phone',
      align: 'center'
    },{
      title: '头像',
      key: 'portrait',
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
    }, {
      title: '投诉项',
      key: 'type',
      align: 'center'
    }, {
      title: '备注',
      key: 'remark',
      align: 'center'
    }, {
      title: '投诉图',
      key: 'img',
      align: 'center',
      render: (h, params)=>{
        if(params.row.img !== ''){
          return h('img',{
            style: {
              width: '50px',
              height: '60px'
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
        }else{
          return h('span', '无')
        }
      }
    }, {
      title: '投诉时间',
      key: 'create_at',
      align: 'center'
    }],
    if_show: false,
    tableLoading: false,
    myData: [],

    img_src: '',
    type: 1,
    pageprops: { //分页配置
      showSizer: true,
      total: 0,
    },
    fy: { //当前分页属性
      page: 1,
      size: 10
    },
    searchForm: {}, //搜索框属性
    my_search: {
      uid: '',
      class: ''
    },
    register_time: [],
    start_time: '',
    end_time: '',
    freeze: false,
    list: [],
    btnType: ['warning', 'info', 'info'],
    freeze:false,
  }},

  computed: {
    searchData() {
      return {
        type: this.type,
        /*start_time: this.start_time,
        end_time: this.end_time,*/
        uid: this.my_search.uid,
        class: this.buyType,

        ...this.fy,
      }
    },
  },
/*  watch: {
    searchData: function() {
      this.show()
    },
  },*/
  methods: {
    getTime(date, type) {
      // type:0 起始时间
      // type:1 终止时间
      if (!date) {
        return '';
      }
      let time = '';
      let Y = date.getFullYear();
      let M = date.getMonth() + 1;
      let D = date.getDate();
      time = type == 0 ? time + Y + '-' + M + '-' + D + ' ' + '00:00:00' : time + Y + '-' + M + '-' + D + ' ' + '23:59:59'
      return time;
    },

    forbidUser(a){
      this.axios.post('forbid',{
        openid:this.my_search.key,
        status:a
      }).then((res)=>{
        if (res.status == 1) {
          if (a) {
            this.$Message.info('封号成功')
          }else {
            this.$Message.info('解封成功')
          }
          this.show()
        }
      })
    },

    search() {
      this.start_time = this.getTime(this.register_time[0], 0);
      this.end_time = this.getTime(this.register_time[1], 1);
    },
    clear() {
      this.fy.page = 1;
      this.fy.size = 10;
      this.start_time = '';
      this.end_time = '';
    },
    refresh() {
      this.show();
    },
    pageChange(page) {
      this.fy.page = page;
      this.show()
    },
    pageSizeChange(size) {
      this.fy.size = size;
      this.show()
    },
    changeType(type) {
      this.fy = {
        page: 1,
        size: 10
      }

      this.btnType.forEach((item, index, arr) => {
        if (index == (type-1)) {
          arr[index] = 'warning'
        } else {
          arr[index] = 'info'
        }
      })
      this.type = type

      this.clear()
      this.show();
      this.register_time = []
    },
    choseClass(sign){
      this.show();
    },
    refundMoney(row){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认退款吗？</p>',
        onOk: () => {
          this.axios.post('contact-refund',{
            uid: row.uid,
            to_uid: row.to_uid,
            editor: ''
          }).then(d=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              this.show();
            }
          })
        }
      });
    },
    show(row) {
      if (row) {
        this.my_search.uid = row;
        this.buyType = 1;
        this.btnType.forEach((item, index, arr) => {
          if (index == (0)) {
            arr[index] = 'warning'
          } else {
            arr[index] = 'info'
          }
        });
        this.type = 1;
        this.clear();
      }
      let url = '';
      this.tableLoading = true;
      if(this.isParent){
        url = 'parent-panel'
      }else{
        url = 'tutor-panel'
      }
      this.axios.get(url, {
        params: this.searchData
      }).then(res => {
        if (res.status == 1) {
          this.tableLoading = false;
          this.myData = res.data.list;
          this.list = res.data.list.list;
          this.pageprops.total = res.data.list.total;
          this.if_show = true;
          this.freeze = res.data.list.status;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.user_tag {
    display: flex;
    justify-content: left;
    margin-bottom: 5px;
    .user_img {
        width: 80px;
        height: 80px;
        margin-right: 40px;
    }
    .money_msg {
        display: inline-block;
        span {
            font-size: 17px;
        }
        span:first-child {
            font-size: 20px;
            display: inline-block;
            margin-right: 50px;
        }
    }
}

.msg {
    text-align: center;

    p {
        text-align: left;
        margin-bottom: 40px;
        text-indent: 2px;
        font-size: 16px;
        line-height: 200%;
        .goRight {
            float: right;
        }
    }

    p:first-child {
        font-size: 20px;
        font-weight: bold;
        border-bottom: 2px solid #eee;
    }
}
  .tab-box{
    min-height: 300px;
    .tab-title{
      font-size: 16px;
      text-align: left;
    }
    .tab-info{
      margin-bottom: 10px;
    }
  }
  .count-box{
    display: flex;
    flex-direction: row;
    padding-bottom: 15px;
    .count-text{
      padding: 5px 20px 0 0;
    }
  }
</style>
