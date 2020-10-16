<template>
	<view style="width: 100%; height: 100vh;background-color: #F8F8F8;">
		<!-- 标题 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				提交成功
			</view>
		</view>
		<view style="width: 100%; height: 95rpx;"> </view>
		<!-- 内容 -->
		<view class="operation">
			<view class="Icon">
				<img class="icon-img" src="../../static/comment/iocn_success.png">
			</view>
			<view class="Icon_1">
				售后服务申请提交成功
				<view class="Icon_content">请保持手机畅通，耐心等待</view>
			</view>
			<view style="display: inline-block;" @tap="goToIndex">
				<view class="Press">随便逛逛</view>
			</view>
			<view style="display: inline-block;" @tap="goToReturn">
				<view class="Press_1">售后主页</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="footer_1" style="display: flex;">
				服务类型：<view style="color: #000000; font-weight: normal;">{{channel|channelType}}</view>
			</view>
			<view class="footer_1" style="display: flex;">
				返件方式：<view style="color: #000000; font-weight: normal;">快递至商家</view>
			</view>


		</view>
		<view class="footer" v-if=channelSpan()>
			<view class="footer_1" style="display: flex;">
				售后申请人：<view style="color: #000000; font-weight: normal;">{{returnName}}</view>
			</view>
			<view class="footer_1" style="display: flex;">
				申请人电话：<view style="color: #000000; font-weight: normal;">{{returnPhone}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components: {
			empty,
		},
		data() {
			return {
				returnPhone: '',
				channel: '',
				returnName: '',
			}
		},
		onLoad(option) {
			this.returnPhone = option.returnPhone;
			this.channel = option.channel;
			this.returnName = option.returnName;

		},
		filters: {
			channelType(item) {
				if (item == 1) return '维修';
				if (item == 2) return '退货';
				if (item == 4) return '换货';
			},
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			goToIndex(item) {
				uni.switchTab({
					url: '/pages/index/index',

				});
			},
			goToReturn(item) {
				uni.navigateTo({
					url: '/pages/order/order?state=sh',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});

			},
			channelSpan() {
				console.log('11111' + this.channel);
				if (this.channel != 2) {
					return true;
				} else {
					return false;
				};

			},

		},
	}
</script>

<style lang="scss">
	/* 标题 */
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

	/* 标题结束 */
	.operation {
		width: 750rpx;
		height: 482rpx;
		background-color: #FFFFFF;
		padding-top: 82rpx;
	}

	.Icon {
		width: 108rpx;
		height: 108rpx;
		margin: 0 auto;

		.icon-img {
			width: 100%;
			vertical-align: top;
		}
	}


	.Icon_1 {
		margin-top: 20rpx;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-size: 36rpx;
		font-weight: bold;
		color: #232323;

		.Icon_content {
			margin-top: 26rpx;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			color: #313131;
		}
	}

	.Press {
		text-align: center;
		width: 241rpx;
		height: 64rpx;
		border-radius: 32rpx;
		border: solid 1rpx #db2929;
		background-color: #FFFFFF;
		margin-top: 93rpx;
		margin-left: 100rpx;

		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: bold;
		font-stretch: normal;
		line-height: 48rpx;
		letter-spacing: 0rpx;
		color: #db2929;
		line-height: 64rpx;
	}

	.Press_1 {
		text-align: center;
		width: 241rpx;
		height: 64rpx;
		border-radius: 32rpx;
		border: solid 1rpx #db2929;
		background-color: #FFFFFF;
		margin-top: 93rpx;
		margin-left: 64rpx;


		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: bold;
		font-stretch: normal;
		line-height: 48rpx;
		letter-spacing: 0rpx;
		color: #db2929;
		line-height: 64rpx;

	}

	.footer {
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 36rpx;
		letter-spacing: 0rpx;
		color: #999999;
		margin-top: 88rpx;
		margin-left: 31rpx;
	}

	.footer_1 {
		margin-top: 28rpx;

	}
</style>
