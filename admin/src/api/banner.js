import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取轮播列表
 * @param {Object} filter
 */
export const manage = (filter) => {
  return axios.post(API_URL.banner.manage, filter);
}

/**
 * 新增轮播
 * @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.banner.add, json);
}

/**
 * 编辑轮播
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.banner.update, json);
}

/**
 * 设置轮播显示状态
 * @param {Array} bannerID
 */
export const isShow = (bannerID) => {
  return axios.post(API_URL.banner.isShow, {
    single_id: bannerID
  });
}

/**
 * 删除轮播
 * @param {Array} bannerID
 */
export const del = (bannerID) => {
  return axios.post(API_URL.banner.delete, {
    single_id: bannerID
  });
}
