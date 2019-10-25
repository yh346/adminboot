export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '万律后台管理系统',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * 接口地址配置
   */
  baseUrl: {
    dev: '/api/',
    pro: 'https://classwx.91duobaoyu.com/api/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 请求超时时间，默认15秒
   */
  requestTimeout: 15 * 1000,
  /**
   * @description 路由模式
   * hash     使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器
   * history  依赖 HTML5 History API 和服务器配置
   */
  routerMode: 'history'
}
