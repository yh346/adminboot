import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 根据分类获取配置列表
 *  @param {Number} type 
 */
export const list = (type) => {
  return axios.get(API_URL.config.list + type);
}

/**
 * 更新配置信息
 * @param {Object} json 
 */
export const update = (json) => {
  return axios.post(API_URL.config.update, json);
}
