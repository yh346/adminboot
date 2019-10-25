import axios from '@/libs/api.request'
import {
  API_URL
} from './url'

/**
 * 属性管理列表
 * @param {Number} goodsTypeID 
 */
export const manage = (goodsTypeID) => {
  return axios.get(API_URL.goodsProperty.manage + goodsTypeID)
}

/**
 * 属性列表
 * @param {Number} goodsTypeID 
 */
export const list = (goodsTypeID) => {
  return axios.get(API_URL.goodsProperty.list + goodsTypeID)
}

/**
 * 新增属性
 * @param {Object} json 
 */
export const add = (json) => {
  return axios.post(API_URL.goodsProperty.add, json)
}

/**
 * 编辑属性
 * @param {Object} json 
 */
export const update = (json) => {
  return axios.post(API_URL.goodsProperty.update, json)
}

/**
 * 属性详情
 * @param {Number} propertyId 
 */
export const info = (propertyId) => {
  return axios.get(API_URL.goodsProperty.info + propertyId)
}

/**
 * 删除属性
 * @param {Number} propertyId 
 */
export const del = (propertyId) => {
  return axios.post(API_URL.goodsProperty.del, {
    single_id: propertyId
  })
}

/**
 * 删除属性值
 * @param {Number} valueID 
 */
export const deleteValue = (valueID) => {
  return axios.post(API_URL.goodsProperty.deleteValue, {
    single_id: valueID
  })
}

/**
 * 新增属性值
 * @param {Object} json 
 */
export const addValue = (json) => {
  return axios.post(API_URL.goodsProperty.addValue, json)
}

/**
 * 编辑属性值
 * @param {Object} json 
 */
export const updateValue = (json) => {
  return axios.post(API_URL.goodsProperty.updateValue, json)
}
