import axios from '@/libs/api.request';
import {
    API_URL
} from './url';

export const course = (filter) => {
    return axios.post(API_URL.adminhome.course, filter);
}

export const user = (filter) => {
    return axios.post(API_URL.adminhome.user, filter);
}

export const order = (filter) => {
    return axios.post(API_URL.adminhome.order, filter);
}