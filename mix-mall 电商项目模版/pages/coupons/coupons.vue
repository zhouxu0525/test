<template>
	<view>
		<!-- 头部 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				领券中心
			</view>
		</view>
		<view style="margin-top:95rpx;">
	</view>

	<!-- 轮播图 -->
	<view class="wrap">
		<u-swiper :list="list" :effect3d="true"></u-swiper>
	</view>
	<!-- 轮播结束 -->
	<!-- 标签页 -->
	<view>
		<u-tabs :list="tabs" :is-scroll="true" :current="current" @change="change" :show-bar="false" active-color="red"></u-tabs>
	</view>

	<!-- 内容区 -->
	<view v-if="current==0">
		<view class="conment">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br/>品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3">
				<view class="money">￥200</view>
				<view class="money_1">满六百元立减</view>
				<view class="money_2">立即领取</view>
			</view>
		</view>
		
		<view class="conment">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br/>品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3">
				<view class="money">￥200</view>
				<view class="money_1">满六百元立减</view>
				<view class="money_2">立即领取</view>
			</view>
		</view>
		
		<view class="conment">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br/>品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3">
				<view class="money">￥200</view>
				<view class="money_1">满六百元立减</view>
				<view class="money_2">立即领取</view>
			</view>
		</view>
		
		<view class="conment_x">
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br/>品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x">9.5折</view>
				<view class="money_1">满六百元立减</view>
				<view class="money_2" style="background-image: linear-gradient(252deg,#ff5e5e 0%,#db2929 100%);">立即领取</view>
			</view>
		</view>
		
		<view class="footer">没有更多了</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图	
				list: [{
						image: '../../static/coupon/lietu.png',
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
					}
				],
				// 标签页
				tabs: [{
						name: '为你推荐'
					}, {
						name: '家用百货'
					}, {
						name: '生活服务',
					},
					{
						name: '家用电器'
					},
					{
						name: '食品饮料'
					},
					{
						name: '待付款',
						count: 5
					},
				],
				current: 0
			}
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},

			change(index) {
				this.current = index;
			}
		},


	}
</script>

<style lang="scss" scoped>
	page {
		background: #FEFEFE;
	}

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

	.wrap {
		padding: 40rpx;
	}

	/deep/.uni-swiper-slides {
		box-shadow: 0px 0px 20px 0px rgba(132, 132, 132, 0.2);
		border-radius: 16px;
	}

	.conment {
		width: 690rpx;
		height: 224rpx;	
		margin: 0 auto;
		margin-top: 25rpx;
		background-image: url(../../static/coupon/card_bg_shop.png);
		background-size:100% 100%	;
		box-shadow: 0px 0px 32px 0px rgba(132, 132, 132, 0.1);
		display: flex;
		align-items: center;
	}
	.conment_x {
		width: 690rpx;
		height: 224rpx;	
		margin: 0 auto;
		margin-top: 25rpx;
		background-image: url(../../static/coupon/card_bg_platform.png);
		background-size:100% 100%	;
		box-shadow: 0px 0px 32px 0px rgba(132, 132, 132, 0.1);
		display: flex;
		align-items: center;
	}
	.conment_1{
		margin-left: 24rpx;
		width: 114rpx;
		height: 114rpx;
	}
	.conment_1>img{
		width: 100%;
		height: 100%;
	}
	.conment_2{
		padding: 30rpx;
	}
	.text_1{
		width: 286rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 30rpx;
		color: #313131;
	}
	.text_2{
		
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;	
		line-height: 70rpx;	
		color: #c1c1c1;
	}
	.conment_3{
		margin-left: 48rpx;
		text-align: center;
		color: #ef6613;
	}
	.conment_3x{
		margin-left: 48rpx;
		text-align: center;
		color: #db2929; ;
	}
	.money{
		font-family: PingFang-SC-Medium;
			font-size: 38rpx;
			font-weight: bold;
			font-stretch: normal;
			line-height: 26rpx;
	}
	.money_x{
		font-family: PingFang-SC-Medium;
			font-size: 48rpx;
			font-weight: bold;
			font-stretch: normal;
			line-height: 26rpx;
	}
	.money_1{
		font-family: PingFang-SC-Medium;
			font-size: 20rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 73rpx;
	}
	.money_2{
		idth: 140rpx;
			height: 50rpx;
			background-image: linear-gradient(252deg, 
			#ff9d3d 0%, 
			#ef6613 100%);
			border-radius: 25rpx;
			font-family: PingFang-SC-Medium;
			font-size: 22rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 48rpx;
			letter-spacing: 0rpx;
			color: #ffffff;
	}
	.footer{
		width: 100%;
			height: 22rpx;
			padding: 60rpx 0;
			text-align: center;
			font-family: NotoSansHans-Regular;
			font-size: 24rpx;
			font-weight: bold;
			letter-spacing: 0rpx;
			color: #bbbbbb;
	}
</style>
