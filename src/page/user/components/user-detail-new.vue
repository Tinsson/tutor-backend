<template lang="html">
  <div class="user-detail">
    <Modal class="all-modal" v-model="if_show" @on-cancel="hidePanel" :title="`用户面板（${myData.nickname}）`" width="1300" cancel-text>
      <Row :gutter='5'>
        <Col span="16">
          <div class="info-area">
            <ul>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">姓名</p>
                    <p class="value">
                      <span class="copy-txt copy-name" :data-clipboard-text="myData.body_name" @click="copyTxt($event)" v-show="!IsEdit">{{myData.body_name}}</span>
                      <Input v-show="IsEdit" v-model="EditData.body_name" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">身份证</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.show_idcard}}</span>
                      <Input v-show="IsEdit" v-model="EditData.idcard" :style="{width: IptWidth}"/>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">手机号</p>
                    <p class="value">
                      <span class="copy-txt copy-phone" :data-clipboard-text="myData.phone" @click="copyTxt($event)" v-show="!IsEdit">{{myData.phone}}</span>
                      <Input v-show="IsEdit" v-model="EditData.phone" :style="{width: IptWidth}"/>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">客户角色</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.role === 1?'家长':'家教'}}</span>
                      <Select v-show="IsEdit" :transfer="true" v-model="EditData.role" :style="{width: IptWidth}" @on-change="RoleChange">
                        <Option :value="1">家长</Option>
                        <Option :value="2">家教</Option>
                      </Select>
                    </p>
                  </Col>
                </Row>
              </li>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">客户状态</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{levelText}}</span>
                      <Select v-show="IsEdit" v-model="EditData.level" :style="{width: IptWidth}">
                        <Option value="A">授课中</Option>
                        <Option value="B">暂不需要</Option>
                        <Option value="D">寻找中</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">所属助教</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.assistant_name}}</span>
                      <Select v-show="IsEdit" v-model="EditData.assistant" :style="{width: IptWidth}">
                        <Option v-for="(item, index) in myData.ass_list" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">是否会员</p>
                    <p class="value">
                      <span>{{myData.is_vip == 1?'是':'否'}}</span>
                    </p>
                  </Col>
                  <!--<Col span="6">
                    <p class="label">{{role == 1?'教学要求': '自我介绍'}}</p>
                    <p class="value">
                      <span>{{myData.introduce}}</span>
                    </p>
                  </Col>-->
                </Row>
              </li>
              <li class="single-line" v-if="role === 2">
                <Row>
                  <Col span="6">
                    <p class="label">学校</p>
                    <p class="value">
                      <span v-show="!IsEdit" class="copy-txt copy-school" :data-clipboard-text="myData.school" @click="copyTxt($event)">{{myData.school}}</span>
                      <Input v-show="IsEdit" v-model="EditData.school" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">学历</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.diploma}}</span>
                      <Input v-show="IsEdit" v-model="EditData.diploma" :style="{width: IptWidth}"></Input>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">专业</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.professional}}</span>
                      <Input v-show="IsEdit" v-model="EditData.professional" :style="{width: IptWidth}"/>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">入学情况</p>
                    <p class="value">
                      <span>{{myData.edu_now}}</span>
                    </p>
                  </Col>
                </Row>
              </li>
              <li class="single-line">
                <Row>
                  <Col span="6">
                    <p class="label">年级段</p>
                    <p class="value" v-if="role === 1">
                      <span v-show="!IsEdit">{{myData.learn_range}}</span>
                      <Select v-show="IsEdit" v-model="EditData.learn_range_id" :style="{width: IptWidth}">
                        <Option v-for="(item, index) in need_list.teach_range" :value="index" :key="index">{{ item }}</Option>
                      </Select>
                    </p>
                    <p class="value" v-if="role === 2">
                      <span v-show="!IsEdit">{{myData.teach_range !== undefined?myData.teach_range.join(','):''}}</span>
                      <Select v-show="IsEdit" multiple v-model="EditData.teach_range_id" :style="{width: IptWidth}">
                        <Option v-for="(item, index) in need_list.teach_range" :value="index" :key="index">{{ item }}</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">科目</p>
                    <p v-if="role === 1" class="value">
                      <span v-show="!IsEdit">{{myData.learn_subject}}</span>
                      <Select v-show="IsEdit" v-model="EditData.learn_subject_id" :style="{width: IptWidth}">
                        <Option v-for="(item, index) in need_list.teach_subject" :value="index" :key="index">{{ item }}</Option>
                      </Select>
                    </p>
                    <p v-if="role === 2" class="value">
                      <span v-show="!IsEdit">{{myData.teach_subject !== undefined?myData.teach_subject.join(','): ''}}</span>
                      <Select v-show="IsEdit" multiple v-model="EditData.teach_subject_id" :style="{width: IptWidth}">
                        <Option v-for="(item, index) in need_list.teach_subject" :value="index" :key="index">{{ item }}</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">来源渠道</p>
                    <p class="value">{{myData.resource}}</p>
                  </Col>
                  <Col span="6">
                    <p class="label">城市</p>
                    <p class="value">
                      <span>{{myData.city}}</span>
                    </p>
                  </Col>
                  <!--<Col span="6">
                    <p class="label">教学特点</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.tags}}</span>
                      <Select v-show="IsEdit" multiple v-model="EditData.tags_arr" :style="{width: IptWidth}">
                        <Option v-for="(item, index) in need_list.tags" :value="index" :key="index">{{ item }}</Option>
                      </Select>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">需求备注</p>
                    <p class="value">
                      <span v-show="!IsEdit">{{myData.remark}}</span>
                      <Input v-show="IsEdit" v-model="EditData.remark" :style="{width: IptWidth}"/>
                    </p>
                  </Col>-->
                </Row>
              </li>
              <li class="single-line fix-line">
                <Row>
                  <Col span="6">
                    <p class="label">生日</p>
                    <p class="value">
                      <span>{{myData.birthday}}</span>
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
                      <span>{{sexTxt}}</span>
                    </p>
                  </Col>
                  <Col span="6">
                    <p class="label">地址</p>
                    <p class="value">
                      <span>{{myData.geo_name}}</span>
                    </p>
                  </Col>
                </Row>
              </li>
            </ul>
          </div>
          <Row>
            <Col span="12" v-if="role == 2">
              <div class="wx-qrcode">
                <p class="label">个人照片</p>
                <div class="pic-box">
                  <span v-if="('photo_list' in myData) && myData.photo_list.length == 0">暂无</span>
                  <div v-else>
                    <img v-for="item in myData.photo_list" class="qr-pic" @click="picDetails(item.url)" :src="item.url" alt="">
                  </div>
                </div>
              </div>
            </Col>
            <!--<Col span="8">
              <div class="wx-qrcode">
                <p class="label">微信二维码</p>
                <div class="pic-box">
                  <img v-if="wxQrcode !== ''" class="qr-pic" :src="wxQrcode" alt="">
                  <span v-if="wxQrcode === ''">暂无</span>
                </div>
                <div v-show="IsEdit" class="btn-box">
                  <Upload class="upload-btn" :before-upload="HandleQrcode" action="http://tutor.pgyxwd.com/backend/Auth/adminUserUppwd">
                    <Button type="ghost" size="large" icon="ios-cloud-upload-outline">上传图片</Button>
                  </Upload>
                </div>
              </div>
            </Col>
            <Col span="8">
              <div class="wx-qrcode">
                <p class="label">微信号</p>
                <div class="pic-box">
                  <span v-show="!IsEdit" class="copy-txt copy-wechat" :data-clipboard-text="myData.wechat" @click="copyTxt($event)">{{myData.wechat}}</span>
                  <Input v-show="IsEdit" v-model="EditData.wechat" :style="{width: IptWidth}"></Input>
                </div>
              </div>
            </Col>
            <Col span="8">
              <div class="wx-qrcode" v-if="role == 2">
                <p class="label">学历认证图</p>
                <div class="pic-box">
                  <img v-if="eduAuth !== ''" class="qr-pic" :src="eduAuth" alt="">
                  <span v-if="eduAuth === ''">暂无</span>
                </div>
                <div v-show="IsEdit" class="btn-box">
                  <Upload class="upload-btn" :before-upload="HandleEdu" action="http://tutor.pgyxwd.com/backend/Auth/adminUserUppwd">
                    <Button type="ghost" size="large" icon="ios-cloud-upload-outline">上传图片</Button>
                  </Upload>
                </div>
              </div>
            </Col>-->
          </Row>
        </Col>
        <Col span="8">
          <Card>
            <div class="msg">
              <Tabs>
                <TabPane label="基本信息" name="name1">
                  <div class="tab-box half">
                    <div class="inner-wrap">
                      <div class="half-box first">
                        <img class="user_img" @click="picDetails(myData.portrait)" :src="myData.portrait">
                      </div>
                      <div class="half-box first">
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
                      <div class="half-box" v-if="role == 2">
                        <h2 class="tab-title">学历认证:</h2>
                        <p class="tab-info">{{myData.education}}</p>
                      </div>
                      <div class="half-box" v-if="role == 2">
                        <h2 class="tab-title">通过时间:</h2>
                        <p class="tab-info">{{myData.education_time}}</p>
                      </div>
                      <div class="half-box">
                        <h2 class="tab-title">设备:</h2>
                        <p class="tab-info">{{myData.device}}</p>
                      </div>
                      <div class="half-box">
                        <h2 class="tab-title">最近登录时间:</h2>
                        <p class="tab-info">{{myData.logintime}}</p>
                      </div>
                      <div class="half-box" v-if="role == 2">
                        <h2 class="tab-title">补习价格:</h2>
                        <p class="tab-info">{{myData.price}}</p>
                      </div>
                      <!--<div class="half-box" v-if="role == 2">
                        <h2 class="tab-title">语音介绍:</h2>
                        <p class="tab-info">
                          <span v-if="myData.introduce_voice == ''">暂无</span>
                          <audio v-else controls :src="myData.introduce_voice"></audio>
                        </p>
                      </div>-->
                    </div>
                    <div class="remark-box">
                      <h2 class="tab-title">备注：</h2>
                      <div class="content-box">
                        <p class="content-txt" v-if="myData.remark || myData.quick_remark">
                          <Tag type="border" v-for="(item, index) in quickRemark" :key="index" color="blue">{{item}}</Tag>
                          <Tag type="border" color="red" v-if="myData.remark">{{myData.remark}}</Tag>
                        </p>
                        <p class="content-txt" v-else>暂无</p>
                        <!--<Input type="textarea" style="width: 260px;" v-model="remark" v-if="remark_status" />-->
                        <div class="remark-btn">
                          <Button type="primary" @click="remarkEdit">修改</Button>
                          <!--<Button type="success" v-if="remark_status" @click="remarkSave">保存</Button>
                          <Button type="error" v-if="remark_status" @click="remarkCancel">取消</Button>-->
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <!--<TabPane label="备注管理" name="name2">
                  <Table :columns="remarkCol" :data="remarkData" border></Table>
                </TabPane>-->
                <TabPane :label="orderTitle" name="name3">
                  <Table :columns="orderCol" :data="orderData" border></Table>
                </TabPane>
                <TabPane label="课程安排" name="name4">
                  <div class="time-out">
                    <div class="time-line">
                      <div class="label1">星期</div>
                      <div class="part-box">
                        <div class="part" v-for="item in week" :key="item">{{item}}</div>
                      </div>
                    </div>
                    <div class="time-line">
                      <div class="label1">上午</div>
                      <div class="part-box">
                        <div class="part" :class="[item]" v-for="(item, index) in am" :key="index">
                          <img class="icon" src="../../../assets/images/time_chose.png" />
                        </div>
                      </div>
                    </div>
                    <div class="time-line">
                      <div class="label1">下午</div>
                      <div class="part-box">
                        <div class="part" :class="[item]" v-for="(item, index) in pm" :key="index">
                          <img class="icon" src="../../../assets/images/time_chose.png" />
                        </div>
                      </div>
                    </div>
                    <div class="time-line last">
                      <div class="label1">晚上</div>
                      <div class="part-box">
                        <div class="part" :class="[item]" v-for="(item, index) in night" :key="index">
                          <img class="icon" src="../../../assets/images/time_chose.png" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="time-other">
                    <div class="other-line">
                      <div class="label1">备注</div>
                    </div>
                    <div class="val-ipt" style="height: 120px;overflow: auto">{{myData.time_remark}}</div>
                  </div>
                </TabPane>
                <!--<TabPane label="联系记录" name="name2">
                  <div class="tab-box record">
                    <div class="record-box">
                      <Table :columns="columns1" :data="contact" border></Table>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="收藏列表" name="name4">
                  <div class="tab-box record">
                    <div class="record-box">
                      <Table :columns="followCol" :data="followData" border></Table>
                    </div>
                  </div>
                </TabPane>-->
                <!--<TabPane label="地址管理" name="name4">
                  <Table :columns="columns2" :data="address" border></Table>
                </TabPane>-->
              </Tabs>
            </div>
          </Card>
        </Col>
      </Row>
      <div slot="footer" class="footer-box">
        <div class="left-box">
          <Button type="info" v-show="!IsEdit" @click="editStart">修改</Button>
          <Button type="warning" v-show="IsEdit" @click="editCancel">取消</Button>
          <Button type="primary" v-show="IsEdit" @click="editSave">保存</Button>
          <Button type="success" @click="openUserList">查看能见用户</Button>
          <Button type="primary" @click="addNewOrder">新增订单</Button>
        </div>
        <div class="right-box">
          <Button type="ghost" @click="refresh">刷新</Button>
          <!--<Button type="success" @click="transRole">切换身份</Button>-->
        </div>
      </div>
    </Modal>
    <remark-modal ref="remark_modal" @subOver="show"></remark-modal>
    <big-pic ref="bigPic" :maxWidth="500"></big-pic>
    <order-modal ref="order_modal" @subOver="show"></order-modal>
  </div>
