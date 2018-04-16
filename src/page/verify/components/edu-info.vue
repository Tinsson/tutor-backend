<template>
  <div id="bigPic">
    <Modal
      v-model="State"
      :width="800"
      :styles="{top: '20px',zIndex: '10'}"
      @on-cancel="CloseBtn">
      <div class="content-box">
        <img class="edu-pic" :src="Img" alt="">
        <div class="text-box">
          <p class="line">学校：{{school}}</p>
          <p class="line">学历：{{edu}}</p>
          <p class="line">入学年份：{{firstYear}}</p>
          <p class="line">姓名：{{name}}</p>
          <p class="line">专业：{{major}}</p>
        </div>
      </div>
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
      Img: '',
      school: '',
      firstYear: '',
      major: '',
      edu: '',
      name: ''
    }
  },
  methods: {
    CloseBtn(){
      this.State = false;
    },
    show(row){
      this.State = true;
      this.Img = row.edu_url;
      this.school = row.edu_school;
      this.firstYear = row.edu_addschool;
      this.edu = row.edu_diploma;
      this.name = row.edu_name;
      this.major = row.edu_professional;
    }
  }
}
</script>
<style lang="scss" scoped>
  .content-box{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .edu-pic{
      max-width: 500px;
      max-height: 800px;
      display: inline-block;
      object-fit: cover;
    }
    .text-box{
      width: 250px;
      padding-bottom: 50px;
      font-size: 16px;
    }
  }
</style>
