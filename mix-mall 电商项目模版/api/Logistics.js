// 物流 API
import {get, post} from '../util/request.js'

//获取订单物流信息
export const getOrderLogistics = (param) => post("/logistics/orderLogistics", param);
