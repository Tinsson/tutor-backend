<template>
  <div id="defaultPage">
    <h1 @click="show">欢迎使用小程序（家教汪）后台管理系统12345</h1>
  </div>
</template>
<script>
export default {
  name: "defaultPage",
  data: () => ({

  }),
  methods: {
    show() {
      console.log(location.hash);
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
