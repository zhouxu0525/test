// 用户登录 API

import {get, post, postJson} from '../util/request.js'
 
export const loginsub = (params) => post("/sso/login", params);

export const miniPLogin = (params) => post("/thirdLogin/miniPLogin", params);

export const wxmpAuthLogin = (params) => post("/thirdLogin/wxmpAuthLogin", params);

export const getWxUserInfo = (params) => post("/thirdLogin/getWxUserInfo", params);

export const decryptPhone = (params) => post("/thirdLogin/decryptPhone", params);

export const logoutsub = () => post("/sso/logout/", {});