// 楼层 API

import {get} from '../util/request.js'
//查询页面楼层
export const getPageInfo = (params) => get("/page/getPageInfo", params);
//查询楼层内容
export const getFloorInfoConfig = (params) => get("/page/getFloorInfoConfig", params);


export const getIndex = () => get("/page/getIndex");