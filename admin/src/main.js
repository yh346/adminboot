// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import {
  directive as clickOutside
} from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import PageTable from "@/components/page-table"
import SingleUpload from "@/components/upload/single";
import MultipleUpload from "@/components/upload/multiple";
import Ueditor from "@/components/ueditor/index";

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
Vue.component('PageTable', PageTable)
Vue.component('SingleUpload', SingleUpload)
Vue.component('MultipleUpload', MultipleUpload)
Vue.component('Ueditor', Ueditor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
