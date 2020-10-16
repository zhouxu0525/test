// 订单相关 API
import {get, post} from '../util/request.js'

//获取订单列表数据
export const getOrderList = (param) => get("/order/list", param);

//用户取消订单
export const cancelUserOrder = (param) => post("/order/cancelUserOrder", param);
//用户删除订单
export const deleteOrder = (param) => post("/order/deleteOrder", param);

//取消单个超时订单
export const cancelOrder = (param) => post("/order/cancelOrder", param);


//用户确认收货
export const confirmReceiveOrder = (param) => post("/order/confirmReceiveOrder", param);

//获取订单详情
export const orderDelteil = (param) => get("/order/detail/"+param);

//支付 网关预下单
export const prePayOrder = (param) => post("/order/prePayOrder", param);

//查看当前订单是否可以下单
export const placeAnOrderValidate = (param) => post("/order/placeAnOrderValidate", param);
