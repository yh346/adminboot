import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */
export const getpage = (filter) => {
    return axios.post(API_URL.grouplist.getpage, filter);
}

export const enable = (id) => {
    return axios.get(API_URL.grouplist.enable +"/" + id);
}

export const get = (id) => {
    return axios.get(API_URL.grouplist.get +"/" + id);
}

export const update = (dto) => {
    return axios.post(API_URL.grouplist.update ,dto);
}

export const add = (dto) => {
    return axios.post(API_URL.grouplist.add ,dto);
}

export const code = (id) => {
    return axios.get(API_URL.grouplist.code +"/" + id);
}
