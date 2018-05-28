<template lang="html">
  <div class="user-detail">
    <Modal v-model="if_show" @on-cancel="hidePanel" :title="modelTitle" width="550" cancel-text>
      <Form ref="info_form" :model="infoForm" :rules="info_rule" :label-width="100">
        <FormItem label="姓名：" prop="name">
          <Input :style="{width: iptWidth}" v-model="infoForm.name" />
        </FormItem>
        <FormItem label="微信" prop="wechat">
          <Input :style="{width: iptWidth}" v-model="infoForm.wechat" />
        </FormItem>
        <FormItem label="手机号：" prop="phone">
          <Input :style="{width: iptWidth}" v-model="infoForm.phone" />
        </FormItem>
        <FormItem label="是否全国：" v-if="is_area == 0">
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
              <Tag v-for="(item, index) in provinceTags" type="dot" :key="index" :name="item.name" :color="item.color" closable @on-close="rmProvince">{{item.name}}</Tag>
            </div>
            <Select style="width: 80px" @on-change="getProvince">
              <Option v-for="item in cityData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <p>若小标点为红色表示包括全部省/直辖市</p>
        </FormItem>
        <FormItem label="城市：" v-if="provinceTags.length > 0 && !infoForm.isAll">
          <div class="city-box">
            <div>
              <Tag v-for="(item, index) in cityVal" :key="index" :name="item" color="green" closable @on-close="rmCity">{{item}}</Tag>
            </div>
            <Cascader style="width: 120px" :data="cityArr" v-model="infoForm.city" @on-change="getCity">
              <Button icon="ios-plus-empty" type="dashed" size="small">添加城市</Button>
            </Cascader>
          </div>
        </FormItem>
        <FormItem label="在职状态：" prop="status">
          <Select :style="{width: iptWidth}" v-model="infoForm.status">
            <Option :value="1">启用</Option>
            <Option :value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="二维码：" prop="qrcode">
          <img v-if="is_edit || img_show" class="qrcode-pic" :src="infoForm.long_qrcode" alt="">
          <Upload class="upload-btn" :before-upload="HandleQrcode" action="http://tutor.pgyxwd.com/backend/Auth/adminUserUppwd">
            <Button type="ghost" size="large" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>
        <FormItem label="头像: " prop="assistant">
          <img v-if="is_edit || assis_show" class="qrcode-pic" :src="infoForm.long_assistant" alt="">
          <Upload class="upload-btn" :before-upload="HandleAssistant" action="http://tutor.pgyxwd.com/backend/Auth/adminUserUppwd">
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
      is_area: 0,
      iptWidth: '250px',
      modelTitle: '新增助教',
      img_show: false,
      assis_show: false,
      is_edit: false,
      if_show: false,
      edit_id: '',
      infoForm: {
        name: '',
        wechat: '',
        phone: '',
        isAll: false,
        city: [],
        status: '',
        qrcode: '',
        long_qrcode: '',
        assistant: '',
        long_assistant: ''
      },
      info_rule: {
        name: [{required:true,message:'请输入姓名'}],
        wechat: [{required:true,message:'请输入微信号'}],
        phone: [{required:true,message:'请输入手机号'}],
        status: [{required:true,message:'请输入在职状态'}],
        qrcode: [{required:true,message:'请上传二维码'}],
        assistant: [{required:true,message:'请上传头像'}]
      },
      cityVal: [],
      cityData: [],
      province: [],
      provinceTags: []
    }
  },

  created(){
    this.axios.get('city-list').then(d=>{
      this.cityData = d.data.list;
      this.$emit('check', d.data.is_area);
      this.is_area = d.data.is_area;
    })
  },

  watch: {
    if_show(val){
      if(!val){
        this.$refs['info_form'].resetFields();
      }
    }
  },

  computed: {
    cityArr(){
      let newArr = [];
      this.cityData.forEach(val=>{
        if(this.province.indexOf(val.value) > -1){
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

    HandleAssistant(file){
      this.$uploadPic(file, 'assistant').then(res=>{
        this.assis_show = true;
        this.infoForm.long_assistant = res.base64;
        this.infoForm.assistant = res.short_pic;
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
      this.cityVal = [];
      this.province = [];
      this.provinceTags = [];
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

      this.$refs['info_form'].validate(valid=>{
        if(valid){
          return;
        }
      });
      //params.city = params.city.join(',');
      if(params.name === ''){
        error_msg = '姓名不能为空！';
      }else if(params.phone === ''){
        error_msg = '手机号不能为空！';
      }else if(params.status === ''){
        error_msg = '请选择在职状态！';
      }else if(params.qrcode === ''){
        error_msg = '请上传二维码！'
      }
      if(error_msg !== ''){
        this.$Message.error(error_msg);
        return;
      }
      params.is_country = params.isAll?1:0;
      let p_arr = [],
          c_arr = [];
      this.provinceTags.forEach(val=>{
        if(val.color == 'red'){
          p_arr.push(val.name)
        }
      });
      this.cityVal.forEach(val=>{
        c_arr.push(val.split('/')[1]);
      });
      params.province = p_arr.join(',');
      params.city = c_arr.join(',');

      this.axios.post(url, params).then(d=>{
        if(d.status === 1){
          this.if_show = false;
          this.$Message.success(d.message);
          this.$emit('optOver');
        }
      })
    },

    getProvince(val){
      if(val == ""){
        return;
      }
      this.provinceTags.push({
        color: 'red',
        name: val
      });
      this.province.push(val);

    },

    rmProvince(e, name){
      let tagIndex = '';
      this.provinceTags.forEach((val, index)=>{
        if(val.name == name){
          tagIndex = index
        }
      });
      const index = this.province.indexOf(name);
      this.province.splice(index, 1);
      this.provinceTags.splice(tagIndex, 1);
    },

    getCity(val){
      if(this.cityVal.indexOf(val.join('/')) > -1){
        return;
      }
      this.provinceTags.map((vval, index)=>{
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
      let province = name.split('/')[0],
          p_status = true;
      this.cityVal.forEach(val=>{
        if(val.indexOf(province) > -1){
          p_status = false
        }
      });
      if(p_status){
        this.provinceTags.map((val, index)=>{
          if(val.name == province){
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
          }else if(label === 'isAll'){
            this.infoForm.isAll = row.is_country == 1?true:false;
          }else if(label === 'province'){

          }else{
            this.infoForm[label] = row[label]
          }
        });

        if(row.province !== ''){
          this.provinceTags = [];
          this.province = [];
          row.province.split(',').forEach(val=>{
            this.provinceTags.push({
              color: 'red',
              name: val
            });
            this.province.push(val);
          })
        }

        if(row.city !== ''){
          this.cityVal = [];
          row.city.split(',').forEach(val=>{
            this.cityData.forEach(pVal=>{
              pVal.children.forEach(cVal=>{
                if(val == cVal.value){
                  this.cityVal.push(`${pVal.value}/${val}`);
                  if(this.province.indexOf(pVal.value) == -1){
                    this.province.push(pVal.value);
                    this.provinceTags.push({
                      color: 'blue',
                      name: pVal.value
                    })
                  }
                }
              })
            })
          })
        }


        console.log(this.province);
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
