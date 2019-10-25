import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 列表
 *  @param {Object} filter 
 */
export const list = () => {
  return axios.get(API_URL.rule.list);
}

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
  return axios.post(API_URL.rule.getpage, filter);
}

/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.rule.add, dto);
  }

  /**
 * 详情
 *  @param {Object} dto 
 */
export const get = (dto) => {
    return axios.post(API_URL.rule.get, dto);
  }

  /**
 * 编辑
 *  @param {Object} dto 
 */
export const edit = (dto) => {
    return axios.post(API_URL.rule.edit, dto);
  }

  /**
 * 启用/禁用
 *  @param {Object} dto 
 */
export const enable = (dto) => {
    return axios.post(API_URL.rule.enable, dto);
  }
