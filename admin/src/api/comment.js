import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.comment.getpage, filter);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.comment.del + "/" + id);
}


/**
* 同意
*  @param {Object} id 
*/
export const passed = (id) => {
    return axios.get(API_URL.comment.passed + "/" + id);
}

/**
* 不同意
*  @param {Object} id 
*/
export const unpassed = (id) => {
    return axios.get(API_URL.comment.unpassed + "/" + id);
}


export const set = (goodsIDArray, type) => {
    return axios.post(API_URL.comment.setOption, {
      option: type === 1 ? '通过' : type === 2 ? '删除' : type === 3 ? '不通过' : "",
      comment_ids: goodsIDArray
    });
  }