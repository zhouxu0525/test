<template>
	<view>
		
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="right-btn" @tap="hTapBackIcon">
				确定
			</view>
			<view class="title">
				个人信息
			</view>
		</view>
		<view style="height: 95rpx;"></view>
		<view class="card">
			<view class="card_1">
				<text style="margin-left: 30rpx;">幺幺不走了_</text>
				<view><img src="../../static/delete.png"></view>
			</view>
		</view>
		
		<view style="padding: 30rpx 30rpx; font-family: PingFang-SC-Medium;font-size: 24rpx;font-weight: normal; color: #999999;">4-20个字符</view>
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

		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	/* 头部 */
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

	.right-btn {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0 30rpx;
		height: 100%;
		z-index: 100;
		font-size: 28rpx;
		font-weight: normal;
		color: #232323;
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
		width: 750rpx;
		height: 112rpx;
		background-color: #ffffff;
	}

	.card_1 {
		display: flex;
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: normal;
		color: #313131;
		line-height: 112rpx;
	}

	.card_1>view {
		width: 70%;
		text-align: right;
		line-height: 116rpx;
		
	}
	img{
		width: 32rpx;
		height: 32rpx;
	}
</style>