</template>

<script>
  import orderModal from './order-modal'
  import {copyObj} from '@/utils/common'
  import ClipBoard from 'clipboard'

export default {
  name: 'user-detail',
  components: {
    orderModal
  },
  props: {
    isParent: {
      type: Boolean,
      default: ()=> true
    }
  },
  data(){return {
    week: ['一', '二', '三', '四', '五', '六', '日'],
    am: [],
    pm: [],
    night: [],
    role: 1,
    city: '',
    IsEdit: false,
    buyType: 1,
    IptWidth: '160px',
    range_list: [{
      id: 1,
      label: ''
    }],
    EditData: {
      assistant: '',
      body_name: '',
      idcard: '',
      phone: '',
      role: '',
      school: '',
      diploma: '',
      level: '',
      professional: '',
      wechat: '',
      wechat_qrcode: '',
      learn_range_id: '',
      teach_range_id: [],
      learn_subject_id: '',
      teach_subject_id: [],
      qrcode: '',
      long_qrcode: '',
      tags_arr: [],
      remark: ''
    },
    columns1: [{
      title: '联系方式',
      key: 'phone',
      align: 'center'
    }, {
      title: '联系情况',
      key: 'buy',
      width: '65',
      align: 'center',
      render: (h, params)=>{
        let text = '',
            color = '';
        if(params.row.buy === 1){
          text = '我联系的';
          color = 'red';
        }else{
          text = '联系我的';
          color = 'green'
        }
        return h('span',{
          style:{
            color
          }
        }, text);
      }
    },{
      title: '姓名',
      key: 'head_name',
      width: '65',
      align: 'center'
    }],
    columns2: [{
      title: '地址名称',
      key: 'geo_name',
      align: 'center'
    }, {
      title: '是否默认地址',
      key: 'status',
      align: 'center',
      render(h,params){
        return h('span', params.row.status === 1?'是':'否')
      }
    }, {
      title: '创建时间',
      key: 'create_at',
      align: 'center'
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
    remarkCol: [{
      title: '信息'
    }],
    remarkData: [],
    orderCol: [{
      title: '家长姓名',
      key: 'learn_name',
      align: 'center',
      renderHeader: (h, params)=>{
        let txt = '家长姓名',
            role = this.role;
        if(role == 1){
          txt = '家教姓名'
        }
        return h('span', txt);
      },
      render: (h, params)=>{
        let role = this.role;
        if(role == 1){
          return h("span", params.row.tutor_name);
        }else{
          return h("span", params.row.learn_name);
        }
      }
    },{
      title: '预付款总课时',
      key: 'class_hour',
      align: 'center'
    },/*{
      title: '支付状态',
      key: 'status',
      align: 'center',
      render: (h, params)=>{
        let txt = '';
        switch (params.row.status){
          case 0:
            txt = '待支付';
            break;
          case 1:
            txt = '已支付';
            break;
          case 2:
            txt = '支付失败';
            break;
          case 3:
            txt = '退款';
            break;
          case 4:
            txt = '家教已支付';
            break;
          case 5:
            txt = '家长已支付';
            break;
          case 6:
            txt = '作废';
            break;
        }
        return h('span', txt);
      }
    },*/{
      title: '时间',
      key: 'create_at',
      align: 'center',
      width: 100
    }/*,{
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (h, params)=>{
        if(params.row.status == 0){
          return h('Button', {
            props: {
              type: 'warning'
            },
            on: {
              click: ()=>{
                this.delOrder(params.row.order_sn);
              }
            }
          },'作废')
        }else{
          return h('span', '无')
        }
      }
    }*/],
    orderData: [],
    followCol: [{
      title: '姓名',
      key: 'to_name',
      align: 'center'
    },{
      title: '手机号',
      key: 'phone',
      align: 'center'
    },{
      title: '创建时间',
      key: 'create_at',
      align: 'center'
    }],
    followData: [],
    if_show: false,
    tableLoading: false,
    myData: {
      teach_subject: [],
      teach_range: []
    },

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
    long_qrcode: '',
    need_list: {
      tags: [],
      teach_range: [],
      teach_subject: []
    },
    remark_status: false,
    remark: '',
    edu_pic: ''
  }},

  created(){

    this.axios.get('need-config').then((res)=>{
      if(res.status === 1){
        let list = res.data.list;
        Object.assign(this.need_list, list);
      }
    })
  },

  watch: {
    myData(val){
      console.log(val);
      console.log(this.myData.teach_range)
    }
  },

  computed: {
    orderTitle(){
      if(this.role == 2){
        return '预付款记录';
      }else{
        return '购买记录';
      }
    },
    searchData() {
      return {
        type: this.type,
        uid: this.my_search.uid,
        class: this.buyType,

        ...this.fy,
      }
    },
    wxQrcode(){
      if(this.IsEdit){
        return this.EditData.long_qrcode;
      }else{
        return this.long_qrcode;
      }
    },
    eduAuth(){
      if(this.IsEdit){
        return this.edu_pic;
      }else{
        return this.myData.xl_url;
      }
    },
    sexTxt(){
      if(this.myData.sex === 1){
        return '男'
      }else if(this.myData.sex === 2){
        return '女'
      }else{
        return ''
      }
    },
    quickRemark(){
      let tags = []
      if(this.myData.quick_remark){
        tags = this.myData.quick_remark.split(',');
      }
      return tags;
    },

    levelText(){
      let level = this.myData.level,
          txt = '';
      switch(level){
        case 'A':
          txt = '授课中';
          break;
        case 'B':
          txt = '暂不需要';
          break;
        case 'D':
          txt = '寻找中';
          break;
      }
      return txt;
    }
  },
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

    HandleQrcode(file){
      this.$uploadPic(file, 'qrcode').then(res=>{
        this.EditData.long_qrcode = res.base64;
        this.EditData.qrcode = res.short_pic;
      });
      return false;
    },

    HandleEdu(file){
      let reader = new FileReader(),
          that = this;
      this.edu_file = file;
      reader.readAsDataURL(file);
      reader.onload = function(e){
        let res = e.target.result;
        that.edu_pic = res;
      };
      return false;
    },

    editStart(){
      let info = this.myData;
      this.EditData.qrcode = info.qrcode;
      Object.keys(this.EditData).forEach(label=>{
        let value = info[label];
        if(label in info && value !== undefined){
          if(label === 'learn_range_id' || label === "learn_subject_id"){
            value = parseInt(value);
          }
          if(label === 'teach_range_id' || label === "teach_subject_id"){
            if(info[label] !== "" && info[label] !== undefined){
              value = info[label].split(',').map(val=>{
                return parseInt(val);
              })
            }else{
              value = []
            }
          }
          this.$set(this.EditData, label, value);
        }
        /*if(label === 'tags_arr'){
          if(info.tags === ""){
            value = []
          }else{
            value = info.tags.split(',').map(val=>{
              return this.need_list.tags.indexOf(val);
            });
          }
          this.$set(this.EditData, label, value);
        }*/
      });
      this.IsEdit = true;
    },

    editSave(){
      /*let tags = this.EditData.tags_arr.map(val=>{
        return this.need_list.tags[val]
      }).join(",");*/
      console.log(this.EditData);
      let params = copyObj(this.EditData),
          formData = new FormData();
      console.log(params);
      //params.tags = tags;
      params.uid = this.my_search.uid;
      if(params.role === 1){
        params.range = params.learn_range_id;
        params.subject = params.learn_subject_id;
      }else if(params.role === 2 ){
        if("teach_range_id" in params && "teach_subject_id" in params){
          params.range = params.teach_range_id.join(',');
          params.subject = params.teach_subject_id.join(',');
        }
        params.range = '';
        params.subject = '';
      }
      Object.keys(params).forEach(label=>{
        formData.append(label, params[label]);
      });

      if(this.edu_file){
        formData.append('file', this.edu_file);
      }

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      this.axios.post('edit-user', formData, config).then(d=>{
        if(d.status === 1){
          this.$Message.success(d.message);
          this.editCancel();
          this.show();
          //this.if_show = false;
          this.$emit('save-over');
        }
      })
    },

    editCancel(){
      this.IsEdit = false;
    },

    RoleChange(type){
      console.log(type);
      this.role = type;
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

    //作废订单
    delOrder(order_sn){
      console.log(order_sn);
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认作废此订单吗？</p>',
        onOk: ()=>{
          this.axios.post('del-order',{
            order_sn
          }).then(d=>{
            if(d){
              this.$Message.success(d.message);
              this.show();
            }
          })
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
      this.show().then(d=>{
        this.$Message.success('刷新成功！');
      });
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
    hidePanel(){
      this.IsEdit = false;
      Object.keys(this.EditData).forEach(val=>{
        if(val === "tags_arr"){
          this.EditData[val] = []
        }else{
          if(this.role === 2){
            if(val === 'teach_range_id' || val === "teach_subject_id"){
              this.EditData[val] = []
            }
          }
          this.EditData[val] = ""
        }
      });
      this.remark_status = false;
    },
    remarkEdit(){
      let quick_remark = [];
      if(this.myData.quick_remark){
        quick_remark = this.myData.quick_remark.split(',');
      }
      let remark_data = {
        quick_remark,
        remark: this.myData.remark,
        uid: this.my_search.uid
      };
      this.$refs['remark_modal'].show(this.role, remark_data);
      //this.remark = this.myData.remark;
      //this.remark_status = true;
    },
    remarkSave(){
      this.axios.post('edit-remark', {
        uid: this.my_search.uid,
        remark: this.remark
      }).then(d=>{
        this.$Message.success(d.message);
        this.remark_status = false;
        this.show();
      })
    },
    remarkCancel(){
      this.remark_status = false;
    },
    openUserList(){
      window.open('#/user/parent-list?front_uid='+this.my_search.uid);
    },
    addNewOrder(){
      this.$refs['order_modal'].show(this.myData, this.role);
    },
    copyTxt(e){
      let clip = new ClipBoard(`.${e.target.classList[1]}`);
      let word = this.$copyWords;
      let that = this;
      let rand = Math.random();
      if(rand > 0.01){
        word = '复制成功！！！';
      }
      clip.on('success', e=>{
        that.$Message.success(word);
        clip.destroy();
      })
      clip.on('error', e=>{
        that.$Message.error('不支持复制，垃圾电脑，毁我青春！');
        clip.destroy();
      })
    },

    picDetails(img){
      this.$refs['bigPic'].show(img);
    },

    initClass(){
      let class_list = this.myData.class_list,
          am = this.am,
          pm = this.pm,
          night = this.night;
      if (class_list.length > 0) {
        class_list.forEach(val => {
          if (val.am === 1) {
            this.$set(am, val.day - 1, "cur");
          } else {
            this.$set(am, val.day - 1, "");
          }
          if (val.pm === 1) {
            this.$set(pm, val.day - 1, "cur");
          } else {
            this.$set(pm, val.day - 1, "");
          }
          if (val.night === 1) {
            this.$set(night, val.day - 1, "cur");
          } else {
            this.$set(night, val.day - 1, "");
          }
        })
      }
    },

    show(row, city, role) {

      if (row && role) {
        this.my_search.uid = row;
        this.buyType = 1;
        //this.city = city;
        this.type = 1;
        this.clear();
        this.url = 'tutor-panel'
        if(role === 1){
          this.url = 'parent-panel'
        }
      }


      this.tableLoading = true;
      return new Promise( resolve=>{
        this.axios.get(this.url, {
          params: this.searchData
        }).then(res => {
          if (res.status == 1) {
            let info = res.data.list;
            this.long_qrcode = info.long_qrcode;

            this.tableLoading = false;
            this.myData = info;
            this.orderData = info.server;
            //this.contact = info.contact.list;
            //this.address = info.address;
            //this.followData = info.favorite;
            this.if_show = true;
            this.edu_pic = this.myData.xl_url;
            this.role = info.role;
            this.initClass();
            resolve();
          }
        })
      })

    },
  }
}
</script>

<style lang="scss" scoped>
  .copy-txt{
    color: dodgerblue;
    cursor: pointer;
  }
.user_img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
}
.user_tag {
    display: flex;
    justify-content: left;
    margin-bottom: 5px;
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
      &.first{
        padding: 0;
      }
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
    &.fix-line{

    }
    .label{
      font-size: 16px;
      line-height: 25px;
    }
    .cross{
      display: flex;
      flex-direction: row;
    }
    .value{
      font-size: 12px;
      min-height: 45px;
      line-height: 20px;
      padding: 15px 0;
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

  .wx-qrcode{
    padding-top: 10px;
    padding-left: 30px;
    .label{
      font-size: 16px;
      line-height: 25px;
    }
    .pic-box{
      padding-top: 10px;
      .qr-pic{
        width: 150px;
        margin-right: 10px;
      }
    }
    .btn-box{
      padding-top: 20px;
    }
  }
  .remark-box{
    display: flex;
    flex-direction: row;
    .tab-title{
      font-size: 16px;
    }
    .content-txt{
      padding-top: 2px;
    }
    .remark-btn{
      padding-top: 10px;
    }
    .content-box{
      width: 300px;
    }
  }


  .time-out{
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 14px;
    border-bottom: 1px solid #e9e9e9;
  }
  .time-out .time-line{
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px dashed #d3d3d3;
    display: flex;
    flex-direction: row;
  }
  .time-out .time-line.last{
    border: none;
  }
  .time-out .time-line .label1{
    width: 50px;
  }
  .time-out .time-line .part-box{
    width: 300px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .time-out .time-line .part-box .part{
    position: relative;
    width: 42px;
    height: 50px;
    color: #6b6b6b;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .time-out .part .icon{
    width: 16px;
    height: 16px;
    opacity: 0;
  }
  .time-out .part.cur .icon{
    opacity: 1;
  }
  .time-other{
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px 0;
    font-size: 15px;
  }
  .time-other .val-ipt{
    width: 100%;
    height: 50px;
    margin-top: 10px;
  }
</style>
