import {getTokenExpire, removeToken} from '../../util/auth.js'

const user = {
	state: {
		loginFlag: false,
		userInfo: {},
	},
	mutations: {
		userInfoState(state, provider) {
			state.userInfo = provider;
			// uni.setStorage({//缓存用户登陆状态
			//     key: 'Mall-UserInfo',  
			//     data: provider  
			// }) 
		},
		login(state, provider) {
			state.loginFlag = true;
			//state.userInfo = provider;
			// uni.setStorage({//缓存用户登陆状态
			//     key: 'Mall-UserInfo',  
			//     data: provider  
			// }) 
		},
		logout(state) {
			state.loginFlag = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'Mall-UserInfo'  
            })
			removeToken();
		}
	},
	actions: {
	
	},
	getters: {
		userInfo: state => {
			return state.userInfo;
		},
	    // state的计算属性
		hasLogin: state => {
			if(state.loginFlag) {
				return state.loginFlag
			} else {
				//查询本地缓存用户信息是否已过期
				let expire = getTokenExpire();
				if(expire) {
					return parseInt(expire) >= (new Date().getTime() / 1000);
				} 
				return false;
			}
		}
	}
};

export default user	