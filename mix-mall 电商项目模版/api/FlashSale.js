// 秒杀列表 API

import {get,post,postJson} from '../util/request.js'
//秒杀活动banner列表
export const getBaneerImg = (param) => get("/flashConfigure/getBaneerImg",param); 
//查询时间轴数据列表
export const getBaneerTime = (param) => get("/flashConfigure/getBaneerTime",param); 
//查询活动列表
export const getBaneerList = (param) => get("/flashConfigure/getBaneerList",param);   
