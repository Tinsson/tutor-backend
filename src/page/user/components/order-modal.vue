<template>
  <div id="order-modal">
    <Modal v-model="if_show" title="添加订单">
      <Form v-model="order_form" :label-width="100">
        <FormItem label="家教姓名：">
          <Input class="ipt-box" v-model="order_form.tutor_name" disabled/>
        </FormItem>
        <FormItem label="家教手机号：">
          <Input class="ipt-box" v-model="order_form.tutor_phone" disabled/>
        </FormItem>
        <FormItem label="家长姓名：">
          <Select class="ipt-box" placeholder="请输入家长手机号码" v-model="order_form.learn_id" filterable remote :remote-method="searchPhone" >
            <Option v-for="item in phoneList" :key="item" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务费：">
          <Input class="ipt-box" v-model="order_form.amount" />
        </FormItem>
        <FormItem label="订单描述：">
          <Input class="ipt-box" type="textarea" v-model="order_form.order_desc" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitData">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "order-modal",
    data(){
      return{
        if_show: false,
        order_form: {
          tutor_id: '',
          tutor_name: '',
          tutor_phone: '',
          learn_id: '',
          learn_phone: '',
          amount: '',
          order_desc: ''
        },
        phoneList: []
      }
    },
    methods: {
      show(data){
        this.order_form.tutor_name = data.body_name;
        this.order_form.tutor_phone = data.phone;
        this.order_form.tutor_id = data.id;
        this.if_show = true;
      },
      searchPhone(data){
        if(/^[1][34578][0-9]{9}$/.test(data)){
          this.axios.get('get-learn-phone',{
            params: {
              phone: data
            }
          }).then(d=>{
            if(d){
              this.phoneList = [d.data.detail];
            }
          })
        }
      },
      submitData(){
        console.log(this.order_form);
        let tutor_id = this.order_form.tutor_id,
            learn_id = this.order_form.learn_id,
            amount = this.order_form.amount,
            order_desc = this.order_form.order_desc;
        if(amount == ''){
          this.$Message.error('服务费不能为空');
        }else if(learn_id == ''){
          this.$Message.error('请选择家长');
        }else{
          this.axios.post('add-order',{
            tutor_id,
            learn_id,
            amount,
            order_desc
          }).then(d=>{
            if(d){
              this.$emit('subOver');
              this.if_show = false;
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .ipt-box{
    width: 300px;
  }
</style>
