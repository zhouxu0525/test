<template>

	<view class="login_container">
		<!-- 版心 -->
		<view class="container">
			<view class="button_box">
				<view class="portrait-box">
					<image class="portrait" :src="this.headImg"></image>
				</view>
				<view class="button" @tap="toRegister">
					注册新账号
				</view>
				<view class="button" @tap="toLogin">
					绑定已有账号
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getWxUserInfo
	} from '@/api/Login.js'
	export default {
		data() {
			return {
				headImg: '',
				key: '',
			};
		},
		onLoad(options) {
			if (window.location.href.indexOf("code=") > -1) {
				//微信返回的,带有code
				this.getWxUserInfo(this.getUrlKey("code"))
			}
		},
		methods: {
			getWxUserInfo(code) {
				getWxUserInfo({
					"code": code
				}).then(res => {
					if (res.code == 200) {
						this.key = res.data.key;
						this.headImg = res.data.headImg;
					} else {
						console.log("登录失败")
					}
				})
			},
			toRegister() {
				uni.navigateTo({
					url: "register?key=" + this.key
				})
			},
			toLogin() {
				uni.navigateTo({
					url: "login?key=" + this.key + "&type1=bind"
				})
			},
			getUrlKey: function(name) {
				return decodeURIComponent(
					(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')
				) || null;
			},
		},
	}
</script>
<style lang="scss">
	.login_container {
		line-height: 1;
	}

	.container {
		padding: 0 60rpx;

		.button_box {
			padding-top: 117rpx;
			position: relative;

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
		}
	}
</style>
