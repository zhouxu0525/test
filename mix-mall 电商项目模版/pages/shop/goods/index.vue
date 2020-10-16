<template>
	<view class="container u-skeleton">
		<view class="shop-tab u-skeleton-fillet" :class="{activeAbsolute:!back}" > 
			<view  v-for="(item,i) in tabList" @click="changeTab(item)" :class="{active:item.id == currentId}" :key='i'>
				{{item.name}}
				<view class="p-box" v-if="item.sort">
					<image src="@/static/shop/sort1.png" mode="" v-if="status === 1"></image>
					<image src="@/static/shop/sort2.png" mode="" v-else-if="status === 2"></image>
					<image src="@/static/shop/sort.png" mode="" v-else></image>
				</view>
			</view>
		</view>
		
		<view class="love">
			<view class="love-box">
				<view v-for="(item, i) in goodsList" class="love-goods" :key="i" @click="navToDetailPage(item)">
					<view class="love-goods-img u-skeleton-fillet">
						<image :src="getImage(item.pic)"></image>
					</view>
					<view class="love-goods-tips u-skeleton-fillet">
						<view>{{item.name}}</view>
						<view>
							<text>¥{{item.price}}</text>
							<text>¥{{item.originalPrice}}</text>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
		<!-- 骨架屏 加载动画 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import {goodsList_} from '@/util/skeletonJson.js'
	import {searchProduct} from '../../../api/ProductSearch.js'
	import * as shopReq from '../../../api/Shop.js'
	import {getImgUrl} from '../../../util/common.js'
	
	export default {
		components: {
		},
		data() {
			return {
				loading: true,
				status: 0,		//1 升序； 2降序
				loadingType: 'more', //加载更多状态
				back:true,
				shopNum: '',
				toggle:true,
				goodsList: goodsList_,
				pageSize: 10,
				pageNum: 0,
				currentId: 1,
				shopTab: true,	//是否展示 店铺商品选项卡
				tabList: [{
					name: "全部商品",
					id: "1",
					sort:false
				}, {
					name: "销量",
					id: "2",
					sort:false
				}, {
					name: "价格",
					id: "3",
					sort:true
				}]
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
				this.loadData();
			}
		},
		async mounted() {
			this.shopNum = this.shopInfo.shopNum;
			//商品列表
			this.goodsList = [];
			//加载店铺商品列表
			await this.loadData();
			this.loading = false;
		},
		methods: {
			pageScroll(scrollTop){
				if(scrollTop >= 100 && scrollTop <= 200){
					this.back = false
				}else if(scrollTop >= 200){
					this.back = false
				}else{
					this.back = true
				}
			},
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			//加载店铺所有商品数据
			async loadData() {
				if(this.loadingType === 'nomore'){
					return;
				}
				this.loadingType = 'loading';
				var sort = 1;
				if(this.currentId == 1) {
					//全部商品 默认按新品排序
					sort = 1;
				} else if(this.currentId == 2) {
					//按销量排序
					sort = 2;
				} else if(this.currentId == 3) {
					//按价格排序
					sort = ((this.status == 0 || this.status == 1) ? 3 : 4);
				} 
				//sort 排序字段:0->按相关度；1->按新品；2->按销量；3->价格从低到高；4->价格从高到低
				let param = {"shopNum": this.shopNum, "pageNum": this.pageNum, "pageSize": this.pageSize, "sort": sort};
				const that = this;
				await searchProduct(param).then(res => {
					if(res.code == 200 && res.data.list.length > 0) {
						that.goodsList = that.goodsList.concat(res.data.list);
						that.pageNum = that.pageNum + 1;
						if(res.data.list.length >= that.pageSize) {
							that.loadingType = 'more';
						} else {
							that.loadingType = 'nomore';
						}
					} else {
						//没有更多数据了
						that.loadingType = 'nomore';
					}
				})
			},
			//切换tab
			changeTab(item){
				this.currentId = item.id 
				if(item.name === '价格'){
					if (this.status === 0){
						this.status = 1
					} else if (this.status === 1){
						this.status = 2
					} else {
						this.status = 1
					}
				} else {
					this.status = 0
				}
				
				this.goodsList = [];
				this.loadingType = 'more';
				this.pageNum = 0;
				this.loadData();
			},
			//详情页
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			//跳转至搜索页
			searchData() {
				let keyword = this.keyword;
				let shopNum = this.shopNum;
				uni.navigateTo({
					url: `/pages/product/list?keyword=${keyword}&shopNum=${shopNum}`
				})
			},
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.$api.msg('小程序内点击了搜索框');
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
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
		}
		// #endif
	}
</script>

<style lang="scss">


	

	.shop-tab {
		width: 750rpx;
		height: 48rpx;
		display: flex;
		position: absolute;
		top: 259rpx;
		padding: 0 30rpx;
		color: #fff;
		align-items: center;
		justify-content: space-around;
		view {
			// margin-right: 30rpx;
			font-size: 28rpx;
			display: flex;
			// width: 25%;
		}

		.active {
			padding: 12rpx 29rpx 13rpx 30rpx;
			background-color: #ffffff;
			border-radius: 24rpx;
			color: #db2929;
		}
		.p-box{
			display: flex;
			align-items:center;
			margin-left:8rpx ;
			image{
				width: 12rpx;
				height: 20rpx;
			}
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

	/* 猜你喜欢  */
	.love {
		width: 750rpx;
		padding: 0 30rpx;
		margin-top: 20rpx;
		overflow: hidden;
		.love-top {
			display: flex;
			text {
				&:first-child {
					font-size: 32rpx;
					color: #313131;
				}

				&:last-child {
					font-size: 24rpx;
					color: #999999;
					text-align: right;
					flex: 1;
				}
			}
		}

		.love-box {
			width: 690rpx;
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
</style>
