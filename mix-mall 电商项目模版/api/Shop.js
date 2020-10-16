// 店铺 API
import {get, post} from '../util/request.js'

//获取店铺详情
export const getShopInfo = (shopNum) => get("/shop/shopDetails/" + shopNum);
//店铺关注
export const addShopFollow = (param) => post("/shop/shopFollow", param);
//店铺取消关注
export const cancelShopFollow = (param) => post("/shop/shopCancelAttention", param);
//查询用户是否已关注店铺
export const ifShopFollow = (param) => get("/shop/ifFollow", param);

//获取店铺一二级分类
export const shopFirSecCate = (shopNum) => get("/shop/shopFirSecCate/" + shopNum);

//店铺背景
export const getShopBackground = (shopNum) => get("/shopBackground/getShopBackgroundInfo?shopNum=" + shopNum);

//店铺热销
export const shopHotProduct = (shopNum) => get("/product/shopHotProductList?shopNum=" + shopNum);

//关注店铺列表
export const getShopList = (param) => get("/shop/getShopList/",param);
