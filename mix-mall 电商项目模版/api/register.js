// 用户注册 API

import {get, post, postJson} from '../util/request.js'
 
export const register = (params) => post("/sso/register", params);