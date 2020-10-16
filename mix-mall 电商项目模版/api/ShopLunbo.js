// 店铺轮播 API
import {get, post} from '../util/request.js'

//获取店铺轮播图
export const getShopLunbo = (shopNum) => get("/shopLunbo/getShopLunboList?shopNum=" + shopNum);