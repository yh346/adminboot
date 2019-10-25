import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取配置信息
 */
export const config = () => {
  return axios.get(API_URL.dept.config);
}

/**
 * 获取部门列表
 *  @param {Object} filter
 */
export const list = (filter) => {
  return axios.get(API_URL.dept.list, filter);
}

/**
 * 获取部门列表
 *  @param {Object} filter
 */
export const tree = (filter) => {
  return axios.get(API_URL.dept.tree, filter);
}

/**
 * 新增部门数据
 *  @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.dept.add, json);
}

/**
 * 更新部门数据
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.dept.update, json);
}

/**
 * 删除部门数据
 * @param {Number} deptID
 */
export const del = (deptID) => {
  return axios.post(API_URL.dept.delete, {
    single_id: deptID
  });
}

/**
 * 获取部门信息
 *  @param {Number} deptID
 */
export const getInfo = (deptID) => {
  return axios.get(API_URL.dept.getInfo + deptID);
}

/**
 * 获取部门信息view
 *  @param {Number} deptID
 */
export const view = (deptID) => {
  return axios.get(API_URL.dept.view + deptID);
}
