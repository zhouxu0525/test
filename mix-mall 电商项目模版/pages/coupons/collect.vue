<template>
	<view>
		<!-- 头部 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				优惠券
			</view>
		</view>
		<view style="margin-top:95rpx;"></view>
		<view>
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" :show-bar="false" active-color="red"></u-tabs>
		</view>
		<!-- 待使用 -->
		<view v-if="current==0">

			<view class="conment_x">
				<view class="conment_1">
					<img src="../../static/coupon/logo_qun.png">
				</view>
				<view class="conment_2">
					<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
					<view class="text_2">2020.10.10-2020.12.31</view>
				</view>
				<view class="conment_3x">
					<view class="money_x">9.5折</view>
					<view class="money_1">满六百元立减</view>
					<view class="money_2" style="background-image: linear-gradient(252deg,#ff5e5e 0%,#db2929 100%);">立即领取</view>
				</view>
			</view>

			<view class="conment">
				<view class="conment_1">
					<img src="../../static/coupon/logo_qun.png">
				</view>
				<view class="conment_2">
					<view class="text_1">自营商品全品类商品券<br />折扣券</view>
					<view class="text_2">2020.10.10-2020.12.31</view>
				</view>
				<view class="conment_3">
					<view class="money">￥200</view>
					<view class="money_1">满六百元立减</view>
					<view class="money_2">去使用</view>
				</view>
			</view>

			<view class="conment">
				<view class="conment_1">
					<img src="../../static/coupon/logo_qun.png">
				</view>
				<view class="conment_2">
					<view class="text_1">自营商品全品类商品券<br />折扣券</view>
					<view class="text_2">2020.10.10-2020.12.31</view>
				</view>
				<view class="conment_3">
					<view class="money">￥200</view>
					<view class="money_1">满六百元立减</view>
					<view class="money_2">去使用</view>
				</view>
			</view>

			<view class="conment">
				<view class="conment_1">
					<img src="../../static/coupon/logo_qun.png">
				</view>
				<view class="conment_2">
					<view class="text_1">自营商品全品类商品券<br />折扣券</view>
					<view class="text_2">2020.10.10-2020.12.31</view>
				</view>
				<view class="conment_3">
					<view class="money">￥200</view>
					<view class="money_1">满六百元立减</view>
					<view class="money_2">去使用</view>
				</view>
			</view>

			<view class="conment">
				<view class="conment_2">
					<view class="text_1">自营商品全品类商品券<br />折扣券</view>
					<view class="text_2">2020.10.10-2020.12.31</view>
				</view>
				<view class="conment_3 mar">
					<view class="money">￥200</view>
					<view class="money_1">满六百元立减</view>
					<view class="money_2">去使用</view>
				</view>
			</view>
			<view class="footer">
				<view class="footer_1">查看其他优惠券></view>
			</view>
		</view>
	<!-- 已使用 -->
	<view v-if="current==1">
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_2.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_2.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_2.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_2.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x mar">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_2.png"></view>
		</view>
		
		<view class="footer">
			<view class="footer_1">查看其他优惠券></view>
		</view>
	</view>
	
	<!-- 已过期 -->
	<view v-if="current==2">
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_1.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_1.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_1.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_1">
				<img src="../../static/coupon/logo_qun.png">
			</view>
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_1.png"></view>
		</view>
		
		<view class="conment_x" style="background-image: url(../../static/coupon/card_bg_data.png);">
			<view class="conment_2">
				<view class="text_1">仅限购买苹果旗舰店部分产<br />品使用</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3x mar">
				<view class="money_x" style="color: #7c7c7c;;">9.5折</view>
				<view class="money_1x">全品类</view>
			</view>
			<view style="position: absolute;right: 215rpx; width: 98rpx; height: 87rpx;"><img src="../../static/coupon/data_1.png"></view>
		</view>
		
		<view class="footer">
			<view class="footer_1">查看其他优惠券></view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				list: [{
					name: '待使用(2)'
				}, {
					name: '已使用(4)'
				}, {
					name: '已过期(2)',
					count: 5
				}],
				current: 0

			}
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			change(index) {
				this.current = index;
			},

		}
	}
</script>

<style lang="scss">
	page {
		background: #FEFEFE;
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

	.conment {
		width: 690rpx;
		height: 224rpx;
		margin: 0 auto;
		margin-top: 25rpx;
		background-image: url(../../static/coupon/card_bg_shop.png);
		background-size: 100% 100%;
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
		background-size: 100% 100%;
		box-shadow: 0px 0px 32px 0px rgba(132, 132, 132, 0.1);
		display: flex;
		align-items: center;
	}

	.conment_1 {
		margin-left: 24rpx;
		width: 114rpx;
		height: 114rpx;
	}

	.conment_2 {
		padding: 30rpx;
	}

	.text_1 {
		width: 286rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 30rpx;
		color: #313131;
	}

	.text_2 {

		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 70rpx;
		color: #c1c1c1;
	}

	.conment_3 {
		margin-left: 48rpx;
		text-align: center;
		color: #ef6613;
	}

	.conment_3x {
		margin-left: 48rpx;
		text-align: center;
		color: #db2929;
		;
	}
	.mar{
		margin-left: 182rpx !important;
	}

	.money {
		font-family: PingFang-SC-Medium;
		font-size: 38rpx;
		font-weight: bold;
		font-stretch: normal;
		line-height: 26rpx;
	}

	.money_x {
		font-family: PingFang-SC-Medium;
		font-size: 48rpx;
		font-weight: bold;
		font-stretch: normal;
		line-height: 26rpx;
	}

	.money_1 {
		font-family: PingFang-SC-Medium;
		font-size: 20rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 73rpx;
	}
	.money_1x {
		font-family: PingFang-SC-Medium;
			font-size: 20rpx;
			font-weight: normal;
			line-height: 50rpx;
			color: #7c7c7c;
		
	}

	.money_2 {
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

	.footer {
		width: 100%;
		padding: 60rpx 0;
		
	}

	.footer_1 {
		width: 240rpx;
		height: 64rpx;
		border-radius: 32rpx;
		border: solid 1rpx #db29;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: bold;
		text-align: center;
		line-height: 64rpx;
		letter-spacing: 0rpx;
		color: #db2929;
		margin: 0 auto;
	}
	img{
		width: 100%;
		height: 100%;
	}
</style>
