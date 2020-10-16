// 支付相关 API
import base from '../config.js'

//获取支付订单详情
export const getPayOrderInfo = (param) => get("/payGateWay/validPayOrderInfo/" + param);

//获取支付方式
export const getPayChannelList = (param) => get("/payGateWay/payChannel/" + param);

//支付
export const pay = (param) => post("/payGateWay/pay", param);


function get(url, params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.PAY_URL + url,
			method: "get",
			data: params || {},
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

function post(url, params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.PAY_URL + url,
			method: "post",
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: params || {},
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}
