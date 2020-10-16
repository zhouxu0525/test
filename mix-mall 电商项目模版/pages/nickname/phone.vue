<template>
	<view>
		<!-- 头部 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				更改手机号
			</view>
		</view>

		<view style="height: 95rpx;"></view>

		<view class="card">
			<view class="card_1">请完成以下认证</view>
			<view class="card_div">请输入12323318256收到的短信验证码</view>
			<input class="card_2" placeholder="请输入验证码">
			<view class="wrap">
				<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange" start-text="发送验证码"></u-verification-code>
				<u-button @tap="getCode">{{tips}}</u-button>
			</view>

			</input>
			<view class="but">下一步</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tips: '',
				// refCode: null,
				seconds: 60,
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				this.$u.toast('倒计时结束');
			},
			start() {
				this.$u.toast('倒计时开始');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	// 头部
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 750rpx;
		height: 95rpx;
		text-align: center;
		line-height: 95rpx;
		background-color: #fff;
	}

	.left-btn {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0 30rpx;
		height: 100%;
		z-index: 100;
	}

	.arrow-icon {
		width: 20rpx;
		height: 34rpx;
	}

	.title {
		font-family: PingFang-SC-Medium;
		height: 100%;
		font-size: 36rpx;
		font-weight: bold;
		color: #232323;
	}

	.card {
		width: 100%rpx;
		height: 506rpx;
		background-color: #ffffff;
	}

	.card_1 {
		padding: 69rpx 31rpx;
		font-family: PingFang-SC-Medium;
		font-size: 32rpx;
		font-weight: normal;
		color: #313131;
	}

	.card_div {
		padding: 10rpx 32rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		color: #313131;
	}

	.card_2 {
		width: 690rpx;
		height: 66rpx;
		margin: 0 auto;
		border-bottom: 1rpx solid #e5e5e5;
		margin-top: 38rpx;
	}

	/deep/.u-btn {
		width: 146rpx;
		height: 48rpx;
		padding: 0 0;
		position: absolute;
		right: 40rpx;
		top: 365rpx;

	}

	.u-btn--default {
		color: #db2929;
		font-size: 3vw;

	}

	/deep/uni-button:after {
		border-radius: 100rpx;
	}
	.but{
		width: 690rpx;
		height: 90rpx;
		background-color: #db2929;
		border-radius: 45rpx;
		opacity: 0.2;		
		margin: 0 auto;
		margin-top: 48rpx;
		font-family: PingFang-SC-Medium;
		font-size: 36rpx;
		font-weight: normal;
		color: #ffffff;
		text-align: center;
		line-height: 90rpx;
	}
</style>
