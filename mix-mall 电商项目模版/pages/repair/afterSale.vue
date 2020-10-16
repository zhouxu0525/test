<template>
	<view style="width: 100%; height: 100vh;background-color: #F8F8F8;">
		<!-- 标题 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				售后
			</view>
		</view>
		<!-- 内容区 -->
		<view class="content">
			<view class="content_1">
				<img :src="getImage(productPic)" alt="">
			</view>
			<view class="content_2">
				<p>{{productName}}</p>
				<view style="display: flex;margin-top: 110rpx;font-weight:400;">
					<p style="flex: 1;">单价:￥{{realAmount}}</p>
					<p style="flex: 1;">购买单量:{{productQuantity}}</p>
				</view>
			</view>
		</view>

		<view class="card">
			<view class="debugging" style="font-size:28rpx;padding: 30rpx 0;">
				<view><img src="../../static/comment/wx.png" class="img_2"></view>
				<view class="operation_1">维修</view>
				
				<view @tap="skipMore(1)">
					<view class="operation_2">维修收到的商品</view>
					<view class="operation_3">
						<image class="img_1" src="../../static/common/jt.png" mode="widthFix"></image>
					</view>
				</view>

			</view>

			<view class="debugging" style="font-size:28rpx;padding: 30rpx 0;">
				<view><img src="../../static/comment/th.png" class="img_2"></view>
				<view class="operation_1">退货</view>
				<view @tap="skipMore(2)">
					<view class="operation_2">退回收到的商品</view>
					<view class="operation_3">
						<image class="img_1" src="../../static/common/jt.png" mode="widthFix"></image>
					</view>
				</view>
			</view>

			<view class="debugging" style="font-size:28rpx;padding: 30rpx 0;">
				<view><img src="../../static/comment/hh.png" class="img_2"></view>
				<view class="operation_1">换货</view>
				<view @tap="skipMore(4)">
					<view class="operation_2">退换收到的商品</view>
					<view class="operation_3">
						<image class="img_1" src="../../static/common/jt.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>




	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	import * as returnReq from '../../api/return.js';
	// import uniPopup from '@/components/uni-popup/uni-popup.vue'
	// import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	// import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {getImgUrl} from '../../util/common.js';


	export default {
		components: {
			empty,
			
		},
		data() {
			return {
				productName: '默认名称',
				productPic: '/202009/20200922165327_463804.jpg',
				realAmount: 20.9,
				productQuantity: 1,
				id: '',
				show: false,
				flg: false,
				radio: '-1',
				radios:[],
				reasonList: [],
				current:null,

			}
		},
		onLoad(option) {
			//获取商品得id
			this.item = JSON.parse(decodeURIComponent(option.item));
			this.productName = this.item.productName;
			this.productPic = this.item.productPic;
			this.realAmount = this.item.realAmount;
			this.productQuantity = this.item.productQuantity;
			this.id = this.item.id;
			console.info("item",this.item);
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			getImage(imgUrl) {
				//return imgUrl
				return getImgUrl(imgUrl);
			},
			skipMore(channel) {
				
				uni.navigateTo({
					url: '/pages/repair/repair?item=' + encodeURIComponent(JSON.stringify(this.item))+'&channel='+channel,
				});
				
			},
			



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

	.title {
		font-family: PingFang-SC-Medium;
		height: 100%;
		font-size: 36rpx;
		font-weight: bold;
		color: #232323;
	}

	/* 内容区 */
	.content {
		margin-top: 120rpx;
		display: flex;
		width: 100%;
		height: 25vh;
		background-color: #FFFFFF;
		padding: 0 10rpx;

	}

	.content_1 img {
		width: 240rpx;
		height: 240rpx;

	}

	.content_1 {
		width: 30%;
		padding: 0 40rpx;

	}

	.content_2 {
		width: 60%;
		margin-left: 80rpx;
		font-size: 4vw;
		font-weight: 700;

	}

	.sapn_1 {
		margin-left: 10rpx;
	}

	/* 操作 */

	.operation_1 {
		margin-left: 30rpx;
	}

	.img_2 {
		width: 27rpx;
		height: 34rpx;
	}

	.card {
		width: 100%;
		height: 26vh;
		background-color: #FFFFFF;
		margin-top: 30rpx;
		padding: 10rpx 20rpx;
	}

	.debugging {
		display: flex;
	}


	.operation_2 {
		position: absolute;
		right: 40rpx;
		color: #C0C4CC;
		font-size: 24rpx;

	}

	.operation_3 {
		position: absolute;
		right: 15rpx;


	}

	.img_1 {
		width: 18rpx;
		height: 18rpx;
	}
</style>
