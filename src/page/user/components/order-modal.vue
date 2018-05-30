<template>
  <div id="order-modal">
    <Modal v-model="if_show" title="添加订单" @on-cancel="hideModal">
      <Form v-model="order_form" :label-width="100">
        <FormItem label="订单情况：">
          <RadioGroup v-model="order_form.type">
            <Radio :label="0" :disabled="role === 1">单向</Radio>
            <Radio :label="1" :disabled="role === 1">双向</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="`${role==1?'家长':'家教'}姓名：`">
          <Input class="ipt-box" v-if="role == 1" v-model="order_form.learn_name" disabled/>
          <Input class="ipt-box" v-if="role == 2" v-model="order_form.tutor_name" disabled/>
        </FormItem>
        <FormItem :label="`${role==1?'家长':'家教'}手机号：`">
          <Input class="ipt-box" v-if="role == 1" v-model="order_form.learn_phone" disabled/>
          <Input class="ipt-box" v-if="role == 2" v-model="order_form.tutor_phone" disabled/>
        </FormItem>
        <FormItem :label="`${role==1?'家教':'家长'}姓名：`">
          <Select class="ipt-box" v-if="role == 1" placeholder="请输入家教手机号码" v-model="order_form.tutor_id" filterable remote :remote-method="searchPhone" >
            <Option v-for="item in phoneList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <Select class="ipt-box" v-if="role == 2" placeholder="请输入家长手机号码" v-model="order_form.learn_id" filterable remote :remote-method="searchPhone" >
            <Option v-for="item in phoneList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务费：" v-if="order_form.type == 0">
          <Input class="ipt-box" v-model="order_form.amount" />
        </FormItem>
        <FormItem label="家长服务费：" v-if="order_form.type == 1">
          <Input class="ipt-box" v-model="order_form.learn_amount" />
        </FormItem>
        <FormItem label="家教服务费：" v-if="order_form.type == 1">
          <Input class="ipt-box" v-model="order_form.tutor_amount" />
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
        role: '',
        if_show: false,
        order_form: {
          type: 0,
          tutor_id: '',
          tutor_name: '',
          tutor_phone: '',
          learn_id: '',
          learn_name: '',
          learn_phone: '',
          amount: '',
          learn_amount: '',
          tutor_amount: '',
          order_desc: ''
        },
        phoneList: []
      }
    },
    methods: {
      show(data, role){
        this.role = role;
        if(role == 2){
          this.order_form.tutor_name = data.body_name;
          this.order_form.tutor_phone = data.phone;
          this.order_form.tutor_id = data.id;
        }else if(role == 1){
          this.order_form.type = 1;
          this.order_form.learn_name = data.body_name;
          this.order_form.learn_phone = data.phone;
          this.order_form.learn_id = data.id;
        }
        this.if_show = true;
      },
      searchPhone(data){
        if(/^[1][34578][0-9]{9}$/.test(data)){
          this.axios.get('get-learn-phone',{
            params: {
              phone: data,
              role: this.role==1?2:1
            }
          }).then(d=>{
            if(d){
              this.phoneList = [d.data.detail];
            }else{
              this.phoneList = [];
            }
          })
        }
      },
      hideModal(){
        for(let i in this.order_form){
          if(i == 'type'){
            this.order_form[i] = 0;
          }else{
            this.order_form[i] = ''
          }
        }
        this.phoneList = [];
      },
      submitData(){
        console.log(this.order_form);
        let tutor_id = this.order_form.tutor_id,
            learn_id = this.order_form.learn_id,
            amount = this.order_form.amount,
            tutor_amount = this.order_form.tutor_amount,
            learn_amount = this.order_form.learn_amount,
            order_desc = this.order_form.order_desc;
        // if(amount == ''){
        //   this.$Message.error('服务费不能为空');
        // }else if(learn_id == ''){
        //   this.$Message.error('请选择家长');
        // }

        if(this.order_form.type == 0){
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
        }else{
          this.axios.post('/backend/server/add-both-order',{
            tutor_id,
            learn_id,
            tutor_amount,
            learn_amount,
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
