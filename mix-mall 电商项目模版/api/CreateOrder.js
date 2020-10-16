// 创建订单 API

import {post,postJson} from '../util/request.js'
//根据购物车信息生成确认单信息
export const getOrderList = (param) => post("/order/generateConfirmOrder" ,param);
//根据商品信息生成确认单信息
export const getGenerateConfirmOrderByProId = (param) => postJson("/order/generateConfirmOrderByProId",param);
// 根据购物车信息生成订单
export const getGenerateOrder = (param) => postJson("/order/generateOrder",param);
// 根据商品信息生成订单
export const getGenerateOrderBySkuId = (param) => postJson("/order/generateOrderBySkuId",param);
//计算运费接口
export const getFreightTemplate = (param) => postJson("/order/freightTemplate",param);