<template lang="html">
<div class="coin-config">
  <div id="titleBar">
    <div class="title">
      金币配置
    </div>
    <Button type="info" size="large" @click="addData">添加</Button>
  </div>

  <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>

  <Modal v-model="if_show" cancel-text width="300" title="添加充值" @on-ok="upload">
    <Row type="flex" justify="center">
      <Col span="20">
        <span>金额</span>
        <Input v-model="newData.money" number placeholder="请输入充值金额"></Input> <br> <br>
        <span>金币</span>
        <Input v-model="newData.coin" number placeholder="请输入充值金币"></Input>
      </Col>
    </Row>
  </Modal>
</div>
</template>

<script>
export default {
  name: 'coin-config',
  data() {
    return {
      columns: [{
        title: '序号',
        type: 'index',
        align: 'center'
      }, {
        title: '金币',
        key: 'coin',
        align: 'center',
      }, {
        title: '金额',
        key: 'money',
        align: 'center',
        sortType:'asc'
      }, {
        title: '操作',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: "info"
              },
              style: {
                marginRight: '20px'
              },
              on: {
                click: () => {
                  this.rewrite(params.row.id)
                  this.newData.coin = params.row.coin
                  this.newData.money = params.row.money
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error'
              },
              on: {
                click: () => {
                  this.axios.get('del-virtual',{
                    params:{
                      id:params.row.id
                    }
                  }).then((res)=>{
                      if(res.status === 1){
                        this.$Message.info('删除成功')
                        this.getData();
                      }
                    }
                  )
                }
              }
            }, '删除')
          ])
        }
      }],
      myData: [],
      if_show: false,
      key: '',
      newData: {
        coin: '',
        money: ''
      },
      type: 0, //0位充值 1位编辑
      tableLoading: false
    }
  },
methods: {
    clear(){
      this.newData={
        coin:'',
        money:''
      }
    },
    addData() {
      this.clear();
      this.if_show = true;
      this.type = 0;
    },
    rewrite(a) {
      this.if_show = true;
      this.type = 1;
      this.key = a;
    },
    upload() {
      if (this.type == 0) {
        this.axios.post('add-virtual',{
          ...this.newData
        }).then(
          (res)=>{
            if (res.status == 1) {
              this.$Message.info('添加成功')
              this.getData()
            }
          }
        )
      } else {
        this.axios.post('edit-virtual',{
            id:this.key,
            ...this.newData
        }).then((res)=>{
          if (res.status == 1) {
            this.$Message.info('编辑成功')
            this.getData()
          }
        })
      }
    },
    getData() {
      this.tableLoading = true
      this.axios('virtual-list').then(
        (res)=>{
          this.myData = res.data.list
          this.tableLoading = false
        }
      )
    },
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.coin-config {
    #titleBar {
        .title {
            font-size: 25px;
        }
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
.input {
    width: 200px;
    font-size: 18px;
}
</style>
