import axios from '@/libs/api.request';
import { API_URL } from './url';

/**
 * 根据分类获取数据列表
 *  @param {Number} type
*/
export const list = (type) => {
    return axios.get(API_URL.dict.list + type);
}

/**
 * 新增字典数据
 *  @param {Object} json
*/
export const add = (json) => {
    return axios.post(API_URL.dict.add, json);
}

/**
 * 更新字典数据
 * @param {Object} json
*/
export const update = (json) => {
    return axios.post(API_URL.dict.update, json);
}

/**
 * 删除字典数据
 * @param {Number} dictID
*/
export const del = (dictID) => {
    return axios.post(API_URL.dict.delete, { single_id: dictID });
}
