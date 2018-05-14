<template lang="html">
  <div class="user-detail">
    <Modal v-model="if_show" @on-cancel="hidePanel" :title="modelTitle" width="550" cancel-text>
      <Form :model="infoForm" :label-width="100">
        <FormItem label="姓名：">
          <Input :style="{width: iptWidth}" v-model="infoForm.name" />
        </FormItem>
        <FormItem label="是否全国：">
          <div>
            <i-switch v-model="infoForm.isAll">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
        <FormItem label="省/直辖市：" v-if="!infoForm.isAll">
          <div class="city-box">
            <div>
              <Tag v-for="(item, index) in privinceTags" type="dot" :key="index" :name="item.name" :color="item.color" closable @on-close="rmPrivince">{{item.name}}</Tag>
            </div>
            <Select style="width: 80px" @on-change="getPrivince">
              <Option v-for="item in cityData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <p>若小标点为红色表示包括全部省/直辖市</p>
        </FormItem>
        <FormItem label="城市：" v-if="privinceTags.length > 0">
          <div class="city-box">
            <div>
              <Tag v-for="(item, index) in cityVal" :key="index" :name="item" color="green" closable @on-close="rmCity">{{item}}</Tag>
            </div>
            <Cascader style="width: 120px" :data="cityArr" v-model="infoForm.city" @on-change="getCity">
              <Button icon="ios-plus-empty" type="dashed" size="small">添加城市</Button>
            </Cascader>
          </div>
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
      iptWidth: '250px',
      modelTitle: '新增助教',
      img_show: false,
      is_edit: false,
      if_show: false,
      edit_id: '',
      infoForm: {
        name: '',
        isAll: false,
        city: [],
        status: '',
        qrcode: '',
        long_qrcode: '',
      },
      cityVal: [],
      cityData: [],
      privince: [],
      privinceTags: []
    }
  },

  created(){
    this.axios.get('city-list').then(d=>{
      this.cityData = d.data.list;
    })
  },

  watch: {

  },

  computed: {
    cityArr(){
      let newArr = [];
      this.cityData.forEach(val=>{
        if(this.privince.indexOf(val.value) > -1){
          newArr.push(val);
        }
      });
      return newArr;
    }
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
        }else if(label === 'isAll'){
          this.infoForm.isAll = false;
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

    getPrivince(val){
      if(val == ""){
        return;
      }
      this.privinceTags.push({
        color: 'red',
        name: val
      });
      this.privince.push(val);

    },

    rmPrivince(e, name){
      let tagIndex = '';
      this.privinceTags.forEach((val, index)=>{
        if(val.name == name){
          tagIndex = index
        }
      });
      const index = this.privince.indexOf(name);
      this.privince.splice(index, 1);
      this.privinceTags.splice(tagIndex, 1);
    },

    getCity(val){
      if(this.cityVal.indexOf(val.join('/')) > -1){
        return;
      }
      this.privinceTags.map((vval, index)=>{
        if(vval.name == val[0]){
          vval.color = 'blue'
        }
        return vval;
      });
      this.cityVal.push(val.join('/'));
      this.infoForm.city = [];
    },

    rmCity(e, name){
      const index = this.cityVal.indexOf(name);
      this.cityVal.splice(index, 1);
      let privince = name.split('/')[0],
          p_status = true;
      this.cityVal.forEach(val=>{
        if(val.indexOf(privince) > -1){
          p_status = false
        }
      });
      if(p_status){
        this.privinceTags.map((val, index)=>{
          if(val.name == privince){
            val.color = 'red'
          }
          return val;
        });
      }
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
  .city-box{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
