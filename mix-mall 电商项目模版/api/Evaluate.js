// 商品评价 API
import {get,postJson,post} from '../util/request.js'
//评价列表
export const getEvaluateList = (param) => get("/order/getEvaluateList/",param);
//添加评价
export const addEvaluate = (param) => postJson("/order/addEvaluate",param);
//用户点赞
export const addGive = (param) => postJson("/order/addGive",param);
//用户取消点赞
export const cancelGive = (param) => postJson("/order/cancelGive",param);
//用户添加评论
export const addUserEvaluate = (param) => postJson("/order/addUserEvaluate",param);



