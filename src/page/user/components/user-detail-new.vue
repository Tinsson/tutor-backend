<template lang="html">
  <div class="user-detail">
    <Modal v-model="if_show" title="用户详情" width="1200" cancel-text>
      <Row :gutter='5'>
        <Col span="17">
          <div class="user_tag">
              <img class="user_img" :src="myData.portrait">
              <div class="money_msg">
                <div>
                  <span>姓名: {{myData.head_name}}</span>
                  <span>手机号:  {{myData.phone}} </span>
                </div>
                <div style="marginTop: 5px">
                  <span style="marginRight:50px">微信号:  {{myData.wechat}}</span>
                  <span>是否预约:  {{myData.is_order === 1?'是':'否'}}</span>
                </div>
                <div style="fontSize: 16px;marginTop:5px">需求：{{myData.remark == ''?'无':myData.remark}}</div>
              </div>
          </div>
          <div class="info-area">
            <ul>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">姓名</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.body_name}}</span>
                      <Input v-show="IsEdit" v-model="EditData.body_name" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">身份证</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.idcard}}</span>
                      <Input v-show="IsEdit" v-model="EditData.idcard" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">学历</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.idcard}}</span>
                      <Input v-show="IsEdit" v-model="EditData.idcard" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">手机号</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.phone}}</span>
                      <Input v-show="IsEdit" v-model="EditData.phone" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                </Row>
              </li>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">客户类型</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{EditData.role}}</span>
                      <Select v-show="IsEdit" v-model="EditData.role" :style="{width: IptWidth}">
                        <Option :value="1">家长</Option>
                        <Option :value="2">家教</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">年级段</p>
                    <p class="value" v-if="role === 1">
                      <span v-show="!IsEdit">{{myData.learn_range}}</span>
                      <Select v-model="EditData.learn_range" :style="{width: IptWidth}">
                        <Option v-for="item in range_list" :value="item.id" :key="item.id">{{ item.label }}</Option>
                      </Select>
                    </p>
                    <p class="value" v-if="role === 2">
                      <span v-show="!IsEdit">{{myData.teach_range.join('，')}}</span>
                      <Select v-model="EditData.teach_range" :style="{width: IptWidth}">
                        <Option v-for="item in range_list" :value="item.id" :key="item.id">{{ item.label }}</Option>
                      </Select>
                    </p>
                  </Col>
                </Row>
              </li>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">生日</p>
                    <p class="value">
                      <span>{{myData.birth}}</span>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">年龄</p>
                    <p class="value">
                      <span>{{myData.age}}</span>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">性别</p>
                    <p class="value">
                      <span>{{myData.idcard}}</span>
                    </p>
                  </Col>
                </Row>
              </li>
            </ul>
          </div>
          <table-container title="地址管理">
            <Table :columns="columns2" :data="address" border :loading="tableLoading"></Table>
          </table-container>
          <!--<Row>
            <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
              <div slot="btn">
                <Button @click="changeType(1)" :type="btnType[0]">购买记录</Button>
                <Button @click="changeType(2)" :type="btnType[1]">地址管理</Button>
                &lt;!&ndash;<Button @click="changeType(3)" :type="btnType[2]">投诉记录</Button>&ndash;&gt;
                &lt;!&ndash;<DatePicker type="daterange" v-model="register_time" confirm :clearable="false" :editable="false" @on-ok="search" @on-clear="clear"></DatePicker>
                <span>共{{pageprops.total}}条</span>&ndash;&gt;
              </div>
              <div class="count-box" v-show="type === 1 || type === 3">
                <Select v-model="buyType" v-show="type === 1" style="width: 150px;marginRight: 30px" @on-change="choseClass">
                  <Option :value="1">全部</Option>
                  <Option :value="2">我购买的</Option>
                  <Option :value="3">购买我的</Option>
                </Select>
                <p class="count-text">总计：{{myData.total}}</p>
              </div>
              <Table :columns="columns1" :data="list" border :loading="tableLoading"></Table>
            </table-container>
          </Row>-->
        </Col>
        <Col span="7">
          <Card>
            <div class="msg">
              <Tabs value="name1">
                <TabPane label="基本信息" name="name1">
                  <div class="tab-box half">
                    <div class="inner-wrap">
                      <div class="half-box all">
                        <h2 class="tab-title">注册:</h2>
                        <p class="tab-info">{{myData.addtime}}</p>
                      </div>
                      <div class="half-box">
                        <h2 class="tab-title">实名认证:</h2>
                        <p class="tab-info">{{myData.identity}}</p>
                      </div>
                      <div class="half-box">
                        <h2 class="tab-title">通过时间:</h2>
                        <p class="tab-info">{{myData.identity_time}}</p>
                      </div>
                      <div class="half-box">
                        <h2 class="tab-title">微信审核:</h2>
                        <p class="tab-info">{{myData.wechat_auth}}</p>
                      </div>
                      <div class="half-box">
                        <h2 class="tab-title">通过时间:</h2>
                        <p class="tab-info">{{myData.wechat_auth_time}}</p>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="购买记录" name="name2">
                  <div class="tab-box record">
                    <div class="record-box">
                      <Table :columns="columns1" :data="contact" border :loading="tableLoading"></Table>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="个性化资料" name="name3">
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
      <div slot="footer" class="footer-box">
        <div class="left-box">
          <Button type="info" v-show="!IsEdit" @click="editStart">修改</Button>
          <Button type="warning" @click="editCancel">取消</Button>
          <Button type="primary" v-show="IsEdit" @click="editSave">保存</Button>
        </div>
        <div class="right-box">
          <!--<Button type="success" @click="transRole">切换身份</Button>-->
        </div>
      </div>
    </Modal>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
  </div>
