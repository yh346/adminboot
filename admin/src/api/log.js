import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取日志列表
 *  @param {Object} filter 
 */
export const list = (filter) => {
  return axios.get(API_URL.log.list, filter);
}

/**
 * 获取日志列表
 *  @param {Object} filter 
 */
export const userLogList = (filter) => {
  return axios.get(API_URL.log.userLogList, filter);
}
