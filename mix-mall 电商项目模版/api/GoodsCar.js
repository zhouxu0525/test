// 购物车 API
import {get, post, postJson} from '../util/request.js'
 //购物车列表
export const goodsCarList = () => get("/cart/list");
//加入购物车
export const addCar = (param) => post("/cart/add", param);
//删除购物车商品
export const delGoodsCar = (ids) => post("/cart/delete", ids);

//修改购物车商品数量
export const updateQuantity = (param) => get("/cart/update/quantity", param);
//移入收藏
export const moveToCollect = (param) => post("/cart/moveToCollection", param);


