import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.company.getpage, filter);
}

/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.company.add, dto);
}

/**
* 详情
*  @param {Object} id 
*/
export const get = (id) => {
    return axios.get(API_URL.company.get  + id);
}

/**
* 编辑
*  @param {Object} dto 
*/
export const update = (dto) => {
    return axios.post(API_URL.company.update, dto);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.company.del  + id);
}

export const selectAll = () => {
    return axios.get(API_URL.company.selectAll);
}
