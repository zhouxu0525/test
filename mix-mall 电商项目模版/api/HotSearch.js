// 热门搜索 API
import {get, post} from '../util/request.js'

//获取热门搜索
export const getHotSearchList = () => get("/hotSearch/hotSearchList");
