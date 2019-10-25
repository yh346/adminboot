import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.teacher.getpage, filter);
}

/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.teacher.add, dto);
}

/**
* 详情
*  @param {Object} id 
*/
export const get = (id) => {
    return axios.get(API_URL.teacher.get + "/" + id);
}

/**
* 编辑
*  @param {Object} dto 
*/
export const update = (dto) => {
    return axios.post(API_URL.teacher.update, dto);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.teacher.del + "/" + id);
}

/**
* 删除
*/
export const getall = (d) => {
    return axios.post(API_URL.teacher.getall);
}

