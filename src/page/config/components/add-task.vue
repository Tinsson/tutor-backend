<template>
  <div id="addTask">
    <Modal v-model="if_show" title="添加任务" width="600" @on-visible-change="close">
      <Form ref="task_form" :model="task_form" :rules="task_rules" :label-width="80">
        <FormItem label="任务详情:" prop="task_type">
          <Cascader :data="task_data" v-model="task_form.task_type"></Cascader>
        </FormItem>
        <FormItem label="任务限制:" prop="num">
          <InputNumber :min="1" :step="1" v-model="task_form.num"></InputNumber>
        </FormItem>
        <FormItem label="奖励秘币:" prop="money">
          <InputNumber :min="0" :step="1" v-model="task_form.money"></InputNumber>
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
  name: "addTask",
  props: {
    task_form: {
      type: Object,
      default: function() {
        return {
          task_type: [],
          money: null,
          num: null
        }
      }
    },
    type: {  //1:新手任务，2：每日任务
      type: [String,Number]
    }
  },
  data() {
    function check_task_type(rule,value,callback) {
      if(value.length == 0){
        callback(new Error('请完善任务详情'))
      }else{
        callback()
      }
    }
    function check_task_money(rule,value,callback) {
      if(value<0.01){
        callback(new Error('奖励秘币不得小于0.01'))
      }else{
        callback()
      }
    }
    return {
      task_list:[],

      if_show: false,
      task_rules: {
        task_type: [
          {required: true,message: '请选择任务详情'},
          {validator: check_task_type}
        ],
        num: [
          {required: true,message: '请填写任务限制'},
        ],
        money: [
          {required: true,message: '请填写奖励秘币金额'},
          {validator: check_task_money}
        ]
      },
      task_data: [],
    }
  },
  methods: {
    show() {
      this.if_show = true;
    },
    submit() {
      this.$refs.task_form.validate((valid)=>{
        if(valid) {
          if(this.task_form.id == undefined) {
            //新增任务
            let obj = [{
              name_id: this.task_form.task_type[0],
              force_id: this.task_form.task_type[1].split('-')[0],
              unit_id: this.task_form.task_type[1].split('-')[1],
              price: this.task_form.money,
              count: this.task_form.num,
              type: this.type
            }]
            this.axios.post('task-add',{
              task_json: JSON.stringify(obj)
            }).then(res=>{
              if(res){
                this.if_show = false;
                this.$parent.refresh();
              }
            })
          } else {
            //编辑任务
            this.axios.post('task-edit',{
              id: this.task_form.id,
              name_id: this.task_form.task_type[0],
              force_id: this.task_form.task_type[1].split('-')[0],
              unit_id: this.task_form.task_type[1].split('-')[1],
              price: this.task_form.money,
              count: this.task_form.num,
            }).then(res=>{
              if(res){
                this.if_show = false;
                this.$parent.refresh();
              }
            })
          }

        }
      })
    },
    close(cur) {
      if(!cur) {
        this.$emit('modal-close')
      }
    }
  },
  mounted() {
    this.axios.get('task-name-list').then(res=>{
      if(res){
        this.task_list = res.data.name_list
        for(let i = 0; i<this.task_list.length;i++){
          let obj = {}
          this.$set(obj,'label',this.task_list[i].name);
          this.$set(obj,'value',this.task_list[i].name_id);
          this.$set(obj,'children',[])
          for(let k = 0;k<this.task_list[i].type.length;k++) {
            this.$set(obj.children,k,{});
            this.$set(obj.children[k],'label',this.task_list[i].type[k].force_name+'（'+this.task_list[i].type[k].unit_name+'）');
            this.$set(obj.children[k],'value',this.task_list[i].type[k].force_id+'-'+this.task_list[i].type[k].unit_id);
          }
          this.$set(this.task_data,i,obj)
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