</template>

<script>
export default {
  name: 'user-detail',
  props: {
    isParent: {
      type: Boolean,
      default: ()=> true
    },
    role: {
      type: Number
    }
  },
  data(){return {
    IsEdit: false,
    buyType: 1,
    IptWidth: '160px',
    range_list: [{
      id: 1,
      label: ''
    }],
    EditData: {
      body_name: '',
      idcard: '',
      age: '',
      sex: '',
      birth: '',
      type: '',
      edu: '',
      wechat_qrcode: '',
      learn_range: '',
      teach_range: '',
    },
    columns1: [/*{
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
      title: '时间',
      key: 'create_at',
      align: 'center'
    },{
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
    },*/ {
      title: '联系方式',
      key: 'phone',
      align: 'center'
    }, {
      title: '购买',
      key: 'buy',
      width: '65',
      align: 'center',
      render: (h, params)=>{
        let text = '',
            color = '';
        if(params.row.buy === 1){
          text = '购买的';
          color = 'red';
        }else{
          text = '被购买的';
          color = 'green'
        }
        return h('span',{
          style:{
            color
          }
        }, text);
      }
    },{
      title: '价格',
      key: 'money',
      width: '65',
      align: 'center'
    },{
      title:  '状态',
      key: 'status',
      width: '65',
      align: 'center'
    },/*{
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
    }*/],
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
    address: [],
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
    contact: [],
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

    editStart(){
      this.IsEdit = true;
    },

    editSave(){

    },

    editCancel(){
      this.IsEdit = false;
    },

    transRole(){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认切换身份吗？</p>',
        onOk: () => {
          this.axios.post('trans-role',{
            role: this.role,
            uid: this.my_search.uid
          }).then(d=>{
            if(d){
              this.$Message.success(d.message);
              this.getData();
            }
          })
        }
      });
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
        border-radius: 50%;
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

  .tab-box{
    min-height: 300px;
    /*&.record{
      overflow-x: auto;
      .record-box{
        width: 600px;
      }
    }*/
    .inner-wrap{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .half-box{
      width: 50%;
      padding-bottom: 20px;
      &.all{
        width: 100%;
      }
      .tab-title{
        font-size: 14px;
        text-align: left;
      }
      .tab-info{
        font-size: 13px;
      }
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
.info-area{
  padding: 0 30px;
  .single-line{
    padding-top: 10px;
    border-bottom: 1px solid #eee;
    .label{
      font-size: 18px;
      line-height: 25px;
    }
    .cross{
      display: flex;
      flex-direction: row;
    }
    .value{
      font-size: 12px;
      min-height: 45px;
      line-height: 45px;
      .line{
        line-height: 25px;
      }
      .num{
        font-size: 16px;
        color: #f74c17;
      }
      &.long{
        padding: 5px 0;
      }
    }
  }
}
  .footer-box{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
