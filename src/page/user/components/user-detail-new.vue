<template lang="html">
  <div class="user-detail">
    <Modal v-model="if_show" title="用户详情" width="1000" cancel-text>
      <Row :gutter='5'>
        <Col span="18">
          <div class="user_tag">
              <img class="user_img" :src="myData.avatarulr">
              <div class="money_msg">
                <span>{{myData.nickname}}</span>
                <span>ip:  {{myData.ip}} </span>
                <br><br>
                <span style="marginRight:80px">账户余额:  {{myData.balance}}</span>
                <span>金币余额:  {{myData.virtual}}</span>
              </div>
          </div>
          <Row>
                <table-container @on-change="pageChange" @on-page-size-change="pageSizeChange" page :pageprops="pageprops">
                  <div slot="btn">
                    <Button @click="changeType(0)" :type="btnType[0]">发口令</Button>
                    <Button @click="changeType(1)" :type="btnType[1]">发语音</Button>
                    <Button @click="changeType(2)" :type="btnType[2]">抢口令</Button>
                    <Button @click="changeType(3)" :type="btnType[3]">抢语音</Button>
                    <Button @click="changeType(4)" :type="btnType[4]">资金变动</Button>
                    <Button @click="changeType(5)" :type="btnType[5]">金币记录</Button><br><br>
                    <DatePicker type="daterange" v-model="register_time" confirm :clearable="false" :editable="false" @on-ok="search" @on-clear="clear"></DatePicker>
                    <span>共{{pageprops.total}}条</span>
                  </div>
                  <Table :columns="$data['columns'+type]" :data="list" border :loading="tableLoading"></Table>
                  </table-container>
          </Row>
        </Col>
        <Col span="6">
          <Card>
            <div class="msg">
              <p slot="title" >基本资料</p>
              <p>首次进入时间 <span class="goRight">{{myData.created_at}}</span> </p>
              <p>是否进入分销状态 <br> <span class="goRight">{{myData.is_distribute?'是':'否'}}</span> </p>
              <p v-if="myData.is_distribute">分销时间 <br> <span class="goRight">{{myData.distribute_time}}</span> </p>
              <p>是否封号 <span class="goRight">{{myData.status?'否':'是'}}</span> </p>
              <div class="btn">
                <Button type="success" v-if="!freeze" @click='forbidUser(1)'>解封</Button>
                <Button type="error" v-else @click='forbidUser(0)'>封号</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

    </Modal>
  </div>
</template>

<script>
export default {
  name: 'user-detail',
  data: () => ({
    columns0: [{
      title: '发送时间',
      key: 'created_at',
      align: 'center'
    }, {
      title: '红包金额',
      key: 'bonus_money',
      align: 'center'
    }, {
      title: '内容',
      key: 'bonus_password',
      align: 'center'
    }, {
      title: '红包状态',
      key: 'status',
      align: 'center'
    }, {
      title: '手续费',
      key: 'service_money',
      align: 'center'
    }, {
      title: '领取金额',
      key: 'receive_money',
      align: 'center'
    }, {
      title: '退款金额',
      key: 'refund_money',
      align: 'center'
    }],
    columns1: [{
      title: '发送时间',
      key: 'created_at',
      align: 'center'
    }, {
      title: '红包金额',
      key: 'bonus_money',
      align: 'center'
    }, {
      title: '语音',
      align: 'center',
      render: (h, params) => {
        let content = params.row.remark_voice;
        const audio = document.createElement('audio')
        return h('Button', {
          props: {
            type: 'success'
          },
          on: {
            click: () => {
              audio.src = params.row.voice_path;
              audio.play();
            }
          }
        }, '播放录音')
      }
    }, {
      title: '红包状态',
      key: 'status',
      align: 'center'
    }, {
      title: '手续费',
      key: 'service_money',
      align: 'center'
    }, {
      title: '领取金额',
      key: 'receive_money',
      align: 'center'
    }, {
      title: '退款金额',
      key: 'refund_money',
      align: 'center'
    }],
    columns2: [{
      title: '领取时间',
      key: 'created_at',
      align: 'center'
    }, {
      title: '红包金额',
      key: 'receive_money',
      align: 'center'
    }, {
      title: '内容',
      key: 'bonus_password',
      align: 'center'
    }, {
      title: '发包人',
      key: 'send_user',
      align: 'center'
    }, {
      title: '余额',
      key: 'balance',
      align: 'center'
    }],
    columns3: [{
      title: '领取时间',
      key: 'created_at',
      align: 'center'
    }, {
      title: '红包金额',
      key: 'receive_money',
      align: 'center'
    }, {
      title: '内容',
      align: 'center',
      render: (h, params) => {
        let content = params.row.remark_voice;
        const audio = document.createElement('audio')
        return h('Button', {
          props: {
            type: 'success'
          },
          on: {
            click: () => {
              audio.src = params.row.voice_path;
              audio.play();
            }
          }
        }, '播放录音')
      }
    }, {
      title: '发包人',
      key: 'send_user',
      align: 'center'
    }, {
      title: '余额',
      key: 'balance',
      align: 'center'
    }],
    columns4: [{
      title: '变动时间',
      key: 'created_at',
      align: 'center'
    }, {
      title: '交易类型',
      key: 'type',
      align: 'center'
    }, {
      title: '变动金额',
      key: 'affect_money',
      align: 'center'
    }],
    columns5: [{
      title: '变动时间',
      key: 'created_at',
      align: 'center'
    }, {
      title: '变动类型',
      key: 'type',
      align: 'center'
    }, {
      title: '变动额度',
      align: 'center',
      key: 'money'
    }, {
      title: '金币余额',
      key: 'balance',
      align: 'center'
    }],
    if_show: false,
    tableLoading: false,
    myData: [],

    type: 0,
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
      key: ''
    },
    register_time: [],
    start_time: '',
    end_time: '',
    freeze: false,
    list: [],
    btnType: ['warning', 'info', 'info', 'info', 'info', 'info'],
    freeze:false,
  }),

  computed: {
    searchData() {
      return {
        type: this.type,
        start_time: this.start_time,
        end_time: this.end_time,
        openid: this.my_search.key,
        ...this.fy,
      }
    },
  },
  watch: {
    searchData: function() {
      this.show()
    },
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
    },
    pageSizeChange(size) {
      this.fy.size = size;
    },
    changeType(type) {
      this.fy = {
        page: 1,
        size: 10
      }

      this.btnType.forEach((item, index, arr) => {
        if (index == type) {
          arr[index] = 'warning'
        } else {
          arr[index] = 'info'
        }
      })
      this.type = type
      this.clear()
      this.register_time = []
    },
    show(row) {
      if (row) {
        this.my_search.key = row;
      }
      this.tableLoading = true;
      this.axios.get('user-panel', {
        params: this.searchData
      }).then(res => {
        if (res.status == 1) {
          this.tableLoading = false;
          this.myData = res.data.list;
          this.list = res.data.list.list.list;
          this.pageprops.total = res.data.list.list.total;
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
</style>
