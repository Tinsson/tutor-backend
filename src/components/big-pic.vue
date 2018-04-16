<template>
  <div id="bigPic">
    <Modal
      v-model="State"
      :width="this.Width + 30"
      :title="titleTxt"
      :styles="{top: '20px',zIndex: '10'}"
      @on-cancel="CloseBtn">
      <img class="big-img" :style="{maxWidth: this.Width+'px'}" :src="Img" alt="">
      <div slot="footer">
        <Button type="error" @click="CloseBtn">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'ThirdModal',
  data () {
    return{
      State: false,
      Img: this.InitData,
      Width: this.maxWidth
    }
  },
  props: {
    InitData: String,
    maxWidth: Number,
    titleTxt: String
  },
  watch: {
    InitData(val){
      this.Img = val;
    },
    maxWidth(val){
      this.Width = val;
    }
  },
  methods: {
    CloseBtn(){
      this.State = false;
    },
    show(img){
      this.State = true;
      this.Img = img;
    }
  }
}
</script>
<style lang="scss" scoped>
  .big-img{
    display: inline-block;
  }
</style>
