import {
  login,
  myInfo
} from '@/api/admin-user'
import {
  setToken,
  setTagNavListInLocalstorage
} from '@/libs/util'
import config from '@/config'
const {
  routerMode
} = config

export default {
  state: {
    user: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, json) {
      json.userName = json.userName.trim();
      json.password = json.password.trim();
      return new Promise((resolve, reject) => {
        login(json).then(res => {
          if (!res.code) {
            setToken(res.data);
          }
          resolve(res);
        }).catch(err => {
          reject(err);
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      setToken('');
      setTagNavListInLocalstorage([]);
      location.href = routerMode === 'history' ? '/login' : '/#/login';
    },
    // 获取用户相关信息
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        myInfo().then(res => {
          commit('setUser', res.data.user);
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
