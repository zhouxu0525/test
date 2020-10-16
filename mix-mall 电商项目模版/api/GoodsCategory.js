// 商品分类 API

import {get} from '../util/request.js'

export const getlist = () => get("/product/categoryTreeList");