// 商品池api
import {get, post} from '../util/request.js'

//获取店铺轮播图
export const getProductModule = (param) => get("/productModule/getProductModule", param);

//获取店铺轮播图
export const getProductModuleByModuleNum = (param) => get("/productModule/getProductModuleByModuleNum", param);