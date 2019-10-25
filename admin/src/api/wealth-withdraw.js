import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 提现列表
 * @param {Object} filter 
 */
export const withdraw_list = (filter) => {
  return axios.get(API_URL.wealth.withdraw_list, filter);
}

/**
 * 提现详情
 * @param {Number} withdrawID 
 */
export const info = (withdrawID) => {
  return axios.get(API_URL.wealth.wealth.info + withdrawID);
}

/**
 * 同意提现
 * @param {Object} json 
 */
export const agree = (json) => {
  return axios.post(API_URL.wealth.wealth.agree, json);
}

/**
 * 拒绝提现
 * @param {Object} json 
 */
export const reject = (json) => {
  return axios.post(API_URL.wealth.wealth.reject, json);
}
