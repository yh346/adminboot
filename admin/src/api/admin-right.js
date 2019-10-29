import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取权限组列表
 *  @param {Object} filter
 */
export const groups = (filter) => {
  return axios.get(API_URL.adminRight.groups, filter);
}

/**
 * 新增权限组数据
 *  @param {Object} json
 */
export const addGroup = (json) => {
  return axios.post(API_URL.adminRight.addGroup, json);
}

/**
 * 更新权限组数据
 * @param {Object} json
 */
export const updateGroup = (json) => {
  return axios.post(API_URL.adminRight.updateGroup, json);
}

/**
 * 删除权限组数据
 * @param {Number} groupID
 */
export const deleteGroup = (id) => {
  return axios.get(API_URL.adminRight.deleteGroup+"/"+id);
}

/**
 * 设置权限组状态
 * @param {Number} groupID
 */
export const disabledGroup = (id) => {
  return axios.post(API_URL.adminRight.disabledGroup+"/"+id);
}

/**
 * 获取权限组信息
 * @param {Number} groupID 
 */
export const getGroup = (groupID) => {
  return axios.get(API_URL.adminRight.getGroup + groupID);
};

/**
 * 获取权限组的权限列表
 *  @param {Number} groupID
 */
export const list = (groupID) => {
  return axios.get(API_URL.adminRight.list + groupID);
}

/**
 * 获取权限树
 *  @param {Number} roleID
 */
export const tree = (roleID) => {
  return axios.get(`${API_URL.adminRight.tree}${roleID}`);
}

/**
 * 获取子权限
 *  @param {Number} parentID
 */
export const _children = (parentID) => {
  return axios.get(API_URL.adminRight.children + parentID);
}

/**
 * 删除权限
 * @param {Number} rightID
 */
export const _delete = (id) => {
  return axios.post(API_URL.adminRight.delete+"/"+id);
}

/**
 * 新增权限
 * @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.adminRight.add, json);
}

/**
 * 编辑权限
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.adminRight.update, json);
}

/**
 * 获取用户权限
 */
export const user = () => {
  return axios.get(API_URL.adminRight.user);
}

/**
 * 获取所有控制器
 */
export const controllers = () => {
  return axios.get(API_URL.adminRight.controllers);
}

/**
 * 获取控制器的方法
 * @param {String} controller 
 */
export const actions = (controller) => {
  return axios.get(API_URL.adminRight.actions + controller);
}

/**
 * 获取权限信息
 * @param {Number} rightID 
 */
export const getRight = (rightID) => {
  return axios.get(API_URL.adminRight.getRight + rightID);
};
