<template>
	<view>
		<!-- 小程序头部兼容 -->
		<view class="searchTop" :style="{'background': titleBarBg}">
			<!-- #ifndef H5 -->
			<view class="title_bar u-skeleton-fillet" ref="header" >
				<view class="MD" style="width: 100%;">
					<image src="@/static/shop/icon_seach_gray.png" mode="" />
					<input type="text" placeholder="店铺内搜索" disabled @click="searchData" />
				</view>
				<view class="right-img">
					<image src="@/static/shop/news_white.png" v-if="back" mode="" />
					<image src="@/static/shop/news_black.png" v-else mode="" />
					<!-- <u-badge type="error" class="badge" is-center="true" count="7"></u-badge> -->
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="title_bar u-skeleton-fillet" ref="header" >
				<image src="@/static/shop/back_white.png" @click="toBack" v-if="back" mode="" class="black"></image>
				<image src="@/static/shop/back_black.png" @click="toBack" v-else mode="" class="black"></image>
				<view class="MD">
					<image src="@/static/shop/icon_seach_gray.png" mode="" />
					<input type="text" placeholder="店铺内搜索" disabled @click="searchData" />
				</view>
				<view class="right-img" >
					<image src="@/static/shop/news_white.png" v-if="back" mode="" />
					<image src="@/static/shop/news_black.png" v-else mode="" />
					<!-- <u-badge type="error" class="badge" is-center="true" count="7"></u-badge> -->
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="content">
			<view class="content-header">
				<view class="banner">
					<image v-if="shopBackground == ''" :src="getImage('/mall-res/store_top_bg_img.png')" mode=""></image>
					<image v-else :src="shopBackground" mode=""></image>
				</view>
			</view>
			<view class="shop-box">
				<image :src="getImage(shopInfo.shopLogo)" class="shop-logo"></image>
				<view class="shop-news">
					<view class="shop-news-name">{{shopInfo.shopName}}</view>
					<view class="shop-news-sub">{{shopInfo.followNumber || 0}}人 关注 </view>
				</view>
				<view class="shop-btn" @click="followShop" v-if="!followFlag">
					关注
				</view>
				<view class="shop-btn" @click="cancelFollowShop" v-else>
					已关注
				</view>
			</view>
		</view>	
	</view>	
</template>

<script>
	import {getImgUrl, navigateToBack} from '../../../util/common.js'
	import * as shopReq from '../../../api/Shop.js'
	import {mapGetters} from 'vuex';
	export default {
		data() {
			return {
				followFlag: false,  //是否已关注
				data:'',
				shopBackground: '',
				keyword: '',
				back:true,
				titleBarBg: '',
				navbarTop: '44px',
				titleBarH: '44px',
			}
		},
		props: {
			"shopInfo": {}
		},
		computed: {
			...mapGetters(['hasLogin'])
		},
		async mounted() {
			let that = this;
			//店铺背景图
			await shopReq.getShopBackground(that.shopInfo.shopNum).then(res => {
				if(res.code == 200) {
					that.shopBackground = getImgUrl(res.data.imageUrl);
				}
			})
			//是否已关注
			that.ifShopFollow()
		},
		methods: {
			pageScroll(scrollTop){
				if(scrollTop >= 100 && scrollTop <= 200){
					this.titleBarBg = `rgba(255,255,255,${(scrollTop)/200})`
					this.back = false
				}else if(scrollTop >= 200){
					this.titleBarBg = `rgba(255,255,255,${1})`
					this.back = false
				}else{
					this.titleBarBg = `rgba(255,255,255,${0})`
					this.back = true
				}
			},
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			checkLoginTo() {
				if(!this.hasLogin) {
					//跳转至登录页
					var tourl = encodeURI(this.shopInfo.url + this.shopInfo.data);
					uni.navigateTo({
					    url: '/pages/public/login?to=' + tourl
					});
				}
				return this.hasLogin;
			},
			//查询是否已关注店铺
			ifShopFollow() {
				if(!this.hasLogin) {
					return;
				}
				shopReq.ifShopFollow({"shopNum": this.shopInfo.shopNum}).then(res => {
					if(res.code == 200) {
						this.followFlag = res.data
					} 
				})
			},
			//关注店铺
			followShop() {
				//判断是否已登录
				if(!this.checkLoginTo()) {
					return;
				}
				shopReq.addShopFollow({"shopNum": this.shopInfo.shopNum}).then(res => {
					if(res.code == 200) {
						this.followFlag = true
						this.shopInfo.followNumber = this.shopInfo.followNumber + 1;
					} else {
						this.$api.msg("抱歉！关注店铺失败了");
					}
				})
			},
			//取消关注店铺
			cancelFollowShop() {
				shopReq.cancelShopFollow({"shopNum": this.shopInfo.shopNum}).then(res => {
					if(res.code == 200) {
						this.followFlag = false
						this.shopInfo.followNumber = this.shopInfo.followNumber - 1;
					} else {
						this.$api.msg("抱歉！取消店铺关注失败了");
					}
				})
			},
			toBack() {
				navigateToBack();
			},
			//跳转至搜索页
			searchData() {
				let shopNum = this.shopInfo.shopNum;
				uni.navigateTo({
					url: `/pages/product/list?shopNum=${shopNum}`
				})
			},
			// #ifndef MP
			// 标题栏input搜索框点击
			onNavigationBarSearchInputClicked: async function(e) {
				this.searchData();
			},
			// #endif
		}
	}
