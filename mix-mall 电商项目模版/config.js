const ENV = process.env.NODE_ENV;
console.log('当前环境', process.env.NODE_ENV)

const apiHub = {
	//开发环境
	development: {
	        BASE_URL: "http://1g82496s05.imwork.net/mall-app-api", 
	        PAY_URL: "http://1g82496s05.imwork.net/mall-pay-api", 
	        SEARCH_URL: "http://1g82496s05.imwork.net/mall-search-api", 
	        IMG_URL: "http://1g82496s05.imwork.net/mall-uploadfiles",
			BASE_UPLOAD_URL: "",
			123
	    },

	//测试环境
	test: {
		BASE_URL: "https://xxx",
		IMG_URL: "https://xxx",
		BASE_UPLOAD_URL: "",
	},

	//测试环境
	//   production: {
	//       BASE_URL: "/mall-app-api", 
	//       PAY_URL: "/mall-pay-api", 
	// SEARCH_URL: "/mall-search-api", 
	//       // IMG_URL: "http://192.168.100.100/mall-uploadfiles",
	// IMG_URL: "/mall-uploadfiles",
	//       BASE_UPLOAD_URL: "",
	//   },

	//外网测试环境
	// production: {
	// 	BASE_URL: "/mall-app-api",
	// 	PAY_URL: "/mall-pay-api",
	// 	SEARCH_URL: "/mall-search-api",
	// 	IMG_URL: "/mall-uploadfiles",
	// 	BASE_UPLOAD_URL: "",
	// 	PATH: "/mall/"
	// },

	production: {
	    BASE_URL: "http://192.168.100.100/mall-app-api", 
	    PAY_URL: "http://192.168.100.100/mall-pay-api", 
		SEARCH_URL: "http://192.168.100.100/mall-search-api", 
	    IMG_URL: "http://192.168.100.100/mall-uploadfiles",
	    BASE_UPLOAD_URL: "",
		PATH: "/mall/"
	}
}

// 导出配置
export default {
	ENV: ENV,
	...apiHub[ENV]
}
