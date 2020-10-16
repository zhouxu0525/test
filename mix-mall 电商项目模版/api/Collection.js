// 收藏 API
import {get, post} from '../util/request.js'

//收藏列表
export const getCollectionList = (param) => get("/member/productCollection/list",param);
//收藏
export const addShopFollow = (param) => post("/shop/shopFollow", param);
//取消收藏
export const cancelShopFollow = (param) => post("/shop/shopCancelAttention", param);

