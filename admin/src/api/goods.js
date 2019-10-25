import axios from '@/libs/api.request'
import {
  API_URL
} from './url'

export const manage = filter => {
  return axios.get(API_URL.goods.manage, filter)
}

export const info = goodsID => {
  return axios.get(API_URL.goods.info + goodsID);
}

export const add = (json) => {
  return axios.post(API_URL.goods.add, json)
}

export const update = (json) => {
  return axios.post(API_URL.goods.update, json)
}

export const goodsTypes = () => {
  return axios.get(API_URL.goods.goodsTypes);
}

export const goodsBrands = () => {
  return axios.get(API_URL.goods.goodsBrands);
}

export const set = (goodsIDArray, type) => {
  return axios.post(API_URL.goods.setOption, {
    option: type === 1 ? '上架' : type === 2 ? '下架' : type === 3 ? '已审核' : type === 4 ? "待审核" : "停用",
    goods_ids: goodsIDArray
  });
}
