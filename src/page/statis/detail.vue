<template>
  <div class="index-box">
    <title-bar title="交易信息统计" ></title-bar>
    <Row :gutter="20">
      <Col class="card-col" span="8">
      <Card>
        <h2 class="card-title">充值用户</h2>
        <p class="card-number">{{ rc_count }}</p>
        <h2 class="card-title" style="padding-top: 30px">会员用户</h2>
        <p class="card-number">{{ mr_count }}</p>
      </Card>
      </Col>
      <Col class="card-col" span="8">
      <Card>
        <h2 class="card-title">充值总金额</h2>
        <p class="card-number">{{ all_money }}</p>
        <h2 class="card-title" style="padding-top: 30px">平均金额</h2>
        <p class="card-number">{{ avg_money }}</p>
      </Card>
      </Col>
      <Col class="card-col" span="8">
      <Card>
        <h2 class="card-title">退款用户</h2>
        <p class="card-number">{{ rf_money }}</p>
        <h2 class="card-title" style="padding-top: 30px">退款金额</h2>
        <p class="card-number">{{ rf_count }}</p>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
    export default {
        name: "detail",
        data(){
          return{
            rc_count: '',
            mr_count: '',
            all_money: '',
            avg_money: '',
            rf_money: '',
            rf_count: ''
          }
        },
        methods: {
          initData(){
            this.axios.get('stat-info').then(d=>{
              let info = d.data.detail;
              this.rc_count = info.rc_count;
              this.mr_count = info.mr_count;
              this.all_money = info.all_money;
              this.avg_money = info.avg_money;
              this.rf_money = info.rf_money;
              this.rf_count = info.rf_count;
            })
          }
        },
        created(){
          this.initData();
        }
    }
</script>

<style scoped>
  .index-box{
    padding-bottom: 80px;
  }
</style>
