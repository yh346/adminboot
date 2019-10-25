import axios from '@/libs/api.request'
import {
  API_URL
} from './url'

/**
 * 品牌管理列表
 * @param {Object} filter 
 */
export const manage = (filter) => {
  return axios.get(API_URL.goodsBrand.manage, filter)
}

/**
 * 品牌管理列表
 * @param {Number} brandID 
 */
export const info = (brandID) => {
  return axios.get(API_URL.goodsBrand.info + brandID)
}

/**
 * 新增品牌
 * @param {Object} json 
 */
export const add = (json) => {
  return axios.post(API_URL.goodsBrand.add, json)
}

/**
 * 编辑品牌
 * @param {Object} json 
 */
export const update = (json) => {
  return axios.post(API_URL.goodsBrand.update, json)
}

/**
 * 删除品牌
 * @param {Number} brandID 
 */
export const del = (brandID) => {
  return axios.post(API_URL.goodsBrand.del, {
    single_id: brandID
  })
}
