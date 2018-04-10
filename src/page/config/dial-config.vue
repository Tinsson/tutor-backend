<template lang="html">
<div class="dial-config">
  <div id="titleBar">
    <div class="title">
      大转盘配置
    </div>
    <Button type="info" size="large" @click="addData">添加</Button>
  </div>
  <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>

  <Modal v-model="if_show" cancel-text width="300" title="添加配置" @on-ok="upload">
    <Row type="flex" justify="center">
      <Col span="20">
        <Input v-model="newData.sequence" number placeholder="位置"></Input> <br> <br>
        <Input v-model="newData.reward" placeholder="奖项"></Input> <br> <br>
        <Input v-model="newData.prize" placeholder="文案"></Input> <br> <br>
        <Select v-model="newData.type" placeholder="单位">
          <Option value='0'>金币</Option>
          <Option value='1'>元</Option>
        </Select> <br> <br>
        <Input v-model="newData.rate" number placeholder="概率 0~100"></Input>
      </Col>
    </Row>
  </Modal>
</div>
</template>

<script>
export default {
  data(){
    return {
      columns: [{
        title: '位置',
        key: 'sequence',
        align: 'center'
      }, {
        title: '奖项',
        align: 'center',
        render:(h,params)=>{
          let unit = params.row.type?'元':'金币'
          return h('span',params.row.reward+' '+unit)
        }
      }, {
        title: '文案',
        key: 'prize',
        align: 'center'
      }, {
        title: '概率',
        key: 'rate',
        align: 'center',
        render:(h,params)=>{
          return h('span',params.row.rate + '%')
        }
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
                  this.rewrite(params.row)
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error'
              },
              on: {
                click: () => {
                  this.axios.get('del-bwheel', {
                    params: {
                      id: params.row.id
                    }
                  }).then((res) => {
                    if (res.status === 1) {
                      this.$Message.info('删除成功')
                      this.getData();
                    }
                  })
                }
              }
            }, '删除')
          ])
        }
      }],
      myData: [],
      tableLoading: false,
      if_show: false,
      type: 0,
      key:0,
      newData: {
        sequence: '',
        prize: '',
        reward: '',
        rate: '',
        type:''
      }
    }
  },
  methods: {
    clearData() {
      this.newData = {
        sequence: '',
        prize: '',
        reward: '',
        rate: '',
        type:''
      }
    },
    addData() {
      this.clearData();
      this.if_show = true;
      this.type = 0;
    },
    rewrite(row) {
      this.key = row.id;
      this.newData.sequence = row.sequence;
      this.newData.prize = row.prize;
      this.newData.reward = row.reward;
      this.newData.rate = row.rate;
      this.if_show = true;
      this.type = 1;
    },
    upload() {
      if (this.type == 0) {
        this.axios.post('add-bwheel', {
          ...this.newData
        }).then(
          (res) => {
            if (res.status == 1) {
              this.$Message.info('添加成功')
              this.getData()
            }
          }
        )
      } else {
        this.axios.post('edit-bwheel', {
          id: this.key,
          ...this.newData
        }).then((res) => {
          if (res.status == 1) {
            this.$Message.info('编辑成功')
            this.getData()
          }
        })
      }
    },
    getData() {
      this.axios.get('bwheel-list').then((res) => {
        this.myData = res.data.list
      })
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style lang="scss" scoped>
.dial-config {
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
</style>
