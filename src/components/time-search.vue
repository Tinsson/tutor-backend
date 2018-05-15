<template>
  <div id="search">
    <Card>
      <div class="title" slot="title">
        <div class="label">
          <Icon type="ios-pricetags-outline"></Icon>
          筛选查询
        </div>
        <div class="btn-group">
          <slot></slot>
        </div>
      </div>
      <div class="content">
        <div class="input-group">
          <div class="label">时间：</div>
          <DatePicker type="daterange"
                      placeholder="请选择时间段"
                      v-model="time_range"
                      confirm
                      :clearable="false"
                      :editable="false"
                      @on-ok="search"
                      @on-clear="clear_date"></DatePicker>
          <div class="range-box">
            <div v-for="item in range_arr" :key="item.value" class="range-inner" :class="{cur: item.status}">
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="input-group">
          <div class="label">城市：</div>
          <Cascader style="width: 165px" :data="cityData" clearable v-model="city"></Cascader>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
    export default {
      name: "time-search",
      data(){
        return{
          time_range: [],
          range_arr: [{
            value: 7,
            name: '最近7天',
            status: false
          },{
            value: 14,
            name: '最近14天',
            status: false
          },{
            value: 30,
            name: '最近30天',
            status: false
          }],
          cityData: [],
          city: []
        }
      },
      created(){
        this.axios.get('city-list').then(d=>{
          this.cityData = d.data.list;
        })
      },
      methods: {
        search(){
          console.log(this.time_range);
        },
        clear_date(){

        }
      }
    }
</script>

<style lang="scss" scoped>
  .title {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      font-size: 15px;
    }
  }
  .content{
    .input-group{
      padding-bottom: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .range-box{
    padding-left: 30px;
    display: flex;
    flex-direction: row;
    .range-inner{
      width: 100px;
      height: 42px;
      margin-right: 10px;
      box-sizing: border-box;
      line-height: 42px;
      text-align: center;
      border-radius: 10px;
      background-color: #bbbec4;
      color: #FFF;
      &.cur{
        background-color: #2b85e4;
      }
    }
  }
</style>
