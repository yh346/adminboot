import axios from '@/libs/api.request';
import { API_URL } from './url';

/**
 * 获取日志列表
 *  @param {Object} filter 
 */
export const list = (filter) => {
    return axios.get(API_URL.loginLog.list, filter);
}

/**
 * 删除日志
 */
export const del = (id) => {
    return axios.get(API_URL.loginLog.delete+"/" + id);
}