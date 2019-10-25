import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 登录
 */
export const login = ({
  userName,
  password
}) => {
  return axios.post(API_URL.adminUser.login, {
    user_name: userName,
    user_pwd: password
  });
}

/**
 * 获取用户列表
 * @param {Object} filter
 */
export const list = (filter) => {
  return axios.post(API_URL.adminUser.list, filter);
}

/**
 * 新增用户
 * @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.adminUser.add, json);
}

/**
 * 编辑用户
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.adminUser.update, json);
}

/**
 * 删除用户
 * @param {Number} adminID
 */
export const del = (adminID) => {
  return axios.post(API_URL.adminUser.delete, {
    single_id: adminID
  });
}

/**
 * 获取个人信息
 */
export const myInfo = () => {
  return axios.get(API_URL.adminUser.myInfo);
}

/**
 * 获取用户信息
 */
export const getInfo = (adminID) => {
  return axios.get(API_URL.adminUser.getInfo + adminID);
}

/**
 * 修改密码
 * @param {Object} json
 */
export const modifyPwd = (json) => {
  return axios.post(API_URL.adminUser.modifyPwd, json);
}

/**
 * 设置用户状态
 * @param {Number} adminID
 */
export const disabled = (adminID) => {
  return axios.post(API_URL.adminUser.disabled, {
    single_id: adminID
  });
}

/**
 * 获取用户权限
 */
export const menuRight = () => {
  return axios.get(API_URL.adminUser.menuRight);
}

/**
 * 修改个人信息
 * @param {Object} json 
 */
export const updateInfo = (json) => {
  return axios.post(API_URL.adminUser.updateInfo, json);
}
