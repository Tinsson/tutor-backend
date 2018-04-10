<template>
  <div id="userDetail">
    <Modal v-model="if_show" title="用户详情12" width="1200px" class-name="no-auto">
      <div class="user-detail-container">
        <div class="left">
          <table-card :columns="cardColumns" :data="cardData" @change="card_change"></table-card>
          <table-container page :pageprops="pageprops" @on-change="pageChange" @on-page-size-change="pageSizeChange">
            <Table height="300" :columns="$data['columns'+table_type]" :data="myData" :loading="tableLoading"></Table>
          </table-container>
          <Spin size="large" fix v-if="left_loading"></Spin>
        </div>
        <div class="right">
          <Tabs>
            <TabPane label="个人资料122">
              <div class="tab-container">
                <div class="input-group">
                  <div class="label">
                    头像:
                  </div>
                  <div class="content">
                    <div class="photo background-contain" :style="'background-image:url('+user_info_form.portrait+')'" @click="showImg">

                    </div>
                    <my-upload v-if="edit_user_info" @success="upload_success"></my-upload>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    昵称:
                  </div>
                  <div class="content">
                    <div class="text" v-if="!edit_user_info">
                      {{user_info_form.nick_name}}
                    </div>
                    <div v-else>
                      <Input v-model="user_info_form.nick_name"></Input>
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    手机号
                  </div>
                  <div class="content">
                    <div class="text" v-if="!edit_user_info">
                      {{user_info_form.mobile}}
                    </div>
                    <div v-else>
                      <Input v-model="user_info_form.mobile"></Input>
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    性别
                  </div>
                  <div class="content">
                    <div class="text"  v-if="!edit_user_info">
                      {{user_sex}}
                    </div>
                    <div v-else>
                      <Select v-model="user_info_form.sex">
                        <Option :value="0">未知</Option>
                        <Option :value="1">男</Option>
                        <Option :value="2">女</Option>
                      </Select>
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    是否黑名单
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.status==1?'否':'是'}}
                    </div>
                    <!-- <div v-else>
                      <Select v-model="user_info_form.status">
                        <Option :value="1">否</Option>
                        <Option :value="2">是</Option>
                      </Select>
                    </div> -->
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    用户id
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.uuid}}
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    微信授权
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.is_bind_wx==0?'否':'是'}}
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    认证状态
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.is_cert==0?'否':'是'}}
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    注册时间
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.created_at}}
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    充值状态
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.is_recharge==0?'否':'是'}}
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="label">
                    首充时间
                  </div>
                  <div class="content">
                    <div class="text">
                      {{user_detail.recharge_at}}
                    </div>
                  </div>
                </div>
                <div style="margin-top:20px;text-align:right">
                  <Button @click="edit('user_info')" v-show="!edit_user_info" type="info">编辑</Button>
                  <Button @click="save('user_info')" v-show="edit_user_info" type="success">保存</Button>
                  <Button @click="cancle('user_info')" v-show="edit_user_info" style="margin-left:20px;">取消</Button>
                  <Poptip
                    confirm
                    :title="user_detail.status == 1?'您确定要拉黑这个用户吗？':'您确定要把这个用户移出黑名单吗？'"
                    @on-ok="toggle_black"
                    placement="left-start"
                    >
                    <Button type="error" style="margin-left:20px;">{{user_detail.status == 1?'拉黑':'移出黑名单'}}</Button>
                  </Poptip>
                </div>
              </div>
            </TabPane>
            <TabPane label="个性化数据">
              <div class="tab-container">
                <div class="data-title">
                  他的标签：
                </div>
                <div class="tips-container">
                  <div class="tip" v-for="item in user_detail.user_tags">
                    {{item.name}}
                  </div>
                </div>
                <div class="data-title" style="margin-top:10px;">
                  他的签名:
                </div>
                <div class="sign">
                  <div class="text" v-show="!edit_user_data" v-html="user_data_sign_html">
                    <!-- {{user_data_form.sign}} -->
                  </div>
                  <div class="font-12" v-show="edit_user_data">
                    <Input v-model="user_data_form.introduce" type="textarea" :autosize="{minRows:2}"></Input>
                  </div>
                </div>
                <div class="data-title" style="margin-top:10px;">
                  他的照片墙:
                </div>
                <div class="photo-wall">
                  <div class="background-contain" v-for="(item,index) in user_data_form.user_photos" :style="'background-image:url('+item.img_path+')'">
                    <div class="close" @click="del_photos(index)">
                      <Icon type="close-circled" color="#ff0000" size="20" v-show="edit_user_data"></Icon>
                    </div>
                  </div>
                </div>
                <div style="margin-top:20px;text-align:right">
                  <Button @click="edit('user_data')" v-show="!edit_user_data" type="info">编辑</Button>
                  <Button @click="save('user_data')" v-show="edit_user_data" type="success">保存</Button>
                  <Button @click="cancle('user_data')" v-show="edit_user_data" style="margin-left:20px;">取消</Button>
                  <Poptip
                    confirm
                    :title="user_detail.status == 1?'您确定要拉黑这个用户吗？':'您确定要把这个用户移出黑名单吗？'"
                    @on-ok="toggle_black"
                    placement="left-start"
                    >
                    <Button type="error" style="margin-left:20px;">{{user_detail.status == 1?'拉黑':'移出黑名单'}}</Button>
                  </Poptip>
                </div>
              </div>
            </TabPane>
            <TabPane label="他的动态">
              <div class="tab-container">
                <div style="position:relative;height:550px;overflow:auto;">
                  <Spin size="large" fix v-if="circles_loading"></Spin>
                  <div class="trends" v-for="circle in circles">
                    <div class="line1">
                      <span>{{circle.created_at}}</span>
                      <Icon type="close-circled" color="#ff0000" size="20" v-show="edit_user_trends"></Icon>
                    </div>
                    <div class="line2">
                      {{circle.content}}
                    </div>
                    <div class="line3">
                      <div class="background-contain" :style="'background-image:url('+circle.img+')'"></div>
                    </div>
                  </div>
                </div>
                <div style="display:flex;justify-content:flex-end;margin-top:10px;">
                  <Page :total="100" size="small"></Page>
                </div>

                <div style="margin-top:20px;text-align:right">
                  <Button @click="edit('user_trends')" v-show="!edit_user_trends" type="info">编辑</Button>
                  <Button @click="save('user_trends')" v-show="edit_user_trends" type="success">保存</Button>
                  <Button @click="cancle('user_trends')" v-show="edit_user_trends" style="margin-left:20px;">取消</Button>
                  <Poptip
                    confirm
                    :title="user_detail.status == 1?'您确定要拉黑这个用户吗？':'您确定要把这个用户移出黑名单吗？'"
                    @on-ok="toggle_black"
                    placement="left-start"
                    >
                    <Button type="error" style="margin-left:20px;">{{user_detail.status == 1?'拉黑':'移出黑名单'}}</Button>
                  </Poptip>
                </div>
              </div>
            </TabPane>
          </Tabs>
          <Spin size="large" fix v-if="right_loading"></Spin>
        </div>
      </div>
      <div slot="footer">
      </div>

    </Modal>
    <Modal v-model="imgShow" title="图片查看" width="600">
      12312312
    </Modal>
  </div>
