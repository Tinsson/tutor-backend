<template lang="html">
  <div class="user-detail">
    <Modal v-model="if_show" @on-cancel="hidePanel" :title="modelTitle" width="500" cancel-text>
      <Form :model="infoForm" :label-width="100" inline>
        <FormItem label="姓名：">
          <Input :style="{width: iptWidth}" v-model="infoForm.name" />
        </FormItem>
        <FormItem label="城市：">
          <Cascader :style="{width: iptWidth}" :data="cityData" v-model="infoForm.city"></Cascader>
        </FormItem>
        <FormItem label="在职状态：">
          <Select :style="{width: iptWidth}" v-model="infoForm.status">
            <Option :value="1">启用</Option>
            <Option :value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="二维码：">
          <img v-if="is_edit || img_show" class="qrcode-pic" :src="infoForm.long_qrcode" alt="">
          <Upload class="upload-btn" :before-upload="HandleQrcode" action="http://tutor.pgyxwd.com/backend/Auth/adminUserUppwd">
            <Button type="ghost" size="large" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="hidePanel">取消</Button>
        <Button type="primary" @click="submitData">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { copyObj } from "../../../utils/common";

  export default {
  name: 'user-detail',
  props: {

  },
  data(){
    return {
    iptWidth: '200px',
    modelTitle: '新增助教',
    img_show: false,
    is_edit: false,
    if_show: false,
    edit_id: '',
    infoForm: {
      name: '',
      city: [],
      status: '',
      qrcode: '',
      long_qrcode: '',
    },
    cityData: []
  }},

  created(){
    this.axios.get('city-list').then(d=>{
      this.cityData = d.data.list;
    })
  },

  watch: {

  },

  computed: {

  },
  methods: {

    HandleQrcode(file){
      this.$uploadPic(file, 'qrcode').then(res=>{
        this.img_show = true;
        this.infoForm.long_qrcode = res.base64;
        this.infoForm.qrcode = res.short_pic;
      });
      return false;
    },

    hidePanel(){
      this.if_show = false;
      this.img_show = false;
      Object.keys(this.infoForm).forEach(label=>{
        if(label === 'city'){
          this.infoForm.city = [];
        }else{
          this.infoForm[label] = ''
        }
      });
    },

    submitData(){
      let params = copyObj(this.infoForm),
          url = '',
          error_msg = '';
      if(this.is_edit){
        params.id = this.edit_id;
        url = 'assis-edit';
      }else{
        url = 'assis-add';
      }
      params.city = params.city.join(',');
      if(params.name === ''){
        error_msg = '姓名不能为空！';
      }else if(params.city === ''){
        error_msg = '请选择城市！';
      }else if(params.status === ''){
        error_msg = '请选择在职状态！';
      }else if(params.qrcode === ''){
        error_msg = '请上传二维码！'
      }
      if(error_msg !== ''){
        this.$Message.error(error_msg);
        return;
      }
      this.axios.post(url, params).then(d=>{
        if(d.status === 1){
          this.if_show = false;
          this.$Message.success(d.message);
          this.$emit('optOver');
        }
      })
    },

    show(row) {
      if(row){
        this.is_edit = true;
        this.edit_id = row.id;
        Object.keys(this.infoForm).forEach(label=>{
          if(label === 'city'){
            this.infoForm.city = row.city.split(',');
          }else{
            this.infoForm[label] = row[label]
          }
        });
        this.modelTitle = '编辑助教';
      }else{
        this.is_edit = false;
        this.modelTitle = '新增助教';
      }
      this.if_show = true;
    },
  }
}
</script>

<style lang="scss" scoped>
  .qrcode-pic{
    width: 200px;
    display: block;
    margin-bottom: 10px;
  }
</style>
