<template>
	<view class="u-skeleton" >
		<view class="shop-tab u-skeleton-fillet" :class="{activeAbsolute:!back}">
			<view class="active">
				推荐
			</view>
			<view class="" @click="to_allGoods">
				全部商品
			</view>
		</view>
		
		<view class="swiper u-skeleton-fillet">
			<u-swiper :list="lunbolist" @click="to_goodsModuel" img-mode="scaleToFill" :height="375"></u-swiper>
		</view>
		<!-- 新增优惠 -->
		<view style="display: flex; justify-content: space-between; margin-top: 20rpx; ">
			<view class="a-t">优惠券专区</view>
			<view class="a-t1">更多<img src="../../../static/adress/jt.png"></view>
		</view>
		<view class="conment">
			<view class="conment_2">
				<view class="text_1">仅限购买本店XXXXXX部分产品使用满减券</view>
				<view class="text_2">2020.10.10-2020.12.31</view>
			</view>
			<view class="conment_3">
				<view class="money">￥200</view>
				<view class="money_1">满6000元立减</view>
				<view class="money_2">立即领取</view>
			</view>
		</view>
		
		<view class="Hot">
			<text class="u-skeleton-fillet">本店热销</text>
			<view class="hot-box">
				<view class="hot-goods u-skeleton-fillet" v-for="(item,i) in hotList"  @click="navToDetailPage(item)" :key="i">
					<view class="hot-goods-img">
						<image :src="getImage(item.pic)"></image>
					</view>
					<view class="hot-goods-tips">
						<view>{{item.name}}</view>
						<view>{{item.price}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="love">
			<view class="love-top u-skeleton-fillet">
				<text>猜你喜欢</text>
				<!-- <text>查看更多></text> -->
			</view>
			<view class="love-box u-skeleton-fillet">
				<view v-for="(item,i) in loveGoodsList" class="love-goods" :key="i" @click="navToDetailPage(item)">
					<view class="love-goods-img">
						<image :src="getImage(item.pic)"></image>
					</view>
					<view class="love-goods-tips">
						<view>{{item.name}}</view>
						<view>
							<text>¥{{item.price}}</text>
							<text>¥{{item.originalPrice}}</text>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<!-- 骨架屏 加载动画 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {shoplunbolist_, shophostlist_} from '@/util/skeletonJson.js'
	import {getShopRecommendProductList} from '../../../api/Product.js'
	import * as shopReq from '../../../api/Shop.js'
	import {getShopLunbo} from '../../../api/ShopLunbo.js'
	import {getProductByModuleConfig} from '../../../api/GoodsModules'	
	import {getImgUrl} from '../../../util/common.js'
	export default {
		components: {
		},
		data() {
			return {
				loading: true,
				titleNViewBackground: '',
				back:true,
				shopNum: '',
				shopBackground: "",
				tjGoodsList: [],  //猜你喜欢
				goodsList: [], 
				pageNum: 1,
				isloadData: true,
				hotList: shophostlist_,
				loveGoodsList: [],
				lunbolist: []
			};
		},
		props: {
			"shopInfo": {
				default: {},
				type: Object
			},
			"scrollBottomIndex": {
				default: 0,
				type:Number
			}
		},
		watch: {
			//监控滚动底部
			scrollBottomIndex(val) {
				this.getLoveGoodsList();
			}
		},
		async mounted() {
			this.shopNum = this.shopInfo.shopNum;
			
			//获取店铺信息
			await shopReq.getShopInfo(this.shopNum).then(res => {
				if(res.code != 200) {
					this.$api.msg("未发现店铺信息，即为为你跳转至首页")
					return;
				}
				this.shopInfo = res.data;
			})
			//轮播图加载
			await getShopLunbo(this.shopNum).then(res => {
				if(res.code == 200) {
					var list = [];
					res.data.forEach(res => {
						var imageUrl = this.getImage(res.imageUrl);
						var url = res.url;
						// url = url.indexOf("?") != 1 ? (url + "&") : (url + "?")
						// url = url + "shopNum=" + this.shopNum;
						list.push({image:imageUrl, url: url})
					})
					this.lunbolist = list;
				}
			})
			//店铺背景图
			shopReq.getShopBackground(this.shopNum).then(res => {
				if(res.code == 200) {
					this.shopBackground = getImgUrl(res.data.imageUrl);
				}
			})
			//店铺热卖商品
			this.hotList = [];
			await shopReq.shopHotProduct(this.shopNum).then(res => {
				if(res.code == 200) {
					this.hotList = res.data;
				}
			})
			//获取猜你喜欢
			this.getLoveGoodsList();
			//关闭加载效果
			this.loading = false;
		},
		methods: {
			pageScroll(scrollTop){
				if(scrollTop >= 100 && scrollTop <= 200){
					this.back = false
				}else if(scrollTop>=200){
					this.back = false
				}else{
					this.back = true
				}
			},
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			//获取猜你喜欢列表
			getLoveGoodsList() {
				if(this.isloadData){
					this.isloadData = false;
					getProductByModuleConfig({"position": "shop-like", "shopNum":this.shopNum, "pageNum":this.pageNum, "pageSize": 10}).then(res => {
						let liseList = res.data.list;
						if(res.code == 200 && liseList.length > 0) {
							this.loveGoodsList = this.loveGoodsList.concat(liseList);
							this.pageNum = this.pageNum + 1;
							this.isloadData = true;
						}
					});
				}
			},
			//跳转至店铺商品列表页
			to_allGoods() {
				//跳转至商品tab页
				this.$emit('changeTab', 2);
			},
			//跳转到商品池商拼页面
			to_goodsModuel(index) {
				var url = this.lunbolist[index].url;
				uni.navigateTo({
					url: url + `&shopNum=` + this.shopNum
				})
			},
			//详情页
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		},
	}
</script>

<style lang="scss">

	page {
		background: #f5f5f5;
		font-family: NotoSansHans-Regular;
		padding-bottom: 154rpx;
	}
	
	.shop-tab {
		width: 750rpx;
		height: 38rpx;
		display: flex;
		position: absolute;
		top: 270rpx;
		padding: 0 30rpx;
		color: #fff;
		align-items: flex-end;

		view {
			// flex:1;
			margin-right: 30rpx;
			font-size: 28rpx;
		}

		.active {
			font-size: 40rpx;
			font-weight: bold;
		}
	}
	.activeAbsolute{
		position: fixed;
		top: 44px;
		background-color: #fff;
		color: #000;
		height: 80rpx;
		align-items: center;
		z-index: 100;
	}
	/* 头部 轮播图 */
	.swiper {
		width: 750rpx;
		height: 375rpx;
		
		image {  
		     width:100%;  
		     height:375rpx; 
		 }
	}

	/* 本店热销 */
	.Hot {
		height: 437rpx;
		width: 690rpx;
		margin: 0 30rpx;
		// background: red;
		margin-top: 39rpx;

		.hot-box {
			margin-top: 30rpx;
			width: 690rpx;
			height: 377rpx;
			display: flex;
			justify-content: space-between;

			.hot-goods {
				width: 224rpx;
				height: 360rpx;
				border-radius: 5rpx;
				background-color: #ffffff;

				.hot-goods-img {
					width: 224rpx;
					height: 224rpx;

					image {
						width: 224rpx;
						height: 224rpx;
					}
				}
			}

			.hot-goods-tips {
				& view {
					font-family: PingFang-SC-Medium;
					font-weight: bold;
					

					&:first-child {
						width: 198rpx;
						height: 72rpx;
						margin: 19rpx 32rpx 10rpx 23rpx;
						font-size: 24rpx;
						color: #666666;
						line-height: 36rpx;
						word-break: break-all;
						display: -webkit-box;
						/**对象作为伸缩盒子模型展示**/
						-webkit-box-orient: vertical;
						/**设置或检索伸缩盒子对象的子元素的排列方式**/
						-webkit-line-clamp: 2;
						/**显示的行数**/
						overflow: hidden;
						/**隐藏超出的内容**/
					}

					&:last-child {
						margin-left: 23rpx;
						height: 28rpx;
						font-size: 28rpx;
						color: #db2929;
						font-weight: bold;
					}
				}
			}
		}
	}

	/* 猜你喜欢  */
	.love {
		width: 690rpx;
		margin: 0 30rpx;
		margin-top: 47rpx;
		overflow: hidden;
		.love-top {
			display: flex;
			text {
				&:first-child {
					font-size: 32rpx;
					color: #313131;
				}
/* 
				&:last-child {
					font-size: 24rpx;
					color: #999999;
					text-align: right;
					flex: 1;
				} */
			}
		}

		.love-box {
			width: 690rpx;
			margin-top: 29rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.love-goods {
				width: 335rpx;
				height: 490rpx;
				background-color: #ffffff;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
				border-radius: 16rpx;
				margin-bottom: 20rpx;

				.love-goods-img {
					width: 335rpx;
					height: 335rpx;
					image {
						width: 335rpx;
						height: 335rpx;
						vertical-align: bottom;
					}

				}
			}
			.love-goods-tips {
				view {
					font-family: PingFang-SC-Medium;
					// font-weight: bold;
					// margin: 19rpx 25rpx 29rpx 15rpx;
					&:first-child {
						width: 295rpx;
						margin: 19rpx 25rpx 0 15rpx;
						font-size: 24rpx;
						color: #666666;
						line-height: 36rpx;
						word-break: break-all;
						display: -webkit-box;
						/**对象作为伸缩盒子模型展示**/
						-webkit-box-orient: vertical;
						/**设置或检索伸缩盒子对象的子元素的排列方式**/
						-webkit-line-clamp: 2;
						/**显示的行数**/
						overflow: hidden;
						/**隐藏超出的内容**/
					}
			
					&:last-child {
						margin: 0 25rpx 0 15rpx;
						text{
							font-size: 24rpx;
							&:first-child{
								color: #db2929;
							}
							&:last-child{
								color: #b5b5b5;
								text-decoration:line-through;
								margin-left: 19rpx;
							}
						}
					}
				}
			}
		}
	}
	// 新增优惠	
	.conment {
		width: 690rpx;
		height: 224rpx;	
		margin: 0 auto;
		margin-top: 25rpx;
		background-image: url(../../../static/coupon/card_bg_shop.png);
		background-size:100% 100%	;
		box-shadow: 0px 0px 32px 0px rgba(132, 132, 132, 0.1);
		display: flex;
		align-items: center;
	}
	.conment_2{
		padding: 30rpx;
	}
	.conment_3{
		margin-left: 110rpx;
		text-align: center;
		color: #ef6613;
	}
	.text_1{
		width: 350rpx;
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
	.money{
		font-family: PingFang-SC-Medium;
			font-size: 38rpx;
			font-weight: bold;
			font-stretch: normal;
			line-height: 26rpx;
	}
	.money_1{
		font-family: PingFang-SC-Medium;
			font-size: 20rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 60rpx;
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
	.a-t{
			padding: 0 30rpx;
			font-family: PingFang-SC-Medium;
			font-size: 32rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 36rpx;
			letter-spacing: 0rpx;
			color: #313131;
	}
	.a-t1{
		font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 36rpx;
			letter-spacing: 0rpx;
			color: #999999;
			padding: 0 32rpx;
	}
	.a-t1>img{
		width: 20rpx;
		height: 15rpx;
		}
</style>
