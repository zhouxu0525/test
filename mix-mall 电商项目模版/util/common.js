import base from '../config.js'

export function getImgUrl(imgPath) {
	return base.IMG_URL + imgPath;
}

//页面内含有tabbar的页面Path
export const tabBarUrl = ['pages/index/index', 'pages/category/category', 'pages/cart/cart', 'pages/user/user']

//校验是否非负浮点数
export function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    //var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
	return regPos.test(val);
}

//返回上级页面
export function navigateToBack(delta=1) {
	if(getCurrentPages() && getCurrentPages().length > 1) {
		uni.navigateBack({
			delta: delta
		});
	} else {
		//返回首页
		uni.switchTab({
		    url: '/pages/index/index'
		});
	}
}

//若为站内跳转链接，则自动截取正确路由地址
export function subWebSiteHttp(url) {
	if(url.indexOf(base.PATH) == -1) {
		return url;
	}
	url = url.substring(url.indexOf(base.PATH) + base.PATH.length);
	if(!url.startsWith("/")) {
		url = "/" + url;
	}
	return url;
}

//路由跳转
export function navigateTo(url) {
	//截取正确路由
	url = subWebSiteHttp(url);
	//页面跳转
	if(!url.startsWith("/")) {
		url = "/" + url;
	}
	var tabbar = false
	for(var i = 0; i < tabBarUrl.length; i++) {
		if(url.indexOf(tabBarUrl[i]) != -1) {
			tabbar = true;
			break;
		}
	}
	if(tabbar) {
		uni.switchTab({
		    url: url
		});
	} else {
		uni.navigateTo({
			url: url
		})
	}
}