</script>

<style lang="scss">
	.status_bar {
	    height: var(--status-bar-height);  
	    width: 100%;  
	    z-index: 999;  
	}
	.searchTop{
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30rpx;
		z-index: 9999;
		width: 100%;
		padding: 0 80rpx;
	
		.ser-input {
			flex: 1;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			font-size: 28rpx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}
	
	page {
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20rpx;
		}
	
		.carousel-section {
			padding: 0;
	
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
	
			.carousel {
				.carousel-item {
					padding: 0;
				}
			}
	
			.swiper-dots {
				left: 45rpx;
				bottom: 40rpx;
			}
		}
	}
	
	.title_bar {
		font-family: PingFang-SC-Medium;
		width: 100%;
		height: 44px;
		// box-shadow: 0rpx 3rpx 20rpx 0rpx rgba(153, 153, 153, 0.12);
		display: flex;
		align-items: center;
	
		.black {
			width: 20rpx;
			height: 34rpx;
			margin-left: 30rpx;
		}
	
		// #ifndef MP
		.MD {
			width: 554rpx;
		}
		// #endif
		// #ifdef MP
		.MD {
			width: 400rpx;
		}
		// #endif
		.MD {
			height: 64rpx;
			background-color: #eee;
			border-radius: 32rpx;
			margin: 0 29rpx 0 45rpx;
			display: flex;
			justify-content: center;
			align-items: center;
	
			input {
				width: 100%;
				height: 64rpx;
				// border-radius: 32rpx;
			}
	
			image {
				width: 30rpx;
				height: 30rpx;
				margin: 0 16rpx 0 30rpx;
			}
		}
	
		.right-img {
			width: 41rpx;
			height: 38rpx;
			position: relative;
			margin-right: 31rpx;
	
			image {
				width: 41rpx;
				height: 38rpx;
			}
		}
	}
	
	
	.content {
		position: relative;
		.content-header {
			.banner {
				image {
					width: 750rpx;
					height: 326rpx;
					vertical-align: bottom;
				}
			}
		}
	}
	
	.shop-box {
		width: 690rpx;
		height: 72rpx;
		position: absolute;
		top: 135rpx;
		padding: 0 30rpx;
		display: flex;
	}
	.shop-news {
		flex: 1;
		color: #fff;
	}
	.shop-news-name {
		font-size: 32rpx;
	}
	.shop-news-sub {
		font-size: 24rpx;
	}
	.shop-btn {
		width: 128rpx;
		height: 48rpx;
		background: rgba(0, 0, 0, .61);
		border-radius: 24rpx;
		border: solid 1rpx #ffffff;
		margin: 9rpx 0 15rpx 0;
		font-size: 28rpx;
		color: #ffffff;
		text-align: center;
		line-height: 48rpx;
	}
	.shop-logo {
		width: 82rpx;
		height: 82rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}
	
	
</style>
