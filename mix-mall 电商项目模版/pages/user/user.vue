<template>
	<view class="container">
		<!--  header -->
		<view class="user-section">
			<image class="bg" :src="getImage('/mall-res/user-bg.png')"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userDetail.pic || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text class="username" v-if="hasLogin">{{userDetail.nickname}}</text>
					<text class="username" v-else @click="tologin">点我登录</text>
				</view>
			</view>
			<view class="tj-sction">
				<view class="tj-item">
					<text class="num">128.8</text>
					<text>余额</text>
				</view>
				<view class="tj-item">
					<text class="num">0</text>
					<text>优惠券</text>
				</view>
				<view class="tj-item">
					<text class="num">20</text>
					<text>积分</text>
				</view>
			</view>
			<view class="vip-card-box">
				<image :src="getImage('/mall-res/vip.png')" mode=""></image>
			</view>
		</view>
		<!-- order -->
		<view class="cover-container">
			<view class="order-title">
				<text  @click="navTo('/pages/order/order')">我的订单</text>
				<text  @click="navTo('/pages/order/order')">全部订单></text>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=all')" hover-class="common-hover" :hover-stay-time="50">
					<view class="img-box">
						<image src="../../static/order.png" mode=""></image>
						<u-badge type="error" :is-center="true" :count="orderCount.allOrder"></u-badge>
					</view>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=dfk')" hover-class="common-hover" :hover-stay-time="50">
					<view class="img-box">
						<image src="../../static/dfk.png" mode=""></image>
						<u-badge type="error" :is-center="true" :count="orderCount.noPayment"></u-badge>
					</view>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=dsh')" hover-class="common-hover" :hover-stay-time="50">
					<view class="img-box">
						<image src="../../static/dsh.png" mode=""></image>
						<u-badge type="error" :is-center="true" :count="orderCount.noReceiveGood"></u-badge>
					</view>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=sh')" hover-class="common-hover" :hover-stay-time="50">
					<view class="img-box">
						<image src="../../static/tksh.png" mode=""></image>
						<u-badge type="error" :is-center="true" count=""></u-badge>
					</view>
					<text>退款/售后</text>
				</view>
			</view>
		</view>
		<!-- banner -->
		<view class="banner" v-if="advertImg.img">
			<a :href="advertImg.url">
				<image :src="advertImg.img" />	
			</a>
		</view>
		<!-- 工具箱 -->
		<view class="tools">
			<view class="tools-title">
				<text>工具箱</text>
			</view>
			<view class="tools-section">
				<view class="tools-item" v-for="(item,i) in toolsList" :key="i" @click="navTo(item.url)"
				 hover-class="common-hover" :hover-stay-time="50">
					<view class="img-box">
						<image :src="item.src" mode=""></image>
					</view>
					<text>{{item.name}}</text>
				</view>
				<view style="width: 140rpx;" />
				<view style="width: 140rpx;" />
				<view style="width: 140rpx;" />
			</view>
		</view>
	</view>
