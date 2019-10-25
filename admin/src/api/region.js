import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取省份列表
 */
export const province = () => {
  return axios.get(API_URL.region.province);
}

/**
 * 获取下级列表
 * @param {String} code
 */
export const children = (code) => {
  return axios.get(API_URL.region.children + code);
}

/**
 * 新增地区
 * @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.region.add, json);
}

/**
 * 编辑地区
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.region.update, json);
}

/**
 * 删除地区
 * @param {Number} regionID
 */
export const del = (regionID) => {
  return axios.post(API_URL.region.delete, {
    single_id: regionID
  });
}

export const getselect = () => {
  return axios.get(API_URL.region.getselect);
}
