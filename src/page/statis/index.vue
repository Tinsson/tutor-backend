<template>
  <div class="index-box">
    <title-bar title="用户信息统计" @refresh="refresh" ></title-bar>
    <Row :gutter="20">
      <Col class="card-col" span="8">
        <Card>
          <h2 class="card-title">注册用户总数</h2>
          <p class="card-number">{{ all_regis }}</p>
          <div class="card-content">
            <p class="info-txt">
                <span class="half">
                  <span class="label">家长</span>
                  <span class="value">{{ parent_regis }}</span>
                </span>
              <span class="half">
                  <span class="label">家教</span>
                  <span class="value">{{ tutor_regis }}</span>
                </span>
            </p>
          </div>
        </Card>
      </Col>
      <Col class="card-col" span="8">
        <Card>
          <h2 class="card-title">认证用户总数</h2>
          <p class="card-number">{{ all_auth }}</p>
          <div class="card-content">
            <p class="info-txt">
                  <span class="half">
                    <span class="label">家长</span>
                    <span class="value">{{ p_auth }}</span>
                  </span>
              <span class="half">
                    <span class="label">家教</span>
                    <span class="value">{{ t_auth }}</span>
                  </span>
            </p>
          </div>
        </Card>
      </Col>
      <Col class="card-col" span="8">
        <Card>
          <h2 class="card-title">城市排名</h2>
          <div class="board-box">
            <div class="line" v-for="(item, index ) in city_data" :key="index">
              <div class="tit-box">
                <div class="circle" :class="{top: index < 3}">{{index + 1}}</div>
                <div class="title">{{item.city}}</div>
              </div>
              <div class="val-box">{{item.count}}</div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
    export default {
      name: "index",
      data(){
        return {
          all_regis: '',
          parent_regis: '',
          tutor_regis: '',
          all_auth: '',
          p_auth: '',
          t_auth: '',
          city_data: [{
            name: '宁波',
            value: '600'
          },{
            name: '长沙',
            value: '200'
          },{
            name: '杭州',
            value: '200'
          },{
            name: '北京',
            value: '100'
          },{
            name: '广州',
            value: '50'
          },{
            name: '东莞',
            value: '50'
          },{
            name: '上海',
            value: '50'
          },{
            name: '成都',
            value: '50'
          },{
            name: '重庆',
            value: '50'
          },{
            name: '天津',
            value: '50'
          }]
        }
      },
      methods: {
        initData(){
          this.axios.get('stat-info').then(d=>{
            let info = d.data.detail;
            this.city_data = info.city_list;
            this.all_regis = info.reg_count;
            this.parent_regis = info.rl_count;
            this.tutor_regis = info.rt_count;
            this.all_auth = info.auth_count;
            this.p_auth = info.al_count;
            this.t_auth = info.at_count;
          })
        },
        refresh(){

        }
      },
      created(){
        this.initData();
      }
    }
</script>

<style lang="scss" scoped>
  .index-box{
    padding-bottom: 80px;
  }
  .card-col{
    padding-bottom: 10px;
  }
  .card-title{
    color: rgba(0, 0, 0, 0.45);
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
  }
  .card-number{
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 32px;
    line-height: 38px;
    height: 38px;
  }
  .card-content{
    margin-bottom: 12px;
    position: relative;
    width: 100%;
    height: 82px;
    .info-txt{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      color: #333;
      .half{
        width: 50%;
        color: #333;
        .value{
          margin-left:8px;
        }
      }
    }
  }
  .card-footer{
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    .value{
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .board-box{
    padding: 20px 0;
    .line{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      .tit-box{
        display: flex;
        flex-direction: row;
        align-items: center;
        .circle{
          width:20px;
          height: 20px;
          line-height: 20px;
          margin-right: 25px;
          text-align: center;
          color: #454647;
          background-color: #f1f1f1;
          border-radius: 50%;
          font-size: 12px;
          &.top{
            color: #fff;
            background-color: #304558;
          }
        }
      }
    }
  }
</style>
