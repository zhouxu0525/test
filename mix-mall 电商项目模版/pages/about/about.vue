<template>
	<view>
		<!-- 头部 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				关于商城
			</view>
		</view>

		<view style="height: 95rpx;"></view>
		<!-- 图标logo -->
		<view class="content">
			<view class="content_1">
				<view><img src="../../static/missing-face.png"></view>
				<text>xx商城</text>
			</view>
		</view>
		<!-- 内容区 -->
		<view class="content_2">欢迎使用XX商城,这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍</view>
		<view class="content_2" style="margin-top: 40rpx;">欢迎使用XX商城,这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍这里是关于商城的文字介绍</view>
		<view class="content_3">公司名字</view>
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

	.content {
		width: 100%;
		margin-top: 122rpx;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: bold;
		color: #313131;
	}

	.content img {
		width: 130rpx;
		height: 129rpx;
	}

	.content_1 {
		width: 130rpx;
		margin: 0 auto;
	}

	.content_2 {
		width: 631rpx;
		height: 148rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 48rpx;
		letter-spacing: 0rpx;
		color: #313131;
		margin: 0 auto;
		margin-top: 82rpx;
	}

	.content_3 {
		width: 100%;
		height: 22rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 43rpx;
		color: #999999;
		text-align: center;
		margin-top: 336rpx;
		
	}
</style>
