// 我的收货地址 API

import {get,post,postJson} from '../util/request.js'
//收货地址列表
export const getAddressList = () => get("/member/address/list/"); 
//新增收货地址
export const addAddressInfo = (param) => postJson("/member/address/add/",param); 
//编辑收货地址
export const editAddressInfo = (param) => postJson("/member/address/update/",param); 
//删除收货地址
export const deleteAddress = (param) => post("/member/address/delete",param); 
//获取所有得省份
export const getAllProvince = () => get("/member/address/getAllProvince/");
//根据省编码查询市信息
export const getAllCity = (param) => get("/member/address/getAllCity/",param); 
