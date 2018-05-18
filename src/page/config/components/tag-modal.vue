<template>
  <div class="addTag">
    <Modal v-model="if_show" :title="`${is_edit?'编辑':'新增'}渠道`" width="500" @on-visible-change="close">
      <Form ref="tag_form" :model="tag_form" :label-width="80">
        <FormItem label="标签名：">
          <Input class="ipt-box" v-model="tag_form.name" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "tag-modal",
    data(){
      return{
        is_edit: false,
        tag_form: {
          type: '',
          name: ''
        },
        if_show: false
      }
    },
    methods: {
      submit(){
        if(this.tag_form.name == ''){
          this.$Message.error('标签名不能为空！');
        }
        this.axios.post('add-tag', this.tag_form).then(d=>{
          this.if_show = false;
          this.$Message.success(d.message);
          this.$emit('refresh', this.tag_form.type);
        });
      },
      show(data){
        //console.log(data);
        this.tag_form.type = data.type;
        this.is_edit = data.is_edit;
        this.if_show = true;
      },
      close(sign){
        if(!sign){
          this.tag_form.name = '';
        }
      }
    }
  }
</script>

<style scoped>
  .ipt-box{
    width: 250px;
  }
</style>
