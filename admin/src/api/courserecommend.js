import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.courserecommend.getpage, filter);
}

/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.courserecommend.add, dto);
}

/**
* 详情
*  @param {Object} id 
*/
export const get = (id) => {
    return axios.get(API_URL.courserecommend.get + "/" + id);
}

/**
* 编辑
*  @param {Object} dto 
*/
export const update = (dto) => {
    return axios.post(API_URL.courserecommend.update, dto);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.courserecommend.del + "/" + id);
}


/**
* 启用/禁用
*  @param {Object} id 
*/
export const enable = (id) => {
    return axios.get(API_URL.courserecommend.enable + "/" + id);
}

export const enums = (id) => {
    return axios.get(API_URL.courserecommend.enums + "/" + id);
}