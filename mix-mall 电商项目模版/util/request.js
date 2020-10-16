import base from '../config.js'
import {getToken, setToken, setTokenExpire} from './auth.js'


export function postJson(url, params) {
	const token = getToken();
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.BASE_URL + url,
			method: "post",
			data: params || {},
			header: {
				'Authorization': token || "",
				'content-type': 'application/json' 
			},
			// header: options.header || {},
			success: res => {
				resultReturn(res, resolve)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

export function post(url, params) {
	const token = getToken();
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.BASE_URL + url,
			method: "post",
			header: {
				'Authorization': token || "",
				'content-type': 'application/x-www-form-urlencoded' 
			},
			data: params || {},
			// header: options.header || {},
			success: res => {
				resultReturn(res, resolve)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

export function get(url, params) {
	const token = getToken();
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.BASE_URL + url,
			method: "get",
			header: {
				'Authorization': token || "",
			},
			data: params || {},
			success: res => {
				resultReturn(res, resolve)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

function resultReturn(res, resolve) {
	if(res.data && res.data.code == 401) {
		//需要登录，提示是否跳转至登录页
		uni.showModal({
			title: '登录提示',
			content: '您还未登录，是否现在去登录？',
			cancelText: '稍后登录',
			success: res => {
				if (res.confirm) {
					//跳转至登录页，获取当前页面路由
					var pages = getCurrentPages();
					var page = pages[pages.length - 1];
					const route = page.route;
					uni.reLaunch({
						url: '/pages/public/login?to=/' + route
					})
				} else if (res.cancel) {
				}
			}
		});
	} 
	if(res.data && res.data.code == 200) {
		//仅刷新过期时间
		if(res.header && res.header.mall_header_refresh_expire) {
			let expire = res.header.mall_header_refresh_expire;
			setTokenExpire(expire);
		}
		//token与过期时间 同步刷新
		if(res.header && res.header.mall_header_refresh_token) {
			let token = res.header.mall_header_refresh_token.split(";")[0];
			let expire = res.header.mall_header_refresh_token.split(";")[1];
			setToken(token, expire)
		}
	}
	//函数回调
	resolve(res.data)
}

export function fileUpload(file) {
	const token = getToken();
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: base.BASE_URL + "/upload/fileUpload",
			filePath: file,
			name:'file',  
			header: {
				'Authorization': token || "",
			},
			success: function(res){
				 resultReturn(res, resolve)
			},
			fail: function(res){
				console.log('fail to upload image:', res)
			}
		});
	})
}