export const API_URL = {
  enum: {
    list: 'enum/list/'
  },
  adminUser: {
    login: 'admin_user/login',
    list: 'admin_user/list',
    add: 'admin_user/add',
    update: 'admin_user/update',
    modifyPwd: 'admin_user/modify_pwd',
    delete: 'admin_user/delete',
    disabled: 'admin_user/disabled',
    myInfo: 'admin_user/my_info',
    getInfo: 'admin_user/get_info/',
    menuRight: 'admin_user/menu_right',
    updateInfo: 'admin_user/update_info'
  },
  config: {
    list: 'config/list/',
    update: 'config/update',
    reserveTimeLength: 'config/reserve_time_length'
  },
  dict: {
    list: 'dict/list/',
    add: 'dict/add',
    update: 'dict/update',
    delete: 'dict/delete'
  },
  log: {
    list: 'log/list',
    userLogList: 'user_log/list'
  },
  userpoint: {
    getpage: 'userpoint/devlist',
  },
  user: {
    getpage: 'user/getpage',
    getteampage: 'user/getteampage',
    getcompanypage: 'user/getcompanypage',
    setenable: 'user/setenable',
    partner: 'user/partner',
    get: 'user/get',
    update: 'user/update',
    recommenduserinfo: "user/recommenduserinfo",
    updateuserbuttopermissions: "config/updateuserbuttopermissions"
  },
  rule: {
    list: 'rule/list',
    getpage: 'rule/getpage',
    get: 'rule/get',
    edit: 'rule/edit',
    add: 'rule/add',
    enable: 'rule/enable'
  },
  teacher: {
    getpage: 'teacher/list',
    get: 'teacher/get',
    update: 'teacher/update',
    add: 'teacher/add',
    del: 'teacher/del',
    getall: 'teacher/all'
  },
  company: {
    getpage: 'company/getpage',
    get: 'company/get/',
    update: 'company/update',
    add: 'company/add',
    selectAll: 'company/selectAll',
    del: 'company/del/'
  },
  companyaccount: {
    getpage: 'companyaccount/getpage',
    get: 'companyaccount/get/',
    update: 'companyaccount/update',
    add: 'companyaccount/add',
    del: 'companyaccount/del/'
  },
  noticetemplate: {
    getpage: 'noticetemplate/getpage',
    get: 'noticetemplate/get',
    update: 'noticetemplate/update',
    add: 'noticetemplate/add',
    del: 'noticetemplate/del',
    getall: 'noticetemplate/all'
  },
  comment: {
    getpage: 'comment/getpage',
    passed: 'comment/passed',
    unpassed: 'comment/unpassed',
    del: 'comment/del',
    setOption: 'comment/set'
  },
  courserecommend: {
    getpage: 'courserecommend/getpage',
    get: 'courserecommend/get',
    update: 'courserecommend/update',
    add: 'courserecommend/add',
    del: 'courserecommend/del',
    enable: 'courserecommend/enable',
    enums: 'courserecommend/enums'
  },
  course: {
    getpage: 'course/devlist',
    get: 'course/get',
    update: 'course/update',
    add: 'course/add',
    del: 'course/del',
    upperandlower: 'course/upperandlower',
    getcourseselect: 'course/getcourseselect',
    checkin: 'course/checkin',
    checkout: 'course/checkout',
    userapplybuttopermissions: "config/userapplybuttopermissions",
    getall: "course/getall",
    getitemall: "course/getitemall"
  },
  coupon: {
    getpage: 'coupon/getpage',
    add: 'coupon/add',
    del: 'coupon/del',
    get: 'coupon/get',
    update: 'coupon/update'
  },
  order: {
    getpage: 'order/getpage',
    companygetpage: "order/companygetpage",
    edutorderprice: "order/edutorderprice",
    refundpay: "order/refundpay",
    notrefund: "order/notrefund",
    invoice:'order/invoice',
  },
  apply: {
    getpage: 'courseapply/getpage'
  },
  loginLog: {
    list: 'login_log/list',
    delete: 'login_log/delete'
  },
  dept: {
    tree: 'dept/tree',
    list: 'dept/list',
    add: 'dept/add',
    update: 'dept/update',
    delete: 'dept/delete',
    getInfo: 'dept/get_info/',
    view: 'dept/view/'
  },
  adminRole: {
    list: 'admin_role/list',
    info: 'admin_role/info/',
    delete: 'admin_role/delete',
    add: 'admin_role/add',
    update: 'admin_role/update',
    assignRight: 'admin_role/assign_right'
  },
  adminRight: {
    groups: 'admin_right/groups',
    deleteGroup: 'admin_right/delete_group',
    addGroup: 'admin_right/add_group',
    updateGroup: 'admin_right/update_group',
    disabledGroup: 'admin_right/disabled_group',
    getGroup: 'admin_right/get_group/',
    list: 'admin_right/list/',
    tree: 'admin_right/tree/',
    children: 'admin_right/children/',
    delete: 'admin_right/delete',
    add: 'admin_right/add',
    update: 'admin_right/update',
    user: 'admin_right/user',
    controllers: 'admin_right/controllers',
    actions: 'admin_right/actions?controller=',
    getRight: 'admin_right/get_right/'
  },
  notice: {
    manage: 'notice/manage',
    add: 'notice/add',
    update: 'notice/update',
    delete: 'notice/delete',
    publish: 'notice/publish',
    view: 'notice/view/'
  },
  banner: {
    manage: 'banner/manage',
    add: 'banner/add',
    update: 'banner/update',
    isShow: 'banner/is_show',
    delete: 'banner/delete'
  }, adminhome: {
    course: 'adminhome/course',
    order: 'adminhome/order',
    user: 'adminhome/user'
  },
  region: {
    province: 'region/province',
    children: 'region/children/',
    add: 'region/add',
    delete: 'region/delete',
    update: 'region/update',
    getselect: "region/getselect"
  },
  article: {
    classConfig: 'article_class/config',
    listClass: 'article_class/list/',
    addClass: 'article_class/add',
    updateClass: 'article_class/update',
    deleteClass: 'article_class/delete',
    manage: 'article/manage',
    add: 'article/add',
    update: 'article/update',
    delete: 'article/delete',
    checkPass: 'article/check_pass',
    cancelChecked: 'article/cancel_checked',
    view: 'article/view/'
  },
  wealth: {
    wealth: {
      operation_types: 'wealth/operation_types',
      operation: 'wealth/operation',
      manage: 'wealth/manage',
      disabled: 'wealth/disabled',
      logList: 'wealth/wealth_log',
      recharge_list: 'wealth/recharge_list',
      withdraw_list: 'wealth/withdraw_list',
      info: 'wealth/withdrawinfo/',
      agree: 'wealth/agree_withdraw',
      reject: 'wealth/reject_withdraw',
      companyList: 'wealth/company_wealth_log'
    },
    recharge: {
      list: 'wealth_recharge/list',
    },
    withdraw: {
      list: 'wealth_withdraw/list',
      info: 'wealth_withdraw/info/',
      agree: 'wealth_withdraw/agree',
      reject: 'wealth_withdraw/reject'
    }
  },
  goods: {
    manage: 'goods/manage',
    info: 'goods/get_info/',
    add: 'goods/add',
    update: 'goods/update',
    goodsTypes: 'goods_type/get_dict',
    goodsBrands: 'goods_brand/get_dict',
    setOption: 'goods/set_option'
  },
  medal: {
    getpage: 'medal/list',
    get: 'medal/info',
    update: 'medal/update',
    add: 'medal/add',
    del: 'medal/del',
    getall: 'medal/all'
  },
  medaluser: {
    getpage: 'medaluser/list',
    add: "medaluser/add"
  },
  works: {
    getpage: 'works/lists',
    del: "works/del",
    get: "works/get",
    update: "works/update",
    add: "works/add",
  },
  answer: {
    getpage: 'answer/lists',
  },
  ask: {
    getpage: 'ask/getpage',
    del: "ask/del",
    get: "ask/get",
    update: "ask/update",
    passed: "ask/pass", 
    unpassed: "ask/notpass",
    setOption: 'ask/set'
  },
  learn: {
    getpage: "learn/devlist",
  },
  invite: {
    getpage: "invite/devlist",
  },
  grouplist: {
    getpage: 'coursegroup/list',
    enable: "coursegroup/del",
    get: "coursegroup/get",
    update: "coursegroup/update",
    add: "coursegroup/add",
    code: "coursegroup/code",
  },
  goodsBrand: {
    manage: 'goods_brand/manage',
    list: 'goods_brand/list',
    add: 'goods_brand/add',
    update: 'goods_brand/update',
    del: 'goods_brand/delete',
    info: 'goods_brand/info/'
  },
  goodsType: {
    manage: 'goods_type/manage',
    list: 'goods_type/list',
    add: 'goods_type/add',
    del: 'goods_type/delete',
    update: 'goods_type/update',
    listBrands: 'goods_type/list_brands/'
  },
  goodsProperty: {
    list: 'goods_property/list/',
    manage: 'goods_property/manage/',
    add: 'goods_property/add',
    del: 'goods_property/delete',
    info: 'goods_property/info/',
    update: 'goods_property/update',
    deleteValue: 'goods_property/delete_value',
    addValue: 'goods_property/add_value',
    updateValue: 'goods_property/update_value'
  }
};
