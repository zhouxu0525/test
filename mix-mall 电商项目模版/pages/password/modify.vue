<template>
	<view>
		<!-- 头部 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				修改密码
			</view>
		</view>

		<view style="height: 95rpx;"></view>

		<view class="card">
			<view class="card_1">请输入新的密码</view>
			<input class="card_2" placeholder="请输入新的密码"></input>
			
			<input class="card_2" placeholder="请再次输入密码">
			</input>
			<view class="but">确认</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
	
			}
	
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			
	
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
		padding: 66rpx 31rpx;
		font-family: PingFang-SC-Medium;
		font-size: 32rpx;
		font-weight: normal;
		color: #313131;
	}


	.card_2 {
		width: 690rpx;
		height: 66rpx;
		margin: 0 auto;
		border-bottom: 1rpx solid #e5e5e5;
		margin-top: 20rpx;
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
