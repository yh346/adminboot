import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

/**
 * 分页
 *  @param {Object} filter 
 */


export const getpage = (filter) => {
    return axios.post(API_URL.invite.getpage, filter);
}

