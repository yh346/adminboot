import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.works.getpage, filter);
}

/**
 * 
 * @param {删除} filter 
 */
export const del = (id) => {
    return axios.get(API_URL.works.del + "/" +id);
}

export const get = (id) => {
    return axios.get(API_URL.works.get + "/" +id);
}

export const update = (dto) => {
    return axios.post(API_URL.works.update,dto);
}

export const add = (dto) => {
    return axios.post(API_URL.works.add,dto);
}
