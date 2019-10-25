import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取枚举列表
 * @param {Number} type
 */
export const enumList = (type) => {
  return axios.get(API_URL.enum.list + type);
}
