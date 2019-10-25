import axios from '@/libs/api.request';
import { API_URL } from './url';


/**
 * 获取列表
 *  @param {Object} filter
*/
export const getpage = (filter) => {
    return axios.post(API_URL.user.getpage, filter);
}
export const getteampage = (filter) => {
    return axios.post(API_URL.user.getteampage, filter);
}
export const getcompanypage = (filter) => {
    return axios.post(API_URL.user.getcompanypage, filter);
}

/**
 * 启用禁用
 *  @param {Object} json
*/
export const setenable = (json) => {
    return axios.post(API_URL.user.setenable, json);
}

/**
 * 推荐
 *  @param {Object} json
*/
export const partner = (json) => {
    return axios.post(API_URL.user.partner, json);
}


export const get = (id) => {
    return axios.get(API_URL.user.get+ "/" + id);
}

export const update = (json) => {
    return axios.post(API_URL.user.update, json);
}

/**
 * 
 * @param {推荐人信息} id 
 */
export const recommenduserinfo = (id) => {
    return axios.get(API_URL.user.recommenduserinfo+ "/" + id);
}

/**
 * 按钮权限
 */
export const updateuserbuttopermissions = () => {
    return axios.post(API_URL.user.updateuserbuttopermissions);
}