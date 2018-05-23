import Mock from 'mockjs';

Mock.mock('/role-all', 'get', (options)=>{
  return {
    code: 1,
    status: 1,
    data: {
      all: [{
        id: 1,
        display_name: '超管'
      },{
        id: 2,
        display_name: '管理员'
      },{
        id: 3,
        display_name: '助教'
      }]
    },
    msg: '请求成功'
  }
})

Mock.mock('/admin-list', 'get', (options)=>{
  return {
    code: 1,
    status: 1,
    data: {
      list: [{
        admin_id: 1,
        admin_name: 'admin',
        admin_mobile: '13336988388',
        is_super: 1,
        status: 1,
        created_at: '222',
        remark: '111',
        login_ip: '11.14.6.44',
        login_at: '232',
        adminRole: [1,2]
      }]
    },
    msg: '请求成功'
  }
});

Mock.mock('/role-list','get',(options)=>{
  let res = {
    code: 1,
    status: 1,
    data: {
      list: [{
        id: 2,
        name: 'admin',
        display_name: '管理员',
        description: 'test',
        status: 1,
        created_at: 'test',
        updated_at: 'test'
      }]
    },
    msg: '请求成功'
  };
  return res;
});

Mock.mock('auth-list', 'get', (options)=>{
  let res = {
    code: 1,
    status: 1,
    data: {
      list: [{
        pid: 0,
        id: 1,
        level: 1,
        name: 'authority',
        display_name: '权限管理',
        description: '一级目录',
        children: [{
          pid: 1,
          id: 2,
          level: 2,
          name: 'role',
          display_name: '角色列表',
          description: '二级目录'
        },{
          pid: 1,
          id: 3,
          level: 2,
          name: 'auth',
          display_name: '权限列表',
          description: '二级目录'
        },{
          pid: 1,
          id: 4,
          level: 2,
          name: 'admin',
          display_name: '账户列表',
          description: '二级目录'
        }]
      }]
    },
    msg: '请求成功'
  };
  return res;
});



// Mock.setup({
//     timeout: 2000
// });
