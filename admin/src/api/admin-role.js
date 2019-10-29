import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取角色列表
 *  @param {Object} filter
 */
export const list = (filter) => {
  return axios.get(API_URL.adminRole.list, filter);
}

/**
 * 获取角色数据
 * @param {Number} roleID
 */
export const info = (roleID) => {
  return axios.get(API_URL.adminRole.info + roleID);
}

/**
 * 新增角色数据
 *  @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.adminRole.add, json);
}

/**
 * 更新角色数据
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.adminRole.update, json);
}

/**
 * 删除角色数据
 * @param {Number} roleID
 */
export const del = (id) => {
  return axios.get(API_URL.adminRole.delete+ "/" + id
  );
}

/**
 * 角色权限设置
 * @param {Object} json
 */
export const assignRight = (json) => {
  return axios.post(API_URL.adminRole.assignRight, json);
}
