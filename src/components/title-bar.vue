<template>
  <div id="titleBar">
    <div class="title">
      {{title}}
    </div>
    <Button type="info" icon="refresh" size="large" @click="refresh">重置刷新</Button>
  </div>
</template>
<script>
export default {
  name: "titleBar",
  props: ['title'],
  data: () => ({

  }),
  methods: {
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>
<style lang="scss" scoped>
#titleBar{
  .title{
    font-size:25px;
  }
  margin-bottom:20px;
  display:flex;
  justify-content: space-between;
  align-items: center;
}
</style>
