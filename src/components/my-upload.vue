<template>
<div id="my-upload">
  <div class="" @click="upload">
    <Button>上传图片</Button>
    <input type="file" ref="upload_input" @change="add_img($event)">
  </div>
</div>
</template>
<script>
export default {
  name: "my-upload",
  data: () => ({

  }),
  props:{
    format:{
      type: Array
    }
  },
  methods: {
    upload() {
      this.$refs.upload_input.click();
    },
    add_img(ev) {
      const reader = new FileReader(),
        img1 = ev.target.files[0],
        that = this;
      let type = img1.name.split('.')[img1.name.split('.').length-1];
      if(this.format && this.format.indexOf(type) == -1){
        let str = '';
        for(let i = 0;i<this.format.length;i++){
          str+=i==0?this.format[i]:'、'+this.format[i]
        }
        this.$Message.error(`上传类型只能为${str}中的一个`)
        return;
      }
      reader.readAsDataURL(img1);
      reader.onload = function() {
        that.axios.post('upload-img',{
          img: [this.result],
          type: 'product'
        }).then(res=>{
          if(res){
            that.$emit('success',res.data.list)
          }
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
#my-upload {
    float:left;
    >div{
      display:inline-block;
      position:relative;
      input{
        display:none;
        position:absolute;
        top:0;
        left:0;
      }
      // width:300px;
    }
}
</style>
