<template>

	<view style="width: 100%; height:140vh;background-color: #F8F8F8;">
		<!-- 标题 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="../../static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view style="width: 70%; margin: 0 auto;">
				<u-search placeholder="搜索我的订单" v-model="keyword" :show-action="false"></u-search>
			</view>
		</view>
		<view style="height: 95rpx;"></view>
		<!-- 内容 -->
		<view class="examine">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<view v-if="current==0">选中第一个页面</view>
			<view v-if="current==1">选中第二个页面</view>
			<view v-if="current==2">选中第三个页面</view>
			<view v-if="current==3">选中第四个页面</view>
			<view v-if="current==4">
				<view class="carp">
					<view class="carp_1">
						<view class="operation_1">维修收到的商品</view>
						<view class="operation_2">维修</view>
						<view>
							<img src="../../static/comment/wx.png" class="img_2">
						</view>
					</view>
					<view style="width: 100%; padding: 0 30rpx;margin-top: 33rpx;display: flex;">
					<view>
						<!-- <img src="../../static/index/newCommodity/new1.png" class="img_1"> -->
					</view>
					<view style="margin-left: 24rpx; font-size: 28rpx;font-weight: bold;">
						<text>JORDAN JUMPMAN LOGO正品 Nike App 超级福利...</text>
						<view class="number">申请数量:1</view>
					</view>
				</view>
				<view class="block">
					<text style="font-weight: 700;margin-left: 26rpx;">待审核</text>
					<text style="color: #C0C4CC; margin-left: 30rpx;">您的售后已申请成功，售后审核中</text>
				</view>
				<view style="display: flex; margin-top: 22rpx;">
					<view class="button" style="position: absolute;right: 188rpx;">取消申请</view>
					<view class="button" style="position: absolute;right: 20rpx;">修改申请</view>
				</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				list: [{
					name: '全部	'
				}, {
					name: '待付款'
				}, {
					name: '待收货'
				},{
					name: '评价'
				}, {
					name: '售后'
				}],
				
				current:0
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

<style>
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
	.carp{
		width: 750rpx;
		height: 452rpx;
		background-color: #ffffff;
		margin-top: 20rpx;
		
	}
	.carp_1{
		display: flex;
		padding: 20rpx 0;
		
	}
	.operation_1{
		margin-left: 30rpx;
		color:#C0C4CC;
		font-size: 24rpx;
	
	}
	.img_2{
		position: absolute;
		right: 30rpx;
		width: 27rpx;
		height: 34rpx;
		}
	  .operation_2 {
		position: absolute;
		right: 60rpx;
		font-size: 28rpx;
			
		
		}
	.img_1{
		width: 148rpx;
		height: 148rpx;
	}
	.number{
		margin-top: 40rpx;
		font-size: 20rpx;
		
	}
	.block{
		width: 690rpx;
		height: 80rpx;
		background-color: #fdfae5;
		border-radius: 10rpx;
		margin: 0 auto;
		margin-top:32rpx;
		font-size: 24rpx;
		line-height: 80rpx;
	}
	.button{
		   font-size: 24rpx;
		   text-align: center;
		   line-height:48rpx ;
		   width: 148rpx;
			height: 48rpx;
			border-radius: 24rpx;
			border: solid 1rpx #999999;
			
	}
</style>
