import axios from '@/libs/api.request'
import {
  API_URL
} from './url'

/**
 * 商品类型列表
 */
export const manage = () => {
  return axios.get(API_URL.goodsType.manage)
}

/**
 * 商品类型列表
 */
export const list = () => {
  return axios.get(API_URL.goodsType.list)
}

/**
 * 新增商品类型
 * @param {Object} json 
 */
export const add = (json) => {
  return axios.post(API_URL.goodsType.add, json)
}

/**
 * 编辑商品类型
 * @param {Object} json 
 */
export const update = (json) => {
  return axios.post(API_URL.goodsType.update, json)
}

/**
 * 删除商品类型
 * @param {Number} goodsTypeID
 */
export const del = (goodsTypeID) => {
  return axios.post(API_URL.goodsType.del, {
    single_id: goodsTypeID
  })
}

/**
 * 商品类型品牌列表
 * @param {Number} goodsTypeID
 */
export const listBrands = (goodsTypeID) => {
  return axios.get(API_URL.goodsType.listBrands + goodsTypeID)
}
