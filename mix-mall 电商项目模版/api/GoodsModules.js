// 商品池 API

import {get, post, postJson} from '../util/request.js'

export const getProductByModuleConfig = (params) => get("/productModuleConfig/getProductModule", params);