<template>
  <div class="first-model">
    <Modal v-model="if_show" title="首课时间表">
      <div class="content">
        <div class="info-box">
          订单号：
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveCourse">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "first-class-model",
    data(){
      return{
        is_edit: false,
        if_show: false,
      }
    },
    methods: {
      show(){
        this.if_show = true;
      },
      saveCourse(){

      }
    }
  }
</script>

<style scoped>

</style>
