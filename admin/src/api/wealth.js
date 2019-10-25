import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取账户列表
 * @param {Object} filter
 */
export const manage = (filter) => {
  return axios.post(API_URL.wealth.wealth.manage, filter);
}

/**
 * 设置账户状态
 * @param {Number} userID 
 */
export const disabled = (userID) => {
  return axios.post(API_URL.wealth.wealth.disabled, {
    single_id: userID
  });
}

/**
 * 修改账号备注
 * @param {Number} userID 
 * @param {String} remark 
 */
export const updateRemark = (userID, remark) => {
  return axios.post(API_URL.wealth.wealth.updateRemark, {
    single_id: userID,
    remark: remark
  });
}

/**
 * 提现列表
 * @param {Object} filter 
 */
export const logList = (filter) => {
  return axios.post(API_URL.wealth.wealth.logList, filter);
}

/**
 * 操作类型
 */
export const operationTypes = () => {
  return axios.get(API_URL.wealth.wealth.operation_types);
}

/**
 * 操作列表
 */
export const operationList = () => {
  return axios.get(API_URL.wealth.wealth.operation);
}


export const recharge_list = (filter) => {
  return axios.post(API_URL.wealth.wealth.recharge_list,filter);
}
export const withdraw_list = (filter) => {
  return axios.post(API_URL.wealth.wealth.withdraw_list,filter);
}

/**
 * 
 * 分公司流水
 * @param {} filter 
 */
export const companyList = (filter) => {
  return axios.post(API_URL.wealth.wealth.companyList,filter);
}
