const urlList = {

  //图片上传
  'upload-img': '/product/upload',

  //用户管理
  'user-list': '/backend/user/list', //用户列表
  'user-panel':'/backend/user/panel',//用户面板
  'forbid':'/backend/user/forbid',//冻结接口

  //审核列表
  'verify-parent-list': '/backend/audit/parlist', //家长审核列表
  'set-parent-status': '/backend/audit/setpar',  //设置家长状态
  'verify-tutor-list': '/backend/audit/tutorlist', //家教审核列表
  'set-tutor-status': '/backend/audit/settut',   //设置审核状态

  //配置管理
  'get-conf-list': '/backend/config/getlist',  //获取配置列表

}

export default urlList;
