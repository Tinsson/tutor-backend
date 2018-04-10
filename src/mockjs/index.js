import Mock from 'mockjs';

Mock.mock(/\/user-card-table/,(options)=>{
  let res = {
    code: 1,
    status: 1,
    data: {
      count: 1,
      field:[
        {
          title: '类型',
          key: 'type'
        },{
          title: '秘币变化',
          key: 'change'
        },{
          title: '时间',
          key: 'time'
        },{
          title: '秘币余额',
          key: 'balance'
        }
      ],
      list: [
        {
          type: '消费',
          change: '-30秘币',
          time: '2017-15-15 12:30:30',
          balance: '332.5秘币'
        }
      ]
    },
    msg: '请求成功'
  }
  return res;
})

Mock.mock(/\/user-get-card/,(options)=>{
  let res = {
    code: 1,
    status: 1,
    data: {
      cardList: [
        {
          title: '秘币余额',
          value: '100',
          unit: ' ',
          icon: 'ios-book',
          model: 'a'
        },
        {
          title: '秘币余额',
          value: '100',
          unit: ' ',
          icon: 'ios-book',
          model: 'b'
        },
        {
          title: '秘币余额',
          value: '100',
          unit: ' ',
          icon: 'ios-book',
          model: 'c'
        },
        {
          title: '秘币余额',
          value: '100',
          unit: ' ',
          icon: 'ios-book',
          model: 'd'
        },
      ]
    },
    msg: '请求成功'
  }
  return res;
})



Mock.setup({
    timeout: 5000
})
