import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取账户列表
 * @param {Object} filter
 */
export const getpage = (filter) => {
    return axios.post(API_URL.userpoint.getpage, filter);
}