</template>
<script>
import {copyObj} from '@/utils/common.js'
export default {
  name: "userDetail",
  data: () => ({
    uuid: '',
    table_type: '',
    columns: [],
    columns0: [
      {
        title: '类型',
        key: 'remark',
        align:'center'
      },{
        title: '秘币变化',
        key: 'price',
        align:'center',
        render: (h,params)=>{
          return h('span',{
            style:{
              color: params.row.price[0]=='-'?'red':'green'
            }
          },params.row.price)
        }
      },{
        title: '时间',
        key: 'created_at',
        align: 'center'
      },{
        title: '秘币余额',
        key: 'balance',
        align: 'center'
      }
    ],
    columns1: [
      {
        title: '充值金额',
        align: 'center',
        key: 'money'
      },{
        title: '获得秘币',
        align: 'center',
        key: 'price'
      },{
        title: '充值时间',
        align: 'center',
        key: 'created_at'
      }
    ],
    columns3: [
      {
        title: '消费类型',
        key: 'remark',
        align: 'center'
      },{
        title: '消费金额',
        key: 'price',
        align: 'center',
        render: (h,params)=>{
          return h('span',params.row.price[0]=='-'?params.row.price.slice(1):params.row.price)
        }
      },{
        title: '消费时间',
        key: 'created_at',
        align: 'center'
      }
    ],
    columns5: [
      {
        title: '上线时间',
        key: 'start_time',
        align: 'center'
      },{
        title: '下线时间',
        key: 'end_time',
        align: 'center'
      },{
        title: '在线时长',
        key: 'mins',
        align: 'center'
      }
    ],
    columns7: [
      {
        title: '开始时间',
        key: 'start_time',
        align:'center'
      },{
        title: '结束时间',
        key: 'end_time',
        align: 'center'
      },{
        title: '偷听时长',
        key: 'mins',
        align: 'center'
      }
    ],


    myData: [],
    imgShow: false,

    if_show: false,
    left_loading: false,
    right_loading: false,
    circles_loading: false,
    circles:[],
    cardData:{},
    cardColumns: [
      {
        title: '秘币余额',
        key: 'balance',
        type: '0'
      },{
        title: '充值总额',
        unit: '（人民币）',
        key: 'recharge_money',
        type: '1'
      },{
        title: '秘币消费',
        key: 'all_expense',
        type: '3'
      },{
        title: '在线时长',
        key: '',
        type: ''
      },{
        title: '聊天时长',
        key: 'talk_mins',
        type: '5'
      },{
        title: '偷听时长',
        key: 'tap_mins',
        type: '7'
      }
    ],
    pageprops: {
      total: 0,
      showSizer:true
    },
    fy: {
      page: 1,
      size: 10
    },
    circle_fy: {
      page: 1,
      size:10
    },
    tableLoading: false,

    user_detail: {},

    edit_user_info: false,
    user_info_form:{
      portrait: '',
      nick_name: '',
      mobile: '',
      sex: '',
      status: '',
      birthday: ''
    },
    user_info_form_copy:{},

    edit_user_data: false,
    user_data_form: {
      introduce: '',
      user_photos: []
    },
    user_data_form_copy: {

    },

    edit_user_trends: false,
    user_trends_form:{},
    user_trends_form_copy:{}
  }),
  computed: {
    user_data_sign_html() {
      return this.user_data_form.introduce.replace(/\n/g,'<br>')
    },
    user_sex() {
      if(this.user_info_form.sex == 1) {
        return '男'
      } else if (this.user_info_form.sex == 2){
        return '女'
      } else {
        return '未知'
      }
    },
    edit_form() {
      let arr = JSON.stringify(this.user_data_form.user_photos);
      return Object.assign(this.user_info_form,{introduce:this.user_data_form.introduce,user_photos:arr},{uuid:this.uuid})
    },
  },
  methods: {
    toggle_black() {
      this.axios.post('user-set-status',{
        uuid: this.uuid,
        status: this.user_detail.status == 1? 2:1
      }).then(res=>{
        if(res){
          this.user_detail.status = this.user_detail.status==1?2:1
        }
      })
    },
    upload_success(list) {
      this.user_info_form.portrait = list[0][0];
    },
    del_photos(index) {
      this.user_data_form.user_photos.splice(index,1);
    },
    getCircles() {
      this.axios.get(`get-circles?user_uuid=${this.uuid}&page=${this.circle_fy.page}&size=${this.circle_fy.size}`).then(res=>{
        if(res){
          this.circles = res.data.list
        }
      })
    },
    showImg() {
      this.imgShow = true;
    },
    edit(item) {
      // for(let key in this.$data[item+'_form']){
      //   this.$set(this.$data[item+'_form_copy'],key,this.$data[item+'_form'][key])
      // }
      this.$set(this.$data,item+'_form_copy',copyObj(this.$data[item+'_form']))
      this.$data['edit_'+item] = true;
    },
    save(item){
      this.axios.post('edit-user-detail',this.edit_form).then(res=>{
        if(res){
          this.$data['edit_'+item] = false;
        }
      })
    },
    cancle(item) {
      for(let key in this.$data[item+'_form_copy']){
        this.$set(this.$data[item+'_form'],key,this.$data[item+'_form_copy'][key])
      }
      this.$data['edit_'+item] = false;
    },
    card_change(key) {
      this.table_type = key
      this.tale_get_data();
    },
    pageChange(page) {
      this.fy.page = page;
      this.tale_get_data();
    },
    pageSizeChange(size) {
      this.fy.page = 1;
      this.fy.size = size;
      this.tale_get_data();
    },
    tale_get_data() {
      this.tableLoading = true
      this.axios.get(`user-card-table?page=${this.fy.page}&size=${this.fy.size}`,{
        params:{
          uuid: this.uuid,
          type: this.table_type
        }
      }).then(res=>{
        this.tableLoading = false;
        if(res){
          this.myData = res.data.log_list
          this.pageprops.total = res.data.total
        }
      })
    },
    show(id) {
      this.uuid = id;
      this.if_show = true;
      this.left_loading = true;
      this.axios.get(`get-user-card?uuid=${this.uuid}`).then(res=>{
        this.left_loading = false;
        if(res){
          this.cardData = res.data.user_stats
        }
      })
      this.right_loading = true;
      this.axios.get(`user-detail?uuid=${this.uuid}`).then(res=>{
        this.right_loading = false;
        if(res){
          this.user_detail = res.data.user_info;
          for(let key in this.user_info_form){
            this.user_info_form[key] = this.user_detail[key];
          }
          for(let key in this.user_data_form) {
            this.user_data_form[key] = this.user_detail[key];
          }
          // this.user_info_form.photo =user_detail.portrait;
          // this.user_info_form.nickname = user_detail.nick_name;
          // this.user_info_form.mobile = user_detail.mobile;
          // this.user_info_form.uuid = user_detail.uuid;
          // this.user_info_form.sex = user_detail.sex+'';
          // this.user_info_form.blacklist = user_detail.status+'';
        }
      })
      this.getCircles();
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-container{
  padding:10px;
  padding-top:0;
  position:relative;
  .photo{
    width:50px;
    height:50px;
    margin-right:15px;
  }
  .input-group{
    display:flex;
    align-items: center;
    padding:5px 0;
    .label{
      width:80px;
      // text-align: right;
      // border:1px solid #ddd;
    }
    .content{

      display:flex;
      align-items: flex-end;
      .text{
        height:32px;
        line-height: 32px;
        padding-left:7px;
      }
    }
  }
  .data-title{
    font-size:13px;
    margin-bottom:15px;
  }
  .tips-container{
    display:flex;
    flex-wrap: wrap;
    .tip{
      margin-left:15px;
      white-space: nowrap;
      padding:10px;
      border:1px solid #ddd;
      border-radius: 10px;
      min-width:70px;
      text-align:center;
      margin-bottom:10px;
    }
  }
  .sign{
    .text{
      min-height:46px;
      padding:4px 7px;
    }
  }
  .photo-wall{
    display:flex;
    flex-wrap: wrap;
    >div{
      width:110px;
      height:110px;
      margin-bottom:10px;
      margin-left:10px;
      position:relative;
      .close{
        position:absolute;
        top:0;
        left:0;
      }
    }
  }
  .trends{
    .line1{
      display:flex;
      align-items: center;
      justify-content: space-between;
      font-size:13px;
    }
    .line2{
      padding:5px;
    }
    .line3{
      display:flex;
      flex-wrap: wrap;
      >div{
        width:80px;
        height:80px;
        margin-bottom:10px;
        margin-left:10px;
        position:relative;
        .close{
          position:absolute;
          top:0;
          left:0;
        }
      }
    }
  }
}

.user-detail-container{
  display:flex;
  justify-content: space-around;
  .left{
    width:750px;
    padding-top:10px;
    position:relative;
  }
  .right{
    position:relative;
    width:400px;
    border:1px solid #ddd;
    border-radius: 5px;
    // border-top:0;
  }
}
</style>
