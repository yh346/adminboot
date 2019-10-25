import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 文章分类配置
 */
export const classConfig = () => {
  return axios.get(API_URL.article.classConfig);
}

/**
 * 获取文章分类列表
 * @param {Number} parent_id
 */
export const listClass = (parent_id) => {
  return axios.get(API_URL.article.listClass + parent_id);
}

/**
 * 新增文章分类
 * @param {Object} json
 */
export const addClass = (json) => {
  return axios.post(API_URL.article.addClass, json);
}

/**
 * 编辑文章分类
 * @param {Object} json
 */
export const updateClass = (json) => {
  return axios.post(API_URL.article.updateClass, json);
}

/**
 * 删除文章分类
 * @param {Number} classID
 */
export const deleteClass = (classID) => {
  return axios.post(API_URL.article.deleteClass, {
    single_id: classID
  });
}

/**
 * 获取文章列表
 * @param {Number} parent_id
 */
export const manage = (filter) => {
  return axios.get(API_URL.article.manage, filter);
}

/**
 * 获取文章列表
 * @param {Number} articleID
 */
export const view = (articleID) => {
  return axios.get(API_URL.article.view + articleID);
}

/**
 * 新增文章
 * @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.article.add, json);
}

/**
 * 编辑文章
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.article.update, json);
}

/**
 * 删除文章
 * @param {Object} articleIDArray
 */
export const del = (articleIDArray) => {
  return axios.post(API_URL.article.delete, {
    id_array: articleIDArray
  });
}

/**
 * 审核通过
 * @param {Object} articleIDArray
 */
export const checkPass = (articleIDArray) => {
  return axios.post(API_URL.article.checkPass, {
    id_array: articleIDArray
  });
}

/**
 * 取消审核
 * @param {Object} articleIDArray
 */
export const cancelChecked = (articleIDArray) => {
  return axios.post(API_URL.article.cancelChecked, {
    id_array: articleIDArray
  });
}
