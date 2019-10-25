import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.course.getpage, filter);
}

/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.course.add, dto);
}

/**
* 详情
*  @param {Object} id 
*/
export const get = (id) => {
    return axios.get(API_URL.course.get + "/" + id);
}

/**
* 编辑
*  @param {Object} dto 
*/
export const update = (dto) => {
    return axios.post(API_URL.course.update, dto);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.course.del + "/" + id);
}


/**
* 上下架
*  @param {Object} id 
*/
export const upperandlower = (id) => {
    return axios.get(API_URL.course.upperandlower + "/" + id);
}


export const getcourseselect = () => {
    return axios.get(API_URL.course.getcourseselect);
}

export const checkin = (dto) => {
    return axios.post(API_URL.course.checkin, dto);
}

export const checkout = (dto) => {
    return axios.post(API_URL.course.checkout, dto);
}

/**
 * 按钮权限
 */
export const buttopermissions = () => {
    return axios.post(API_URL.course.userapplybuttopermissions);
}

export const getall = () => {
    return axios.get(API_URL.course.getall);
}

export const getitemall = (id) => {
    return axios.get(API_URL.course.getitemall+"/" +id);
}


