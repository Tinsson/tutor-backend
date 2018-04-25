<template lang="html">
<div class="coin-config">
  <div id="titleBar">
    <div class="title">
      基本配置
    </div>
  </div>
  <table-container title="价格配置">
    <Table :columns="prize_cols" :data="prize_data" border :loading="tableLoading"></Table>
  </table-container>
  <table-container title="重新定位距离配置">
    <Table :columns="pos_cols" :data="pos_data" border></Table>
  </table-container>
  <table-container title="投诉项配置">
    <Button slot="btn" type="info" size="large" @click="addData">添加</Button>
    <Table :columns="compl_cols" :data="compl_data" border></Table>
  </table-container>
  <Modal v-model="if_show" cancel-text width="300" title="新增投诉项" @on-ok="upload">
    <Row type="flex" justify="center">
      <Col span="20">
        <div style="padding-bottom: 10px">投诉项名称</div>
        <Input v-model="newData.val" number placeholder="请输入投诉项名称"></Input> <br> <br>
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
      prize_cols: [{
        title: '序号',
        type: 'index',
        align: 'center'
      }, {
        title: '类型',
        key: 'namecn',
        align: 'center',
      }, {
        title: '金额（元）',
        key: 'value',
        align: 'center',
        render: (h, params) => {
          if(params.row.edit){
            return h('input', {
              'class': {
                table_ipt: true
              },
              domProps: {
                value: params.row.value
              },
              on: {
                keyup: (e)=>{
                  if(e.code === "Enter") {
                    console.log(this.prize_edit);
                    this.savePrize(this.prize_edit, params.row.id);
                  }
                },
                input: (e)=>{
                  //console.log(e);
                  this.prize_edit = e.target.value;
                },
                blur: ()=>{
                  this.prize_data.map(val=>{
                    val.edit = false;
                    return val;
                  });
                }
              }
            });
          }else{
            return h('div',{
              on: {
                click: ()=>{
                  this.prize_edit = params.row.value;
                  this.handleEditPrize(params.row.id);
                }
              }
            }, params.row.value);
          }
        }
      }],
      prize_data: [],
      prize_edit: '',

      pos_cols: [{
        title: '序号',
        type: 'index',
        align: 'center'
      }, {
        title: '类型',
        key: 'namecn',
        align: 'center',
      }, {
        title: '距离（km）',
        key: 'value',
        align: 'center',
        render: (h, params) => {
          if(params.row.edit){
            return h('input', {
              'class': {
                table_ipt: true
              },
              domProps: {
                value: params.row.value
              },
              on: {
                keyup: (e)=>{
                  if(e.code === "Enter") {
                    console.log(this.prize_edit);
                    this.savePrize(this.prize_edit, params.row.id);
                  }
                },
                input: (e)=>{
                  //console.log(e);
                  this.prize_edit = e.target.value;
                },
                blur: ()=>{
                  this.pos_data.map(val=>{
                    val.edit = false;
                    return val;
                  });
                }
              }
            });
          }else{
            return h('div',{
              on: {
                click: ()=>{
                  this.prize_edit = params.row.value;
                  this.handleEditPos(params.row.id);
                }
              }
            }, params.row.value);
          }
        }
      }],
      pos_data: [],

      compl_cols: [{
        title: '序号',
        type: 'index',
        align: 'center'
      }, {
        title: '类型',
        key: 'namecn',
        align: 'center',
        render: (h, params)=>{
          if(params.row.edit){
            return h('input', {
              'class': {
                table_ipt: true
              },
              domProps: {
                value: params.row.namecn
              },
              on: {
                keyup: (e)=>{
                  if(e.code === "Enter") {
                    console.log(this.prize_edit);
                    this.saveCompl(this.prize_edit, params.row.id);
                  }
                },
                input: (e)=>{
                  //console.log(e);
                  this.prize_edit = e.target.value;
                },
                blur: ()=>{
                  this.compl_data.map(val=>{
                    val.edit = false;
                    return val;
                  });
                }
              }
            });
          }else{
            return h('div',{
              on: {
                click: ()=>{
                  this.prize_edit = params.row.namecn;
                  this.handleEditCompl(params.row.id);
                }
              }
            }, params.row.namecn);
          }
        }
      },{
        title: '操作',
        align: 'center',
        render: (h, params)=>{
          return h('Button', {
            props:{
              type: 'error'
            },
            on: {
              click: ()=>{
                this.handleDelCompl(params.row.id)
              }
            }
          },'删除')
        }
      }],
      compl_data: [],
      if_show: false,
      key: '',
      newData: {
        val: ''
      },
      type: 0, //0位充值 1位编辑
      tableLoading: false
    }
  },
methods: {
    clear(){
      this.newData={
        val: ''
      }
    },
    addData() {
      this.clear();
      this.if_show = true;
      this.type = 0;
    },
    upload() {
      this.axios.get('set-complain',{
        params: {...this.newData}
      }).then(
        (res)=>{
          if (res.status == 1) {
            this.$Message.info('添加成功')
            this.getData()
          }
        }
      )
    },
    handleEditPrize(id){
      this.prize_data.map(val=>{
        if(val.id === id){
          val.edit = true;
        }else{
          val.edit = false;
        }
        return val;
      });
    },
    handleDelCompl(id){
      this.axios.get('del-complain',{
        id
      }).then(d=>{
        this.$Message.success(d.message);
        this.getData();
      })
    },
    savePrize(val, id){
      this.axios.get('set-conf-amount',{
        params: {
          id,val
        }
      }).then(d=>{
        this.$Message.success(d.message);
        this.getData();
      })
    },

    saveCompl(val, id){
      this.axios.get('set-complain',{
        params: {
          id,val
        }
      }).then(d=>{
        this.$Message.success(d.message);
        this.getData();
      })
    },

    handleEditPos(id){
      this.pos_data.map(val=>{
        if(val.id === id){
          val.edit = true;
        }else{
          val.edit = false;
        }
        return val;
      });
    },

    handleEditCompl(id){
      this.compl_data.map(val=>{
        if(val.id === id){
          val.edit = true;
        }else{
          val.edit = false;
        }
        return val;
      });
    },

    getData() {
      this.tableLoading = true
      this.axios('get-conf-list').then(
        (res)=>{
          this.tableLoading = false
          if(res.status === 1){
            let p_data = [],
                pos_data = [],
                compl_data = [];
            res.data.forEach(val=>{
              val.edit = false;
              if(val.type === 1){
                p_data.push(val);
              }else if(val.type === 2){
                pos_data.push(val);
              }else if(val.type === 3){

                compl_data.push(val);
              }
            });
            this.prize_data = p_data;
            this.pos_data = pos_data;
            this.compl_data = compl_data;
          }

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
.table_ipt{
  width: 300px;
  height: 50px;
}
</style>
