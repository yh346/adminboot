import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 充值列表
 * @param {Object} filter 
 */
export const list = (filter) => {
  return axios.get(API_URL.wealth.recharge.list, filter);
}
