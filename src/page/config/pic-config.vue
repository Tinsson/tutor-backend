<template lang="html">
  <div class="pic-config">
    <div id="titleBar">
      <div class="title">
        图片配置
      </div>
      <Button type="info" size="large" @click="addData">添加</Button>
    </div>

    <Table :columns="columns" border :data="myData"></Table>

      <Modal v-model="add_show" :closable="false" title="添加图片" ok-text="上传" @on-ok="upload" @on-cancel='handleRemove'>
        <Row type="flex" justify="center">
          <Col span="14" v-if="have_pic">
            <img :src="newData.img" class="preview" width="260px"> <br>
            <span>文案</span>
            <Input type="textarea" v-model="newData.word" :row="2"></Input>
          </Col>
          <Col span="4">
            <Upload ref="upload"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :before-upload="handleBeforeUpload"
            action=""
            style="display: inline-block;width:58px;">
              <Button type="success" long >选择图片</Button>
            </Upload>
            <div v-if="have_pic&&!uploadType" class='msg'>
              <Input v-model='newData.class' placeholder='图片主题' style="width:100px"></Input>  <br><br>
              <Select v-model='newData.scenes' style="width:100px">
                <Option value='ask'>讨红包</Option>
                <Option value='share'>分享</Option>
                <Option value='send'>赏红包</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Modal>

      <scalePic ref='scalePic'></scalePic>

  </div>
</template>

<script>
import scalePic from '.././bonus/components/scalePic.vue'
import {
  copyObj
} from '@/utils/common'
export default {
  name: 'pic-config',
  data() {
    return {
      columns: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 80
      }, {
        title: '图片主题',
        key: 'class',
        align: 'center'
      }, {
        title: '图片',
        align: 'center',
        render: (h, params) => {
          return h('img', {
            attrs: {
              src: params.row.url
            },
            style: {
              height: '45px',
              width: '45px'
            },
            on: {
              click: () => {
                this.$refs.scalePic.show(params.row.url)
              }
            }
          })
        }
      }, {
        title: '配对文案',
        key: 'word',
        align: 'center'
      }, {
        title: '上线时间',
        key: 'created_at',
        align: 'center'
      }, {
        title: '状态',
        align: 'center',
        render: (h, params) => {
          if (params.row.status === 0) {
            return h('span', '下架')
          } else {
            return h('span', '上架')
          }
        }
      }, {
        title: '操作',
        align: 'center',
        width: '300px',
        render: (h, params) => {
          let a = params.row.status ? '下架' : '上架';
          return h('div', [
            h('Button', {
              props: {
                type: 'info'
              },
              style: {
                marginRight: '20px'
              },
              on: {
                click: () => {
                  this.axios.post('pic-edit', {
                    id: params.row.id,
                    status: params.row.status ? 0 : 1
                  }).then((res) => {
                    if (res.status) {
                      this.$Message.info(a + '成功')
                      this.getData()
                    }
                  })
                }
              }
            }, a),
            h('Button', {
              props: {
                type: 'error'
              },
              style: {
                marginRight: '20px'
              },
              on: {
                click: () => {
                  this.$Modal.confirm({
                    content:'确认删除?',
                    onOk:()=>{
                      this.axios.get('pic-del', {
                        params: {
                          id: params.row.id
                        }
                      }).then((res) => {
                        if (res.status === 1) {
                          this.$Message.info('删除成功')
                          this.getData()
                        }
                      })
                    }
                  })
                }
              }
            }, '删除'),
            h('Button', {
              props: {
                type: 'info'
              },
              on: {
                click: () => {
                  this.add_show = true
                  this.newData.word = params.row.word
                  this.newData.class = params.row.class
                  this.newData.scenes = params.row.scenes
                  this.newData.img = params.row.url
                  this.key = params.row.id
                  this.uploadType = 1
                }
              }
            }, '编辑')
          ])
        }
      }],
      myData: [],
      add_show: false,
      key: '',
      uploadType: 0,
      newData: {
        img: '',
        word: '',
        class: '',
        scenes: ''
      }
    }
  },
  computed: {
    have_pic() {
      if (this.newData.img=='') {
        return false
      } else return true
    },
  },
  components: {
    scalePic
  },
  methods: {
    addData() {
      this.uploadType = 0;
      this.add_show = true;
    },

    handleBeforeUpload(file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (e) => {
        this.newData.img = reader.result
      }

      return false;
    },

    handleRemove() {
      this.if_show = false
      this.newData = {
        img: '',
        word: '',
        class: '',
        scenes: ''
      }
    },

    upload() {

      if (this.uploadType === 1) {
        if (this.newData.img[0]=='h') {
          delete this.newData.img
        }
        this.axios.post('pic-edit', {
          id:this.key,
          ...this.newData}).then((res) => {
          if (res.status == 1) {
            this.$Message.info('上传成功')
            this.getData()
            this.handleRemove()
          }
        })
      } else {

        this.axios.post('pic-add', {...this.newData} ).then(
          (res) => {
            if (res.status == 1) {
              this.$Message.info('上传成功')
              this.getData()
              this.handleRemove()
            }
          }
        )
      }
    },

    getData() {
      this.axios.get('pic-list').then((res) => {
        this.myData = res.data.list
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.pic-config {
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

.msg {
    margin-top: 20px;
}
</style>
