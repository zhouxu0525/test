<template>
	<view class="content b-t">
		<!-- #ifdef H5 -->
		<view class="title_bar" ref="header">
			<image src="@/static/shop/back_black.png"  mode="" @click="Back" class="black"></image>
			<view class="MD">
				收货地址
			</view>
			<view class="right-img" @click="addAddress('add')">
				添加新地址
			</view>
		</view>
		<!-- 标题栏和状态栏占位符 -->
		<view class="titleNview-placing"></view>
		<!-- #endif -->
		<view class="content_box">
			<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
				<view class="wrapper">
					<view class="address-box">
						<text class="name">{{item.name}}</text>
						<text class="mobile">{{item.phoneNumber}}</text>
					</view>
					<view class="u-box">
						<text v-if="item.defaultStatus" class="tag">默认</text>
						<text class="address">{{item.province|addressInfo}}{{item.city|addressInfo}}{{item.region|addressInfo}}{{item.street|addressInfo}}{{item.detailAddress}}</text>
					</view>
				</view>
				<view class="line" />
				<text class="edit" @click.stop="addAddress('edit', item)">编辑</text>
			</view>
			<view style="width: 100%; height: 100%; text-align: center; padding-top: 250rpx;" v-if="addressList.length == 0">
				<u-empty text="您还没有收货地址, 添加一个呗" mode="address" ></u-empty>
			</view>
			<!-- #ifndef H5 -->
			<view class="complete" @click="addAddress('add')">
				添加收货地址
			</view>
			<!-- #endif -->
			<text style="display:block;padding: 16upx 30upx 10rpx;lihe-height: 1.6;color: #fa436a;font-size: 24rpx;">
				
			</text>
		</view>
	</view>
</template>

<script>
	import {getAddressList,addAddressInfo} from '../../api/Address';
	import {navigateToBack} from '../../util/common.js'
	
	export default {
		data() {
			return {
				source: 0,
				addressList: []
			}
		},
		onLoad(option) { 
			//获取收货地址
			this.loadData();
			this.source = option.source;
		},
		filters: {
			addressInfo(skuinfo) {
			 if(typeof  skuinfo==='undefined'){
			 	return " "
			 }else{
				return   " "+skuinfo;
			 }
			}
		},
		methods: {
			//获取收货地址列表
			loadData() {
				getAddressList().then(res => {
					if (res.code == 200) { 
						this.addressList = res.data 
					}
				});
			},
			Back(){
				navigateToBack()
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120rpx;
		background: #f8f8f8;
		font-family: PingFang-SC-Med
	}

	.content {
		position: relative;
	}

	/* #ifdef H5 */
	.title_bar {
		font-family: PingFang-SC-Medium;
		width: 100%;
		height: 44px;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		.black {
			width: 20rpx;
			height: 34rpx;
			margin-left: 30rpx;
		}

		.MD {
			margin-left: 250rpx;
			width: 144rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #232323;
		}

		.right-img {
			position: relative;
			margin-left: 129rpx;
			width: 141rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #232323;
		}
	}
	.titleNview-placing {
		height: var(--status-bar-height);
		padding-top: 44px;
		box-sizing: content-box;
	}
	/* #endif */
	.content_box {
		margin-top: 22rpx;

		.list {
			display: flex;
			align-items: center;
			padding: 20rpx 30rpx;
			background: #fff;
			position: relative;
		}

		.wrapper {
			display: flex;
			flex-direction: column;
			flex: 1;
		}

		.line {
			width: 2rpx;
			height: 40rpx;
			background-color: #eeeeee;
		}

		.address-box {
			display: flex;
			align-items: center;

			.name {
				font-size: 32rpx;
				color: #313131;
			}

			.mobile {
				font-size: 24rpx;
				color: #999999;
				margin-left: 16rpx;
			}
		}

		.u-box {
			margin-top: 19rpx;

			.address {
				font-size: 26rpx;
				color: #313131;
			}

			.tag {
				font-size: 22rpx;
				color: #db2929;
				margin-right: 10rpx;
				padding: 6rpx 15rpx;
				background-color: #ffe8e8;
				border-radius: 6rpx;
				line-height: 1;
			}
		}

		.edit {
			font-size: 24rpx;
			color: #999999;
			margin-left: 19rpx;
		}
	}
	.complete{
		width: 90%;
		height:90rpx;
		line-height: 90rpx;
		background-color: #db2929;
		border-radius: 45rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: bold;
		margin: 50rpx auto;
	}
</style>
