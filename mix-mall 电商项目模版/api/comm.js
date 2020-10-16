import base from '../config.js'

export function Request(url, methods, params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: base.BASE_URL + url,
			method: methods || "get",
			data: params || {},
			// header: options.header || {},
			success: res => {
				resolve(res)
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
