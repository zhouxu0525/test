
import {get,postJson} from '../util/request.js'
//
export const findReturnReason = (params) => get("/returnApply/reasonList?channel="+params);
//
export const createReturn = (params) => postJson("/returnApply/create", params);
//
export const returnList = (pageSize,pageNum) => get("/returnApply/list", pageSize,pageNum);
//
export const returnItem = (id) => get("/returnApply/"+id);
