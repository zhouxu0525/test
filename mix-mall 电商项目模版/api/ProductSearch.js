//商品搜索 ES
import base from '../config.js'

export function searchProduct(params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.SEARCH_URL + '/product/search',
			method: "get",
			data: params || {},
			// header: options.header || {},
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: () => {
				uni.hideLoading()
			}

		})
	})
}

//获取搜索的相关品牌、分类及筛选属性
export function searchProductRelate(params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.SEARCH_URL + '/product/search/relate',
			method: "get",
			data: params || {},
			// header: options.header || {},
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: () => {
				uni.hideLoading()
			}

		})
	})
}


//获取搜索的相关品牌、分类及筛选属性
export function searchShopCateList(params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.SEARCH_URL + '/product/search/shopCateList',
			method: "get",
			data: params || {},
			// header: options.header || {},
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			},
			complete: () => {
				uni.hideLoading()
			}

		})
	})
}