</template>
<script>
	import { getUserInfo,getOrderCount,getContentImg} from '../../api/User';
	import listCell from '@/components/mix-list-cell';
	import {mapMutations, mapGetters} from 'vuex'
	import {getImgUrl} from '../../util/common.js'
	
	export default {
		components: {
			listCell
		},
		data() {
			return {
				orderCount:{
					//全部订单
					allOrder:0,
					//待付款
					noPayment:0, 
					//待收货
					noReceiveGood:0,
					//退货/售后
					returnGoods:0
				},
				//轮播图
				advertImg:{
					url:'',
					img:''
				},
				moving: false,
				toolsList: [
					{
						src: "../../static/order.png",
						name: "我的订单",
						url: "/pages/order/order?state=all"
					},
					/* {
						src: "../../static/user/llls.png",
						name: "浏览历史",
						url: ""
					}, */ 
					{
						src: "../../static/user/dz.png",
						name: "地址管理",
						url: "/pages/address/address?source=2"
					}, 
					{
						src: "../../static/user/collectsStore.png",
						name: "关注店铺",
						url: "/pages/user/collectStore"
					},
					/*
					{
						src: "../../static/user/qb.png",
						name: "我的钱包 ",
						url: ""
					}, {
						src: "../../static/user/fx.png",
						name: "分享",
						url: ""
					},
					 {
						src: "../../static/user/sd.png",
						name: "晒单",
						url: ""
					}, 
					*/
					{
						src: "../../static/user/sc.png",
						name: "我的收藏",
						url: "/pages/user/userCollect"
					}, 
					 {
						src: "../../static/user/sz.png",
						name: "设置",
						url: "/pages/set/set"
					}, 
				]
			}
		},
		onLoad() {
			if(this.hasLogin) {
				this.getUserData()
			}
			this.getAd();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
		computed: { 
			...mapGetters(['hasLogin', 'userInfo']),
			userDetail() {
				if(typeof(this.userInfo.id) == 'undefined' && this.hasLogin) {
					getUserInfo().then(res => {
						if (res.code == 200) {
							this.userInfoState(res.data);
						}
					});
				}
				return this.userInfo;
			}
		},
		methods: {
			...mapMutations(['userInfoState']),
			getImage(img) {
				return getImgUrl(img);
			},
			getUserData() {
				//获取订单数量 
				getOrderCount().then(res => {
					if(res.code==200){
						//待付款
						let orderCountList=res.data;
						for(var i=0;i<orderCountList.length;i++){
							var status=orderCountList[i].status;
							if(status==0){
								this.orderCount.noPayment=orderCountList[i].statusCount;
							}
							if(status==1){
								this.orderCount.noReceiveGood=orderCountList[i].statusCount;
							}  
							if(status==-1){
								this.orderCount.allOrder=orderCountList[i].statusCount;
							}
						}  
					}
				});
			},
			getAd() {
				//获取广告资源
				getContentImg().then(res => {
					if(res.code==200){
						let advertiseList=res.data;
						if(advertiseList!=null){
							let type=advertiseList[0].type;
							if(type==3){
								this.advertImg.url=advertiseList[0].url;
								this.advertImg.img=advertiseList[0].pic;
							} 
						} 
						
					}
				});
			},
			tologin() {
				this.navTo('/pages/user/user')
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login?to=/pages/user/user';
				}
				uni.navigateTo({
					url
				})
			},
		}
	}
</script>
<style lang='scss'>
	page {
		background: #f8f8f8;
		font-family: PingFang-SC-Medium;
		padding-bottom: 164rpx;
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
	}

	.user-section {
		height: 450rpx;
		padding: 100rpx 30rpx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 450rpx;
			filter: blur(1px);
			opacity: .7;
		}
	}

	.user-info-box {
		height: 100rpx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 100rpx;
			height: 100rpx;
			border: 5upx solid #fff;
			border-radius: 50%;
		}

		.username {
			font-size: 36rpx;
			color: #313131;
			margin-left: 20rpx;
		}
	}

	.vip-card-box {
		position: absolute;
		bottom: 0;
		width: 690rpx;
		height: 88rpx;

		image {
			width: 100%;
			height: 88rpx;
		}
	}

	.tj-sction {
		@extend %section;
		position: absolute;
		width: 690rpx;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 160rpx;
			font-size: 24rpx;
			color: #313131;
		}

		.num {
			font-size: 36rpx;
			color: #313131;
			margin-bottom: 13rpx;
		}
	}

	.cover-container {
		width: 695rpx;
		height: 236rpx;
		margin: 63rpx 30rpx 32rpx;

		.order-title {
			height: 66rpx;
			display: flex;
			justify-content: space-between;

			text {
				&:first-child {
					font-size: 36rpx;
					color: #000000;
				}

				&:last-child {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}
	}

	.order-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 690rpx;
		height: 170rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		background-color: #fff;

		.order-item {
			@extend %flex-center;
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			font-size: 24rpx;
			color: #313131;

			.img-box {
				height: 44rpx;
				width: 44rpx;
				position: relative;
				margin-bottom: 21rpx;
			}

			image {
				height: 44rpx;
				width: 44rpx;

			}
		}

		.yticon {
			font-size: 48rpx;
			margin-bottom: 18rpx;
			color: #fa436a;
		}

		.icon-shouhoutuikuan {
			font-size: 44rpx;
		}
	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 10rpx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40rpx;
			margin-left: 30rpx;

			.yticon {
				font-size: 44rpx;
				color: #5eba8f;
				margin-right: 16rpx;
				line-height: 40rpx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
				border-radius: 10rpx;
			}
		}
	}

	.banner {
		width: 690rpx;
		height: 134rpx;
		border-radius: 10rpx;
		margin: 0 auto;

		image {
			width: 690rpx;
			height: 134rpx;
		}
	}

	.tools {
		margin: 64rpx auto 0;
		width: 690rpx;
		height: 377rpx;

		.tools-title {
			font-size: 36rpx;
			color: #313131;
			font-weight: bold;
			height: 67rpx;
		}

		.tools-section {
			width: 690rpx;
			height: 310rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			align-content: space-around;

			.tools-item {
				@extend %flex-center;
				width: 140rpx;
				height: 120rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-bottom: 15rpx;
				}

				text {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}
	}
</style>
