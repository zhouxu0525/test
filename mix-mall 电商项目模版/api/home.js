//首页 API
import {get, post} from '../util/request.js'
//获取首页展示数据
export const getHomeData = () => get("/home/content/");