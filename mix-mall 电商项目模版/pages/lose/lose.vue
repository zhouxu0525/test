<template>
	<view>
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				标题
			</view>
		</view>

		<view style="height: 95rpx;"></view>

		<view class="img_1">
			<img :src="getImage('/mall-res/img1.png')">
		</view>
		<view class="text_1">没有数据/后污物车暂时没有商品</view>
		<view class="butt">
		<view class="but">
			返回
		</view>
	</view>
	</view>
</template>

<script>
	import {getImgUrl, navigateToBack} from '../../util/common.js'
		
	export default {
		data() {
			return {

			}
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
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

	.img_1 {
		width: 100%;
		margin-top: 233rpx;
		margin-left: 204rpx;
	}

	img {
		width: 325rpx;
		height: 262rpx;
	}

	.text_1 {
		width: 100%;
		padding: 78rpx 0;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: normal;
		color: #999999;
	}
	
	.butt{
		width: 100%;
	}
	.but {		
		margin: 0 auto;
		margin-top: 16rpx;
		width: 148rpx;
		height: 60rpx;
		border-radius: 30rpx;
		border: solid 1rpx #db2929;
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: normal;
		color: #db2929;
		line-height: 60rpx;
		text-align: center;
	}
</style>
