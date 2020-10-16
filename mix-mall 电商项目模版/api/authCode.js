// 验证码 API
import {get, post} from '../util/request.js'

//获取验证码
export const getAuthCode = (telephone) => get("/sso/getAuthCode?telephone=" + telephone);