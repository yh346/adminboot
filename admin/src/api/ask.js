import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.ask.getpage, filter);
}


export const del = (id) => {
    return axios.post(API_URL.ask.del+"/"+id);
}

export const get = (id) => {
    return axios.post(API_URL.ask.get+"/"+id);
}

export const update = (dto) => {
    return axios.post(API_URL.ask.update,dto);
}


export const passed = (id) => {
    return axios.get(API_URL.ask.passed+"/"+id);
}

export const unpassed = (id) => {
    return axios.get(API_URL.ask.unpassed+"/"+id);
}

export const set = (goodsIDArray, type) => {
    return axios.post(API_URL.ask.setOption, {
      option: type === 1 ? '通过' : type === 2 ? '删除' : type === 3 ? '不通过' : "",
      comment_ids: goodsIDArray
    });
  }