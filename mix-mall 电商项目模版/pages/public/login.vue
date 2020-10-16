<template>
	<view v-if="isPhone">
		<button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">唤起授权</button>
	</view>
	<view class="login_container" v-else>
		<view class="not-password-login">
			<view class="not-password-login-content" @tap="hTapNotPWDLogin">
				{{!isWithoutCode ? "验证码" : "账号密码"}}登录
			</view>
		</view>

		<!-- 版心 -->
		<view class="container">
			<view class="login-welcome-title">
				欢迎来到商城
			</view>
			<view class="login-welcome-desc">
				赶快登录逛逛好物吧~
			</view>
			<view class="form">
				<view class="item">
					<view class="label">
						手机号
					</view>
					<view class="input_container">
						<input maxlength="11" type="number" class="input" v-model="form.phone" placeholder="请输入手机号" @focus="hFocus('phone')"
						 placeholder-class="placeholder" />
						<!-- 手机号错误提示 -->
						<view class="input_tip" v-if="formMessage.phone">
							{{formMessage.phone}}
						</view>
					</view>
				</view>

				<view class="item" v-if="isWithoutCode">
					<view class="label">
						验证码
					</view>
					<view class="input_container">
						<input type="number" class="input" v-model="form.code" placeholder="请输入验证码" placeholder-class="placeholder" />
						<view class="code_box">
							<view v-if="getCodeStatus==1" class="getCode" @tap="hTapGetCode">
								发送验证码
							</view>
							<view v-if="getCodeStatus==2" class="stayCode">
								{{stepNum}} S
							</view>
							<view v-if="getCodeStatus==3" class="getCode" @tap="hTapGetCode">
								重新发送
							</view>
						</view>
					</view>
				</view>
				<view class="item" v-else>
					<view class="label">
						密码
					</view>
					<view class="input_container">
						<view class="input-wrap">
							<input v-if="pwdType=='password'" type="password" maxlength="13" class="input" v-model="form.password"
							 placeholder="请输入密码" @focus="hFocus('password')" placeholder-class="placeholder" />
							<input v-if="pwdType=='text'" type="text" maxlength="13" class="input" v-model="form.password" @focus="hFocus('password')"
							 placeholder="请输入密码" placeholder-class="placeholder" />
							<view class="icon_box">
								<image @tap="hTapPWDIcon('text')" class="pwdicon" v-if="pwdType=='password'" src="@/static/pwdnotshow.png" />
								<image @tap="hTapPWDIcon('password')" class="pwdicon" v-if="pwdType=='text'" src="@/static/pwdshow.png" />
							</view>
						</view>
						<!-- 密码格式错误提示 -->
						<view class="input_tip" v-if="formMessage.password">
							{{formMessage.password}}
						</view>
					</view>
				</view>
			</view>
			<view class="button_box">
				<view class="forget_password" v-if="!isWithoutCode" @tap="hTapForgetPWD">
					忘记密码
				</view>
				<view class="button" :class="loginCheck? 'active':''" @tap="hTapBTN">
					登录
				</view>
			</view>
		</view>
		<!-- 去注册 -->
		<view class="goRegister" @tap="hTapGoRegister">
			还没有账号？
			<view class="registerBTN">
				去注册
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import {
		loginsub,
		miniPLogin,
		decryptPhone,
		wxmpAuthLogin
	} from '@/api/Login.js'
	import {
		setToken
	} from '@/util/auth.js'
	import {
		tabBarUrl
	} from '@/util/common.js'

	export default {
		data() {
			return {
				toUrl: '',
				key: '',
				form: {
					phone: '',
					password: '',
					code: ''
				},
				// 表单错误提示信息
				formMessage: {
					phone: '',
					password: '',
				},
				pwdType: 'password',
				// 是否验证码登陆
				isWithoutCode: true,
				getCodeStatus: 1,
				stepNum: 60,
				getCodeTimer: '',
				isPhone: false,
				sessionResult: {}
			};
		},
		onLoad(options) {
			console.log(options)
			if (this.hasLogin) {
				this.$api.msg("正在为你跳转...")
				setTimeout(() => {
					this.navtourl();
				}, 500)
			} else {
				//登录
				uni.showLoading({
					title: '正在登录中...'
				})
				this.doThirdLogin(options);
			}
			//登录后跳转目的页
			if (options.to) {
				this.toUrl = options.to;
			}
		},
		computed: {
			...mapGetters(['hasLogin']),
			loginCheck() {
				// 是否为验证码登陆
				if (this.isWithoutCode) {
					if (this.form.phone.toString().trim() && this.form.code.trim()) {
						return true
					}
					return false
				} else {
					if (this.form.phone.toString().trim() && this.form.password.trim()) {
						return true
					}
					return false
				}
			}
		},
		methods: {
			...mapMutations(['login']),
			hFocus(type) {
				this.formMessage[type] = ''
			},
			// 点击验证码登陆
			hTapNotPWDLogin() {
				if (this.isWithoutCode) {
					this.isWithoutCode = false
				} else {
					this.isWithoutCode = true
				}
			},
			hTapPWDIcon(type) {
				this.pwdType = type
			},
			// 获取验证码
			hTapGetCode() {
				clearInterval(this.getCodeTimer)
				this.getCodeStatus = 2
				this.getCodeTimer = setInterval(() => {
					--this.stepNum
					if (this.stepNum <= 0) {
						this.getCodeStatus = 3
						this.stepNum = 60
						clearInterval(this.getCodeTimer)
					}
				}, 1000)
			},
			hTapForgetPWD() {
				uni.navigateTo({
					url: '/pages/public/forget'
				})
			},
			// 点击登陆
			hTapBTN() {
				// 表单信息未填写完整
				if (!this.loginCheck) return
				// 进行表单校验
				const formReg = {
					phone: {
						reg: /^1[3456789]\d{9}$/,
						tip: '请输入正确的11位手机号'
					},
					password: {
						reg: /[a-zA-Z0-9-*/+.~!@#$%^&*()]{3,13}/,
						tip: '密码长度3-13'
					}
				}
				let formCheck = true
				for (const key in this.form) {
					if (key != 'code') {
						const regRes = formReg[key].reg.test(this.form[key])
						if (!regRes) {
							formCheck = false
							this.formMessage[key] = formReg[key].tip
						}
					}
				}
				// 表单校验失败
				if (!formCheck) return
				//开始登录
				this.toLogin();
			},
			//登录提交
			async toLogin() {
				uni.showLoading({
					title: '正在加载中...'
				})
				const sendData = {
					'username': this.form.phone,
					'password': this.form.password,
					'key': this.key
				};
				var loginflag = false;
				await loginsub(sendData).then(res => {
					if (res.code === 200) {
						var data = res.data;
						var userInfo = {
							'username': this.form.phone
						};

						//缓存
						this.login(userInfo);
						setToken(data.tokenHead + data.token, data.expire);

						loginflag = true;
						uni.hideLoading();
					} else {
						uni.hideLoading();
						this.$api.msg(res.message);
					}
				});

				if (!loginflag) {
					return;
				}

				this.navtourl();
				//后退路由
				//uni.navigateBack();
			},
			navtourl() {
				if (this.toUrl && this.toUrl != '') {
					//跳转至目标页面
					let to_url = this.toUrl
					if (to_url.startsWith("http")) {
						location.href = to_url;
					} else {
						this.unito(to_url);
					}
				} else {
					//跳转首页
					this.unito('/pages/index/index');
				}
			},
			unito(tourl) {
				var tabBar = false;
				tabBarUrl.forEach(url => {
					if (tourl.indexOf(url) != -1) {
						tabBar = true;
					}
				})
				if (tabBar) {
					uni.switchTab({
						url: tourl
					})
				} else {
					uni.redirectTo({
						url: tourl
					});
				}
			},
			// 点击去注册
			hTapGoRegister() {
				uni.navigateTo({
					url: '/pages/public/register'
				})
			},
			doThirdLogin(options) {
				// #ifdef  H5
				if (this.isWeiXin()) { //微信浏览器
					if (options.type1 == "bind") {
						this.key = options.key;
						uni.hideLoading();
						return
					}
					if (window.location.href.indexOf("code=") > -1) {
						//微信返回的,带有code
						this.wxmpAuthLogin(this.getUrlKey("code"))
					} else {
						var loginUrl =
							"https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
						var redirectUri = window.location.href;
						console.log("redirectUri", redirectUri)
						loginUrl = loginUrl.replace("APPID", "wx79b52f05b016b68d");
						loginUrl = loginUrl.replace("REDIRECT_URI", redirectUri);
						loginUrl = loginUrl.replace("SCOPE", "snsapi_base");
						console.log("loginUrl", loginUrl)
						window.location.href = loginUrl;
					}
				} else {
					uni.hideLoading();
				}
				// #endif
				// #ifndef  H5
				uni.getProvider({
					service: 'oauth',
					success: (result) => {
						console.log("Provider", result.provider[0])
						var provider = result.provider[0];
						console.log("----->当前环境:[" + provider + "]<-----");
						if ("weixin" == result.provider[0]) {
							uni.login({
								provider: provider,
								// #ifdef MP-ALIPAY
								scopes: 'auth_user', //支付宝小程序需设置授权类型
								// #endif
								success: (res) => {
									console.log('login success:', res);
									miniPLogin({
										"code": res.code,
										"provider": provider
									}).then(res => {
										if (res.code == 200) {
											console.log("----->微信小程序自动登录成功<-----", res);
											this.saveLoginInfo(res);
										} else if (res.code == 206) {
											uni.hideLoading()
											console.log("----->微信小程序自动登录失败,进行手机号授权<-----", res);
											//登录失败,进行手机号授权
											this.sessionResult = res.data;
											this.isPhone = true;
										}
									})
								}
							});
						}
					},
				});
				//#endif
			},
			onGetPhoneNumber(e) {
				if (e.detail.errMsg == "getPhoneNumber:fail user deny") { //用户决绝授权
					//拒绝授权后弹出一些提示
					console.log("----->微信小程序手机号拒绝授权<-----");
				} else {
					uni.showLoading({
						title: '正在登录中...'
					})
					//允许授权
					console.log("----->微信小程序手机号同意授权<-----", e.detail);
					//保存用户信息
					const param = Object.assign(e.detail, this.sessionResult);
					decryptPhone(param).then(res => {
						if (res.code == 200) {
							console.log("----->微信小程序用户注册成功<-----");
							this.saveLoginInfo(res);
						}
						uni.hideLoading();
					})
				}
			},
			wxmpAuthLogin(code) {
				wxmpAuthLogin({
					"code": code
				}).then(res => {
					if (res.code == 200) {
						console.log("----->微信auth静默登录成功<-----", res);
						this.saveLoginInfo(res);
					} else if (res.code == 206) {
						console.log("----->微信auth静默登录失败,进行用户信息授权<-----", res);
						//登录失败,进行授权
						var loginUrl =
							"https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
						var redirectUri = "http://1g82496s05.imwork.net/mall/pages/public/bind";
						console.log("redirectUri", redirectUri)
						loginUrl = loginUrl.replace("APPID", "wx79b52f05b016b68d");
						loginUrl = loginUrl.replace("REDIRECT_URI", redirectUri);
						loginUrl = loginUrl.replace("SCOPE", "snsapi_userinfo");
						window.location.href = loginUrl;
					}
				})
			},
			saveLoginInfo(res) {
				var data = res.data;
				var userInfo = {
					'username': data.phone
				};
				//缓存
				this.login(userInfo);
				setToken(data.tokenHead + data.token, data.expire);
				this.navtourl();
			},
			getUrlKey: function(name) {
				return decodeURIComponent(
					(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')
				) || null;
			},
			isWeiXin() {
				var ua = window.navigator.userAgent.toLowerCase();
				if (ua.indexOf('micromessenger') > -1) {
					return true; // 是微信端
				} else {
					return false;
				}
			}
		},
	}
</script>

<style lang="scss">
	.login_container {
		line-height: 1;
	}

	.not-password-login {
		display: flex;
		justify-content: flex-end;
		padding-right: 30rpx;
		padding-top: 100rpx;

		.not-password-login-content {
			font-family: PingFang-SC-Medium;
			font-size: 28rpx;
			line-height: 43rpx;
			letter-spacing: 1rpx;
			color: #313131;
			padding: 30rpx;
		}
	}

	.login-welcome-title {
		font-family: PingFang-SC-Medium;
		font-size: 48rpx;
		font-weight: bold;
		font-stretch: normal;
		line-height: 43rpx;
		letter-spacing: 1rpx;
		color: #313131;
	}

	.container {
		padding: 0 60rpx;

		.login-welcome-title {
			margin: 60rpx 0 22rpx;
		}

		.login-welcome-desc {
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			letter-spacing: 1rpx;
			color: #999999;
		}

		.form {
			margin-top: 95rpx;

			.item {
				display: block;

				&:last-child {
					margin-top: 55rpx;
				}
			}

			.label {
				font-family: PingFang-SC-Medium;
				font-size: 36rpx;
				color: #313131;
			}

			.input_container {
				position: relative;
				display: block;
				margin-top: 15rpx;
				border-bottom: 1rpx solid #e5e5e5;

				.input-wrap {
					position: relative;
				}

				.input_tip {
					line-height: 1;
					font-size: 36rpx;
					color: #f56c6c;
					height: 50rpx;
				}

				.input {
					display: block;
					height: 77rpx;
					width: 100%;
					line-height: 77rpx;
					border: 0;
					outline: 0;
					margin: 0;
					padding: 0;
				}

				.placeholder {
					line-height: 77rpx;
					font-family: PingFang-SC-Medium;
					font-size: 28rpx;
					color: #bbbbbb;
				}

				.icon_box {
					position: absolute;
					top: 50%;
					right: 30rpx;
					transform: translateY(-50%);

					.pwdicon {
						width: 32rpx;
						height: 32rpx;
					}
				}

				.code_box {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					right: 0rpx;

					// 获取验证码
					.getCode {
						width: 146rpx;
						height: 48rpx;
						border-radius: 24rpx;
						border: solid 1rpx #db2929;
						font-family: PingFang-SC-Medium;
						font-size: 22rpx;
						line-height: 46rpx;
						color: #db2929;
						text-align: center;
						box-sizing: border-box;
					}

					// 倒计时
					.stayCode {
						width: 132rpx;
						height: 48rpx;
						border-radius: 24rpx;
						border: solid 1rpx #bbbbbb;
						font-family: PingFang-SC-Medium;
						font-size: 22rpx;
						line-height: 46rpx;
						color: #bbbbbb;
						text-align: center;
					}
				}
			}
		}

		.button_box {
			padding-top: 117rpx;
			position: relative;

			.forget_password {
				position: absolute;
				right: 0;
				top: 0;
				font-family: PingFang-SC-Medium;
				font-size: 24rpx;
				line-height: 43rpx;
				padding: 35rpx 0 0 30rpx;
				color: #db2929;
			}

			.button {
				height: 91rpx;
				line-height: 91rpx;
				background-color: #db2929;
				border-radius: 45rpx;
				opacity: 0.2;
				font-family: PingFang-SC-Medium;
				font-size: 36rpx;
				color: #ffffff;
				text-align: center;
			}

			.active {
				opacity: 1;
			}
		}
	}

	.goRegister {
		margin-top: 270rpx;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #bbbbbb;

		.registerBTN {
			height: 60rpx;
			display: inline-block;
			color: #db2929;
		}
	}
</style>
