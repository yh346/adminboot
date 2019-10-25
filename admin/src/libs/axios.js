import Axios from 'axios';
import {
  getToken,
  setToken
} from '@/libs/util';
import config from '@/config';
const {
  requestTimeout,
  routerMode
} = config
class httpRequest {
  constructor(baseUrl = baseURL) {
    this.options = {
      method: '',
      url: ''
    };
    this.baseUrl = baseUrl;
    // 存储请求队列
    this.queue = {};
  }
  getInsideConfig() {
    const conf = {
      baseURL: this.baseUrl,
      timeout: requestTimeout,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Token': getToken() || ''
      }
    }
    return conf;
  }
  // 销毁请求实例
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  // 请求拦截
  interceptors(instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true;
      return config;
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      this.destroy(url);
      let {
        data
      } = res;
      // 未授权
      if (data.code === 401) {
        setToken('');
        window.location.href = routerMode === 'history' ? '/login' : '/#/login';
      }
      return data;
    }, (error) => {
      this.destroy(url);
      var data = {};
      if (error.message.indexOf('timeout') > -1) {
        data.code = 408;
        data.message = "服务器响应超时";
      } else {
        data.code = 500;
        data.message = "服务内部错误";
        console.error(error);
      }
      return data;
    })
  }
  // 请求实例
  request(options) {
    const instance = Axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
  // get请求
  get(url, data = null) {
    var options = {
      url: url,
      method: 'get'
    };
    if (data && typeof (data) === "object" &&
      Object.prototype.toString.call(data).toLowerCase() === "[object object]" && !data.length) {
      options.params = data;
    }
    return this.request(options);
  }
  // post请求
  post(url, data = null) {
    var options = {
      url: url,
      method: 'post'
    };
    if (data && typeof (data) === "object" &&
      Object.prototype.toString.call(data).toLowerCase() === "[object object]" && !data.length) {
      options.data = data;
    }
    return this.request(options);
  }
}
export default httpRequest
