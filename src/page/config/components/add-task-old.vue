<template>
  <div id="add-task">
    <Modal v-model="if_show" title="添加任务" width="600">
      <table-container>
        <div slot="btn">
          <Button type="primary" @click="add">新增条件</Button>
        </div>
        <Table :columns="columns" :data="myData"></Table>
      </table-container>
      <Form ref="mb_form" :model="mb_form" :rules="mb_rules" :label-width="120">
        <FormItem label="任务奖励秘币：" prop="money">
          <InputNumber :min="0.01" :step="1" v-model="mb_form.money"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "add-task",
  data() {
    return {
      if_show: false,
      timer: null,
      mb_form: {
        money: 0.01
      },
      mb_rules: {
        money: [
          { required: true, message: '请输入秘币奖励金额' }
        ]
      },

      columns: [
        {
          title: '行为',
          key: 'a',
          align: 'center',
          render: (h,params)=>{
            return h('Select',{
              props: {
                value: this.sendData[params.index].action
              },
              on: {
                'on-change': (value) => {
                  this.$set(this.sendData[params.index],'action',value);
                  params.row.second = false;
                  this.timer = setTimeout(()=>{
                    params.row.second = true;
                    clearTimeout(this.timer);
                    this.timer = null;
                  },0)
                }
              }
            },[
              h('Option',{
                props: {
                  value: '普通通话',
                }
              },'普通通话'),
              h('Option',{
                props: {
                  value: '随机电话',
                }
              },'随机电话')
            ])
          }
        },{
          title: '约束',
          key: 'b',
          align: 'center',
          render: (h,params)=>{
            if(this.sendData[params.index].action == '普通通话' && params.row.second) {
              return h('Select',{
                  props: {
                    value: this.sendData[params.index].condition
                  },
                  on: {
                    'on-change': (value) => {
                      this.$set(this.sendData[params.index],'condition',value)
                    }
                  }
                },this.options['普通通话'].map(function(item){
                  return h('Option',{
                    props: {
                      value: item
                    }
                  },item)
                }))
            } else if (this.sendData[params.index].action == '随机电话' && params.row.second) {
              return h('Select',{
                  props: {
                    value: this.sendData[params.index].condition
                  },
                  on: {
                    'on-change': (value) => {
                      this.$set(this.sendData[params.index],'condition',value)
                    }
                  }
                },this.options['随机电话'].map(function(item){
                  return h('Option',{
                    props: {
                      value: item
                    }
                  },item)
                }))
            } else {
              return h('div',[
                h('Select')
              ])
            }
          }
        },{
          title: '数量',
          key: 'c',
          align: 'center',
          render: (h,params)=>{
            return h('InputNumber',{
              props: {
                min: 1,
                precision: 0,
                value: this.sendData[params.index].num
              },
              on: {
                'on-change': (value) => {
                  this.$set(this.sendData[params.index],'num',value)
                }
              }
            })
          }
        },{
          title: '操作',
          key: 'd',
          align: 'center',
          render: (h,params)=>{
            return h('Button',{
              props: {
                type:'error'
              },
              on:{
                click: ()=>{
                  this.myData.splice(params.index,1);
                  this.sendData.splice(params.index,1);
                }
              }
            },'删除')
          }
        }
      ],
      myData:[],
      sendData: [],
      options: {
        '普通通话': ['次数','时间'],
        '随机电话': ['价格','名字']
      },
    }
  },
  methods: {
    show() {
      this.if_show = true;
    },
    add() {
      this.myData.push({second:true}),
      this.sendData.push({num:1})
    },
    submit() {
      console.log(this.sendData);
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
