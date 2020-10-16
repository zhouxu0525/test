<template>
	<view class="container">
		<view class="header" @click="navTo('个人资料')" hover-class="cell-hover" :hover-stay-time="50">
			<view class="header_1"><img src="../../static/tab-my-current.png"></view>
			<view class="header_2">
				<view style="font-family: PingFang-SC-Medium;font-size: 28rpx;font-weight: bold;color: #313131;">起了个名字</view>
				<view style="font-family: PingFang-SC-Medium;font-size: 24rpx;font-weight: normal;color: #999999;">18754524635</view>
			</view>
			<view class="icon_1">
				<img src="../../static/箭头.png">
			</view>
		</view>

		<view class="list-cell b-b m-t" @click="navTo('/pages/address/address?source=2')" hover-class="cell-hover"
		 :hover-stay-time="50">
			<text class="cell-tit">地址管理</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('修改密码')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @click="navTo('/pages/feedback/feedback')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">问题反馈</text>
			<text class="cell-more yticon icon-you"></text>
		</view>

		<!-- <view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
		<!-- 		<view class="list-cell m-t b-b" @click="navTo('清除缓存')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="list-cell b-b" @click="navTo('关于商城')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于商城</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- 		<view class="list-cell">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0.3</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="button_1" @click="toLogout">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import {
		logoutsub
	} from '../../api/Login.js'

	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapGetters(['hasLogin']),
		},
		onLoad() {
			if (!this.hasLogin) {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
		},
		methods: {
			...mapMutations(['logout']),

			navTo(url) {
				uni.navigateTo({
					url:url
				})
			},
			//退出登录
			toLogout() {
				const that = this;
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {
						if (e.confirm) {
							logoutsub().then(res => {
								if (res.code == 200) {
									that.logout();
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/index/index"
										});
									}, 500)
								}
							})

						}
					}
				});
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? '打开' : '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.header {
		width: 750rpx;
		height: 180rpx;
		background-color: #ffffff;
		display: flex;
	}

	.header_1 {
		padding: 30rpx 29rpx;
	}

	img {
		width: 120rpx;
		height: 120rpx;
	}

	.header_2 {
		padding: 0 14rpx;
		margin-top: 58rpx;
	}

	.icon_1 {
		width: 18rpx;
		height: 26rpx;
		position: absolute;
		right: 40rpx;
		top: 72rpx;
	}

	.icon_1>img {
		width: 100%;
		height: 100%;
	}

	.button_1 {
		margin-top: 64rpx;
		margin-left: 21rpx;
		width: 690rpx;
		padding: 32rpx 0;
		border-radius: 45rpx;
		background-color: #DB2929;
		text-align: center;
		color: #FFFFFF;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60rpx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40rpx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30rpx;
		}

		&.m-t {
			margin-top: 24rpx;
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10rpx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			margin-right: 10rpx;
		}

		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
