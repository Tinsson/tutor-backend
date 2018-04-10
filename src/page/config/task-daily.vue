<template>
  <div id="task-daily">
    <title-bar title="每日任务" @refresh="refresh"></title-bar>
    <table-container>
      <div slot="btn">
        <Button type="primary" @click="add_task">新增任务</Button>
      </div>
      <Table :columns="columns" :data="myData" border :loading="tableLoading"></Table>
    </table-container>

    <add-task ref="add_task" :task_form="task_form" :type="2" @modal-close="modalClose"></add-task>
  </div>
</template>
<script>
import addTask from './components/add-task.vue'
export default {
  name: "task-daily",
  data() {
    return {
      task_form: {
        task_type: [],
        money: null,
        num: null
      },

      columns: [
        {
          title: 'id',
          key: 'id',
          align: 'center'
        },{
          title: '任务名称',
          key: 'name',
          align: 'center'
        }, {
          title: '任务条件',
          key: 'count',
          align: 'center'
        }, {
          title: '秘币奖励',
          key: 'price',
          align: 'center'
        }, {
          title: '创建时间',
          key: 'created_at',
          align: 'center'
        }, {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h,params)=>{
            return h('span',params.row.status == 1?'上架中':'已下架')
          }
        },{
          title: '操作',
          key: 'operation',
          align: 'center',
          width:220,
          render: (h, params) => {
            return h('div', [
              h('Poptip', {
                props: {
                  confirm: true,
                  title: params.row.status == 1?'确定要下架吗？':'确定要上架吗？'
                },
                on: {
                  'on-ok': ()=>{
                    // params.row.status = params.row.status==1?2:1
                    this.toggle_task_status(params.row)
                  }
                }
              },[
                h('Button',{
                  props:{
                    type: 'text'
                  }
                },params.row.status==1?'下架':'上架')
              ]),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: ()=>{
                    this.$set(this.task_form.task_type,0,params.row.name_id);
                    this.$set(this.task_form.task_type,1,params.row.force_id+'-'+params.row.unit_id)
                    this.$set(this.task_form,'id',params.row.id);
                    this.task_form.money = parseFloat(params.row.price);
                    this.task_form.num = parseFloat(params.row.count);
                    this.$refs.add_task.show();
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      myData: [],
      tableLoading: false,
    }
  },
  methods: {
    toggle_task_status(task) {
      this.tableLoading = true;
      this.axios.post('task-edit',{
        id: task.id,
        status: task.status==1?2:1,
      }).then(res=>{
        this.tableLoading = false
        if(res){
          this.getData();
        }
      })
    },
    modalClose() {
      this.task_form = {
        task_type: [],
        money: null,
        num: null
      }
    },
    add_task() {
      this.$refs.add_task.show();
    },

    refresh() {
      this.getData();
    },
    getData() {
      this.tableLoading = true;
      this.axios.get(`task-list?type=2`).then(res=>{
        this.tableLoading = false;
        if(res){
          this.myData = res.data.task_list
        }
      })
    },
  },
  components: {
    addTask
  },
  mounted() {
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
</style>
