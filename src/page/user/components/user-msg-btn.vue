<template>
  <div id="userMsgBtn">
    <!-- 群发短信模态框 -->
    <Button type="ghost" @click="duanxin_modal=true">群发短信</Button>
    <Button type="success" @click="zn_modal=true">群发站内信</Button>
    <Button type="error" @click="app_modal=true">APP推送</Button>
    <Button type="warning" @click="money_modal=true">赠送秘币</Button>
    <Button type="info">导出数据</Button>
    <Modal v-model="duanxin_modal" title="群发短信">
      <div class="duanxin-container">
        <Form ref="duanxin_form" :model="duanxin_form" :rules="duanxin_rule" :label-width="80">
          <FormItem label="发送对象:">
            共<span style="color:red">{{duanxin_form.send_type=='勾选的用户'?select.length:total}}</span>个用户
          </FormItem>
          <FormItem label="发送类型:">
            <RadioGroup v-model="duanxin_form.send_type">
              <Radio label="勾选的用户"></Radio>
              <Radio label="全部用户"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="短信内容:" prop="content">
            <Input type="textarea" :maxlength="500" v-model="duanxin_form.content"></Input>
          </FormItem>
          <FormItem>
            <div>
              发送时系统会自动在结尾追加【优品汇】，请勿重复添加。
            </div>
            <div>
              内容上线不能超过<span class="red">500</span>字，当前已输入<span class="red">3</span>字，将作为<span class="red">1</span>条发送
            </div>
          </FormItem>
          <FormItem label="发送统计">
            <span style="margin-right:10px;">发送条数：<span class="red">20</span>条</span> <span>可用短信条数：<span class="red">100000</span>条 </span>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button>取消</Button>
        <Button type="primary" @click="duanxin_submit" :loading="duanxin_modal_loading">确定</Button>
      </div>
    </Modal>

    <!-- 群发站内信模态框 -->
    <Modal v-model="zn_modal" title="群发站内信">
      <div class="duanxin-container">
        <Form ref="zn_form" :model="zn_form" :rules="zn_rule" :label-width="80">
          <FormItem label="发送对象:">
            共<span style="color:red">{{zn_form.send_type=='勾选的用户'?select.length:total}}</span>个用户
          </FormItem>
          <FormItem label="发送类型:">
            <RadioGroup v-model="zn_form.send_type">
              <Radio label="勾选的用户"></Radio>
              <Radio label="全部用户"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="标题:" prop="title">
            <Input v-model="zn_form.title" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="短信内容:" prop="content">
            <Input type="textarea" :maxlength="100" v-model="duanxin_form.content"></Input>
          </FormItem>
          <FormItem>
            <div>
              站内信标题不能超过<span class="red">20</span>个字，内容不能超过<span class="red">100</span>个字
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button>取消</Button>
        <Button type="primary" @click="zn_submit" :loading="zn_modal_loading">确定</Button>
      </div>
    </Modal>

    <!-- APP推送模态框 -->
    <Modal v-model="app_modal" title="APP推送">
      <div class="app-container">
        <Form ref="app_form" :model="app_form" :rules="app_rule" :label-width="80">
          <FormItem label="发送对象:">
            共<span style="color:red">{{app_form.send_type=='勾选的用户'?select.length:total}}</span>个用户
          </FormItem>
          <FormItem label="发送类型:">
            <RadioGroup v-model="app_form.send_type">
              <Radio label="勾选的用户"></Radio>
              <Radio label="全部用户"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="推送类型:">
            <RadioGroup v-model="app_form.push_type">
              <Radio label="链接"></Radio>
              <Radio label="专题"></Radio>
              <Radio label="活动"></Radio>
              <Radio label="商品"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="推送链接:" prop="url" v-if="app_form.push_type == '链接'">
            <Input v-model="app_form.url"></Input>
          </FormItem>
          <FormItem :label="'选择'+app_form.push_type+':'" prop="choose" v-if="app_form.push_type != '链接'">
            <div class="chose-btn">

            </div>
          </FormItem>
          <FormItem label="推送标题:" prop="title">
            <Input v-model="app_form.title" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="推送内容:" prop="content">
            <Input :maxlength="100" v-model="app_form.content"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button>取消</Button>
        <Button type="primary" @click="zn_submit" :loading="zn_modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="money_modal" title="赠送秘币">
      <Form ref="money_form" :model="money_form" :rules="money_rule" :label-width="80">
        <FormItem label="发送对象:">
          共<span style="color:red">{{money_form.send_type=='勾选的用户'?select.length:total}}</span>个用户
        </FormItem>
        <FormItem label="发送类型:">
          <RadioGroup v-model="money_form.send_type">
            <Radio label="勾选的用户"></Radio>
            <Radio label="全部用户"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="秘币数量:">
          <Input v-model="app_form.url"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button>取消</Button>
        <Button type="primary" @click="money_submit" :loading="money_modal_loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "userMsgBtn",
  props: {
    select: {
      type: Array
    },
    total: {
      type: [String,Number]
    }
  },
  data: () => ({
    //赠送秘币
    money_modal: false,
    money_form: {
      send_type: '勾选的用户',
      num: ''
    },
    money_modal_loading:false,
    money_rule: {
      money: [{
        required: true,
        message: '请输入要赠送的秘币数量',
        trigger: 'blur'
      }],
    },


    // 短信群发
    duanxin_modal: false,
    duanxin_form: {
      send_type: '勾选的用户',
      content: ''
    },
    duanxin_rule: {
      content: [{
        required: true,
        message: '请填写短信内容',
        trigger: 'blur'
      }],
    },
    duanxin_modal_loading: false,

    // 站内群发
    zn_modal: false,
    zn_form: {
      send_type: '勾选的用户',
      title: '',
      content: '',
    },
    zn_rule: {
      content: [{
        required: true,
        message: '请填写发送内容',
        trigger: 'blur'
      }],
      title: [{
        required: true,
        message: '请填写发送标题',
        trigger: 'blur'
      }],
    },
    zn_modal_loading: false,

    // APP推送
    app_modal: false,
    app_form: {
      send_type: '勾选的用户',
      push_type: '链接',
      url: ''
    },
    app_rule: {
      content: [{
        required: true,
        message: '请填写推送内容',
        trigger: 'blur'
      }],
      title: [{
        required: true,
        message: '请填写推送标题',
        trigger: 'blur'
      }],
      url: [{
        required: true,
        message: '请填写推送链接',
        trigger: 'blur'
      }],
      choose: [{
        required: true,
        message: '请选择',
        trigger: 'blur'
      }]
    },
    app_modal_loading: false,
  }),
  methods: {
    duanxin_submit() {
      this.$refs.duanxin_form.validate((valid) => {
        if (valid) {
          this.duanxin_modal_loading = true
          setTimeout(() => {
            this.duanxin_modal_loading = false
            this.duanxin_modal = false
          }, 2000)
        }
      })
    },
    zn_submit() {

    },
    money_submit() {}
  }
}
</script>
<style lang="scss" scoped>
.red {
    color: red;
}
.app-container{
  .chose-btn{
    height:33px;
    background:#eee;
    border-radius:5px;
    cursor: pointer;
  }
}
</style>
