<template>
<div id="tableContainer">
  <Card>
    <div class="title" slot="title">
      <div class="label">
        <Icon type="clipboard"></Icon>
        数据列表
      </div>
      <div class="btn-group">
        <slot name="btn"></slot>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
    <div class="page-style" v-if="page">
      <my-page></my-page>
    </div>
  </Card>
</div>
</template>
<script>
export default {
  name: "tableContainer",
  props: {
    page: {
      type: Boolean,
      default: false
    },
    pageprops: {
      type: Object,
      default: function() {
        return {
          current: 1,
          showSizer: true
        }
      }
    }
  },
  data: () => ({}),
  methods: {
    pageChange(page) {
      this.$emit('on-change',page)
    },
    pageSizeChange(size){
      this.$emit('on-page-size-change',size)
    }
  },
  components: {
    myPage: {
      functional: true,
      render: function(h,context) {
        return h('Page',{
          props: context.parent.pageprops,
          on:{
            'on-change': function(page) {
              context.parent.pageChange(page)
            },
            'on-page-size-change': function(size) {
              context.parent.pageSizeChange(size)
            }
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#tableContainer {
    margin-bottom: 20px;
    .title {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label {
            font-size: 15px;
        }
    }
    .content {
        padding-right: 20px;
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        .input-group {
            display: flex;
            align-items: center;
            margin-left: 20px;
            margin-bottom: 20px;
            .label {
                white-space: nowrap;
                margin-right: 10px;
            }
        }
    }
    .page-style {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        margin-top: 20px;
    }
}
</style>
