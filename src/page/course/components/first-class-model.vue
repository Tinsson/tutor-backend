<template>
  <div class="first-model">
    <Modal v-model="if_show" title="打款确认">
      <div class="content">
        <div class="tit-box">
          <div class="tit-part">
            <p class="title">剩余总次数</p>
            <p class="value">{{all_free_hour}}</p>
          </div>
          <div class="tit-part">
            <p class="title">本次扣课总次数</p>
            <p class="value">{{all_use_hour}}</p>
          </div>
          <div class="tit-part">
            <p class="title">打款总价格</p>
            <p class="value">{{pay_money}}</p>
          </div>
        </div>
        <Table :columns="columns" :data="classData"></Table>
      </div>
      <div class="footer-box" slot="footer">
        <div class="left-box">
          <span>本次金额：</span>
          <InputNumber v-model="amount" :max="pay_money" style="width: 100px" />
        </div>
        <div class="btn-box">
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="saveCourse" >确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "first-class-model",
    data(){
      return{
        class_id: '',
        columns: [{
          title: '课程单价',
          key: 'price',
          align: 'center'
        },{
          title: '剩余课时',
          key: 'free_hour',
          align: 'center'
        },{
          title: '本次扣课次数',
          key: 'use_hour',
          align: 'center'
        }],
        classData: [],
        is_edit: false,
        if_show: false,
        amount: 0,
        pay_money: 0,
        all_use_hour: '',
        all_free_hour: ''
      }
    },
    methods: {
      show(row){
        this.if_show = true;
        this.class_id = row.class_id;
        this.axios.get('pay-detail',{
          params: {
            class_id: this.class_id
          }
        }).then(d=>{
          if(d.status == 1){
            this.classData = d.data.lists;
            this.pay_money = d.data.pay_money;
            this.amount = d.data.pay_money;
            this.all_free_hour = d.data.all_free_hour;
            this.all_use_hour = d.data.all_use_hour;
          }
        })
      },
      saveCourse(){
        if(this.amount == 0){
          this.$Message.error('请输入正确的价格！');
        }else{
          this.axios.post('pay-transfer', {
            amount: this.amount,
            class_id: this.class_id
          }).then(d=>{
            if(d.status == 1){
              this.$Message.success(d.message);
              this.if_show = false;
              this.$emit('save-over');
            }
          })
        }
      },
      cancel(){
        this.if_show = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .footer-box{
    display: flex;
    justify-content: space-between;
  }
  .tit-box{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    .tit-part{
      width: 30%;
      text-align: center;
      .value{
        padding-top: 10px;
      }
    }
  }
</style>
