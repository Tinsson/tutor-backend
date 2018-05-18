<template>
  <div id="addTask">
    <Modal v-model="if_show" :title="`${is_edit?'编辑':'新增'}渠道`" width="500" @on-visible-change="close">
      <Form ref="res_form" :model="res_form" :label-width="80">
        <FormItem label="渠道名：">
          <Input class="ipt-box" v-model="res_form.name" />
        </FormItem>
        <FormItem label="渠道类型：">
          <Select class="ipt-box" v-model="res_form.direction">
            <Option :value="1">线上</Option>
            <Option :value="2">线下</Option>
          </Select>
        </FormItem>
        <FormItem label="面向群体：">
          <Select class="ipt-box" v-model="res_form.role">
            <Option :value="1">家长</Option>
            <Option :value="2">家教</Option>
          </Select>
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
    name: "resource-modal",
    props: {
    },
    data() {
      return {
        is_edit: false,
        res_id: '',
        res_form: {
          name: '',
          role: '',
          direction: ''
        },
        if_show: false,
      }
    },
    methods: {
      show(row) {
        if(row){
          this.res_id = row.id;
          Object.keys(this.res_form).forEach(label=>{
            this.res_form[label] = row[label];
          });
          this.is_edit = true;
        }else{
          Object.keys(this.res_form).forEach(label=>{
            this.res_form[label] = '';
          });
          this.is_edit = false;
        }

        this.if_show = true;
      },
      submit() {
        let url = this.is_edit?'edit-resource':'add-resource',
            params = this.$copyObj(this.res_form);
        if(this.is_edit){
          params.id = this.res_id;
        }
        this.axios.post(url, params).then(d=>{
          this.$Message.success(d.message);
          this.if_show = false;
          this.$emit('close');
        })
      },
      close(cur) {
        if(!cur) {

        }
      }
    },
    mounted() {

    }
  }
</script>
<style lang="scss" scoped>
  .ipt-box{
    width: 250px;
  }
</style>
