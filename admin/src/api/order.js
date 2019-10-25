import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.order.getpage, filter);
}

/**
 * 分公司分页
 *  @param {Object} filter 
 */
export const companygetpage = (filter) => {
    return axios.post(API_URL.order.companygetpage, filter);
}
/**
 * 添加
 *  @param {Object} dto 
 */
export const add = (dto) => {
    return axios.post(API_URL.order.add, dto);
}

/**
* 详情
*  @param {Object} id 
*/
export const get = (id) => {
    return axios.get(API_URL.order.get + "/" + id);
}


export const invoice = (id) => {
    return axios.get(API_URL.order.invoice + "/" + id);
}

/**
* 编辑
*  @param {Object} dto 
*/
export const update = (dto) => {
    return axios.post(API_URL.order.update, dto);
}

/**
* 删除
*  @param {Object} id 
*/
export const del = (id) => {
    return axios.get(API_URL.order.del + "/" + id);
}

/**
* 删除
*/
export const getall = (d) => {
    return axios.post(API_URL.order.getall);
}



export const edutorderprice = (d) => {
    return axios.post(API_URL.order.edutorderprice,d);
}

/**
 * 
 * @param {退款} d 
 */
export const refundpay = (d) => {
    return axios.get(API_URL.order.refundpay,d);
}

/**
 * 
 * @param {拒绝退款} d 
 */
export const notrefund = (d) => {
    return axios.get(API_URL.order.notrefund,d);
}
