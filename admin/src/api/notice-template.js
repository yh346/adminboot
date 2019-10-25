import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.noticetemplate.getpage, filter);
}

/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.noticetemplate.add, dto);
}

/**
* 详情
*  @param {Object} id 
*/
export const get = (id) => {
    return axios.get(API_URL.noticetemplate.get + "/" + id);
}

/**
* 编辑
*  @param {Object} dto 
*/
export const update = (dto) => {
    return axios.post(API_URL.noticetemplate.update, dto);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.noticetemplate.del + "/" + id);
}

/**
* 所有
*/
export const getall = (d) => {
    return axios.post(API_URL.noticetemplate.getall);
}

