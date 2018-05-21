<template>
  <div class="remark-modal">
    <Modal v-model="modal_status" width="500" title="备注编辑" @on-cancel="hideModal">
      <Form v-model="remark_form">
        <FormItem label="标签选择：">
          <CheckboxGroup v-model="remark_form.quick_remark">
            <Checkbox v-for="item in tags_list" :key="item.id" :label="item.name">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="自定义备注：">
          <Input style="width: 350px" type="textarea" v-model="remark_form.remark" />
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
    name: "remark-modal",
    data(){
      return{
        modal_status: false,
        tags_list: [],
        uid: '',
        remark_form: {
          uid: '',
          remark: '',
          quick_remark: []
        }
      }
    },
    methods: {
      initData(role){
        this.axios.get('user-remark',{
          params: {
            role
          }
        }).then(d=>{
          this.tags_list = d.data.list;
        })
      },
      show(role, data){
        this.remark_form = data;
        this.initData(role);
        this.modal_status = true;
      },
      hideModal(){
        this.remark_form = {
          uid: '',
          remark: '',
          quick_remark: []
        }
      },
      submit(){
        let params = this.$copyObj(this.remark_form);
        params.quick_remark = params.quick_remark.join(',');
        this.axios.post('edit-remark', params).then(d=>{
          if(d){
            this.$Message.success(d.message);
            this.modal_status = false;
            this.hideModal();
            this.$emit('subOver');
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
