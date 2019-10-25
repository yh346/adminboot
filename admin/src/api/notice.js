import axios from '@/libs/api.request';
import {
  API_URL
} from './url';

/**
 * 获取公告列表
 * @param {Object} filter
 */
export const manage = (filter) => {
  return axios.get(API_URL.notice.manage, filter);
}

/**
 * 获取公告信息
 * @param {Number} noticeID
 */
export const view = (noticeID) => {
  return axios.get(API_URL.notice.view + noticeID);
}

/**
 * 新增公告
 * @param {Object} json
 */
export const add = (json) => {
  return axios.post(API_URL.notice.add, json);
}

/**
 * 编辑公告
 * @param {Object} json
 */
export const update = (json) => {
  return axios.post(API_URL.notice.update, json);
}

/**
 * 发布公告
 * @param {Array} noticeIDs
 */
export const publish = (noticeIDs) => {
  return axios.post(API_URL.notice.publish, {
    id_array: noticeIDs
  });
}

/**
 * 删除公告
 * @param {Array} noticeIDs
 */
export const del = (noticeIDs) => {
  return axios.post(API_URL.notice.delete, {
    id_array: noticeIDs
  });
}
