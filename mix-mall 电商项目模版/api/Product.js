// 商品 API

import {get, post, postJson} from '../util/request.js'

export const getProductInfo = (id) => get("/product/detail/" + id);

export const getProductDetail = (param) => get("/product/detailByFlashId", param);

export const getComment = (id) => get("/product/getComment/" + id);

//活动当前登录用户可购买数量
export const getFlashPromotionLimit = (param) => postJson("/product/getFlashPromotionLimit", param);

//店铺推荐商品
export const getShopRecommendProductList = (param) => get("/product/recommendProductList", param);

//添加商品收藏
export const addProductCollection = (param) => postJson("/member/productCollection/add", param);
//删除商品收藏
export const deleteProductCollection = (param) => post("/member/productCollection/delete", param);
//根据商品ID查询商品收藏总数(实时汇总)
export const getProductCollectionCount = (param) => get("/member/productCollection/getProductNumber", param);

//根据商品ID查询用户是否已收藏
export const getProductCollection = (param) => get("/member/productCollection/detail", param);


//获取商品对应服务标签
export const getServiceTagByProduct = (param) => get("/product/serviceTagListByProduct", param);
