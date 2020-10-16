// 我的订单 API

import {get,postJson} from '../util/request.js'
//查询用户信息
export const getUserInfo = () => get("/sso/info/");
//查询订单数量
export const getOrderCount = () => get("/order/orderCount/");

//我的 广告banner资源
export const getContentImg = () => get("/advertise/getALlAdvertiser/");

//用户问题反馈
export const addFeedback = (param) => postJson("/sso/addProblemFeedback",param);