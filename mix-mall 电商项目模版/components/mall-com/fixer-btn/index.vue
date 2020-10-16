<!-- 定位按钮 -->
<template>
	<view class="fixer-btn">
		<view class="img-wrap">
			<image class="btn-img" src="@/static/index/shop_car.png" mode="widthFix"></image>
			<view class="amount">{{shopcardAmount}}</view>
		</view>
		<view class="img-wrap ">
			<image class="btn-img" src="@/static/index/mine.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import {getImgUrl} from '@/util/common.js'
	
	export default {
		name: 'FixerBtnBox',
	    props: {
	    },
	    data() {
	        return {
				
	        }
	    },
	    watch: {
	    },
	    methods: {
			
	    },
	}
</script>

<style scoped lang="scss">
	// 定位按钮
	.fixer-btn {
		position: fixed;
		top: 920rpx;
		right:0;
		padding-right:25rpx;
		z-index: 5;
		.img-wrap {
			position: relative;
			z-index:6;
			&:last-child {
				margin-top: 25rpx;
			}
		}
		.amount {
			position: absolute;
			top: -8rpx;
			right: -9rpx;
			padding: 0 9rpx;
			height: 27rpx;
			background-color: #f11f22;
			border-radius: 12rpx;
			z-index: 7;
			font-family: PingFang-SC-Medium;
			font-size: 20rpx;
			line-height: 27rpx;
			color: #ffffff;
		}
		.btn-img {
			width: 80rpx;
			height: 80rpx;
			vertical-align: top;
		}
	}
</style>
