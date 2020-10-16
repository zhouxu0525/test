import Vue from 'vue'
import store from './store'
import App from './App'
import Json from './Json' //测试用数据
import {Request} from './api/comm.js'
import './util/ican-H5Api.js'

// 导入uview
import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$Request = Request;
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const confirm = (params) => {
	uni.showModal({
		title: params.title || '登录提示',
		content: params.content,
		cancelText: params.cancelText || '取消',
		okText: params.okText || '确定',
		success: res => {
			if (res.confirm) {
				params.success();
			} else if (res.cancel) {
				if(params.cancel) {
					params.cancel();
				}
			}
		}
	});
}

const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}

const curPage = () => {
	let pages = getCurrentPages();
	let curPage = pages[pages.length - 1];
	// #ifdef H5
	return curPage;
	// #endif
	return curPage.$vm;
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	confirm,
	json,
	prePage,
	curPage
};


App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
