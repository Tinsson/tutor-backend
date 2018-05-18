const urlList = {

  //图片上传
  'upload-img': '/backend/user/upload-pic',

  //账户登陆
  'login-in': '/backend/admin/login',

  //用户管理
  'get-resource': '/backend/user/resource-list', //获取渠道列表
  'user-list': '/backend/user/user-list',  //混合列表
  'parent-list': '/backend/user/learn-list', //家长列表
  'parent-panel': '/backend/user/learn-panel', //家长面板
  'tutor-list': '/backend/user/tutor-list', //家教面板
  'tutor-panel': '/backend/user/tutor-panel', //家教面板
  'contact-refund': '/backend/user/contact-refund', //购买退款
  'trans-role': '/backend/user/edit-role', //切换身份
  'need-config': '/backend/user/need-config', //需求配置
  'edit-user': '/backend/user/edit-user', //编辑基本信息
  'edit-remark': '/backend/user/edit-remark', //保存备注


  //审核列表
  'verify-parent-list': '/backend/audit/parlist', //家长审核列表
  'set-parent-status': '/backend/audit/setpar',  //设置家长状态
  'verify-tutor-list': '/backend/audit/tutorlist', //家教审核列表
  'set-tutor-status': '/backend/audit/settut',   //设置审核状态
  'verify-wechat-list': '/backend/audit/wechat-audit', //微信审核列表
  'verify-qrcode': '/backend/audit/qrcode-audit', //审核微信二维码
  'verify-edu-list': '/backend/audit/edu-audit',  //学历审核列表
  'verify-audit': '/backend/audit/set-audit',  //审核微信学历

  //配置管理
  'get-conf-list': '/backend/config/getlist',  //获取配置列表
  'set-conf-amount': '/backend/config/setamount', //设置金额
  'set-complain': '/backend/config/setcompl',   //设置投诉项
  'del-complain': '/backend/config/del-config',   //删除投诉项
  'get-resource-list': '/backend/resource/resource-list', //来源渠道列表
  'add-resource': '/backend/resource/create-resource', //创建来源渠道
  'edit-resource': '/backend/resource/edit-resource', //编辑来源渠道

  //交易记录
  'audit-list': '/backend/trad/audlist', //获取认证支付流水
  'ref-list': '/backend/trad/reflist',  //获取认证退款流水
  'buy-list': '/backend/trad/buylist',  //获取购买联系方式
  'buy-refund': '/backend/trad/refund-log', //购买退款流水
  'contact-list': '/backend/trad/contact-list', //解锁记录

  //投诉记录
  'complain-list': '/backend/user/complain-list', //投诉列表
  'complain-edit': '/backend/user/edit-complain', //投诉编辑

  //助教列表
  'city-list': '/backend/assistant/city',   //城市列表
  'assis-list': '/backend/assistant/search', //家教列表
  'assis-add': '/backend/assistant/add',  //添加助教
  'assis-edit': '/backend/assistant/edit', //编辑助教
  'assis-del': '/backend/assistant/del', //删除助教

}

export default urlList;
