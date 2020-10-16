<template>
	<view class="content u-skeleton">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box u-skeleton-fillet">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled @click="navtosearch"/>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="status_bar" ref="header">
			<image src="@/static/goodList/back.png" mode="" @click="toBack" class="black"></image>
			<view class="MD">
				<image src="@/static/goodList/icon_seach_gray.png" mode="" />
				<input type="text" placeholder="输入关键字搜索" disabled @click="navtosearch"/>
			</view>
			<view class="right-img" @click="toggleList">
				<image src="@/static/goodList/icon_list.png" v-if="toggle" mode="" />
				<image src="@/static/goodList/icon_card.png" v-else mode="" />
				<!-- <u-badge type="error" class="badge" is-center="true" count="7"></u-badge> -->
			</view>
		</view>
		<!-- #endif -->
		<view class="goods-list" v-if="toggle">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item"
				@click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="getImage(item.pic)" mode="aspectFill"></image>
				</view>
				<view class="title">{{item.name}}</view>
				<view class="price-box">
					<text class="price">{{item.price}}</text>
				</view>
			</view>
		</view>
		<view class="goods-list1" v-else>
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" 
				@click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="getImage(item.pic)" mode="aspectFill"></image>
				</view>
				<view class="good-box">
					<view class="title">{{item.name}}</view>
					<view class="shop-box">
						<view class="shopIcon">
							<image :src="getImage(item.shopLogo)" mode=""></image>
						</view>
						<view class="shopName">
							{{item.shopName}}
						</view>
					</view>
					<view class="price-box">
						<text class="price">{{item.price}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {searchProduct, searchProductRelate} from '../../api/ProductSearch.js'
	import {getProductModuleByModuleNum} from '../../api/ProductModule.js'
	import {getImgUrl, navigateToBack} from '../../util/common.js'
	
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				headerPosition: "fixed",
				headerTop: "0px",
				toggle: false,
				loadingType: 'more', //加载更多状态
				pageSize: 10,
				pageNum: 1,
				module: null,
				goodsList: []		//商品列表
			};
		},
		onLoad(options) {
			var t = '';
			if(options.module) {
				this.module = options.module;
				t += '商品池';
			}
			//加载商品数据
			this.loadData('refresh');
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add') {
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					//加载下一页商品
					this.loadingType = 'loading';
					this.pageNum = this.pageNum + 1;
				} else {
					//刷新列表
					this.loadingType = 'more';
					this.pageNum = 1;
					this.goodsList = [];
				}
				//组装商品筛选参数
				var param = this.createSearchParam(type);
				
				uni.showLoading({title: '正在加载'})
				const that = this;
				let goodsList = [];				
				await getProductModuleByModuleNum(param).then(res => {
					if(res.code == 200 && res.data.list) {
						goodsList = res.data.list;
					}
				});
				if(goodsList.length > 0) {
					this.goodsList = this.goodsList.concat(goodsList);
				}
				//判断是否还有下一页，有是more  没有是nomore
				this.loadingType = (goodsList.length < this.pageSize ) ? 'nomore' : 'more';
				uni.hideLoading()
			},
			createSearchParam(type) {
				//普通查询提交参数
				var param = {"pageNum": this.pageNum, "pageSize": this.pageSize, "id": this.module};
				if(this.shopNum != '') {
					param = Object.assign(param, {"shopNum": this.shopNum})
				}
				
				return param;
			},
			//详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {},
			// 切换列表
			toggleList() {
				this.toggle = !this.toggle
			},
			navtosearch() {
				uni.navigateTo({
					url: "/pages/product/list"
				})
			},
			toBack() {
				navigateToBack();
			}
		},
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30rpx;
		z-index: 9999;
		width: 100%;
		padding: 0 80rpx;
		.ser-input{
			flex:1;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			font-size: 28rpx;
			color:$font-color-base;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	/* #endif */
	/* #ifdef H5 */
	.status_bar {
		font-family: PingFang-SC-Medium;
		height: var(--status-bar-height);
		width: 100%;
		height: 44px;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
		// box-shadow: 0rpx 3rpx 20rpx 0rpx rgba(153, 153, 153, 0.12);
		display: flex;
		align-items: center;

		.black {
			width: 20rpx;
			height: 34rpx;
			margin-left: 30rpx;
		}

		.MD {
			width: 554rpx;
			height: 64rpx;
			background-color: #eee;
			border-radius: 32rpx;
			margin: 0 29rpx 0 45rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			input {
				width: 500rpx;
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

			// .badge{
			// 	position: absolute!important;
			// 	top: 12rpx!important;
			// 	right: 40rpx!important;
			// 	font-size: 20rpx!important;
			// 	width: 24rpx;
			// 	height: 24rpx;
			// 	border-radius: 24rpx;
			// 	color: #fff;
			// 	background-color: #db2929;
			// }
		}
	}

	/* #endif */
	.content {
		background: #f8f8f8;
	}

	.content {
		padding-top: 96rpx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: 44px;
		display: flex;
		width: 100%;
		height: 80rpx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28rpx;
			color: #313131;
			position: relative;

			&.current {
				font-size: 28rpx;
				font-weight: bold;
				color: #db2929;
			}
		}

		.p-box {
			// display: flex;
			// flex-direction: column;
			margin-left: 8rpx;

			image {
				width: 13rpx;
				height: 19rpx;
			}

			.xia {
				transform: scaleY(-1);
			}
		}
	}

	/* 分类 */

	.cate-mask {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 1000;
		transition: .3s;

		.cate-content {
			width: 618rpx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		height: 100%;
		width: 618rpx;
		padding: 0 30rpx 160rpx 30rpx;

		// 价格区间
		.cate-test {
			margin-top: 90rpx;
			margin-bottom: 40rpx;
			.ctae-input {
				display: flex;
				justify-content: space-between;

				view {
					width: 256rpx;
					height: 64rpx;
					background-color: #f7f7f7;
					border-radius: 30rpx;
					text-align: center;
					line-height: 64rpx;

					input {
						height: 64rpx;
						font-size: 24rpx;
					}
				}
			}
		}

		.cate-name {
			font-size: 28rpx;
			font-weight: bold;
			color: #000000;
			margin-bottom: 24rpx;
			margin-top: 15rpx;
		}


		.list {
			// margin-top: 45rpx;
			// overflow: hidden;
			border-bottom: 1px solid #eee;
			.cate-item {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				padding-bottom: 20rpx;
				// margin-bottom: -20rpx;
				// overflow: hidden;
				view {
					width: 172rpx;
					height: 64rpx;
					background-color: #f7f7f7;
					border-radius: 10rpx;
					font-size: 24rpx;
					color: #333333;
					text-align: center;
					line-height: 64rpx;
					margin-bottom: 10rpx;
					margin-top: 10rpx;
				}

				.active {
					border: solid 2rpx #db2929;
					color: #f46264;
					background-color: #fff6f6;
				}
				.active1 {
					margin-top: 20rpx;
				}
			}
		}
	}

	.cate-btn {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 618rpx;
		height: 108rpx;
		align-items: center;
		justify-content: space-around;

		view {
			width: 256rpx;
			height: 72rpx;
			border-radius: 36rpx;
			line-height: 72rpx;
			text-align: center;
			font-size: 32rpx;

			&:first-child {
				background-color: #f7f7f7;
				color: #666666;
			}

			&:last-child {
				background-color: #db2929;
				color: #ffffff;
			}
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 30rpx;

		.goods-item {
			background: #fff;
			width: 335rpx;
			height: 490rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;

			.image-wrapper {
				width: 335rpx;
				height: 335rpx;
				// background-color: #e6e6e6;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					opacity: 1;
				}
			}

			.title,
			.price-box {
				padding: 0 25rpx 0 15rpx;
			}

			.title {
				color: #111111;
				width: 295rpx;
				height: 60rpx;
				margin-top: 20rpx;
				font-size: 24rpx;
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

			.price-box {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 10rpx;
				font-size: 24rpx;
				color: #b5b5b5;
			}

			.price {
				font-size: 30rpx;
				color: #db2929;
				line-height: 1;

				&:before {
					content: '￥';
					font-size: 24rpx;
					color: #db2929;
				}
			}
		}
	}


	.goods-list1 {
		padding: 0 30rpx;
		background: #fff;
		padding-top: 21rpx;

		.fixed {
			position: fixed;
			bottom: 161rpx;
			right: 31rpx;
			width: 76rpx;
			height: 76rpx;

			image {
				width: 76rpx;
				height: 76rpx;
			}
		}

		.goods-item {
			width: 696rpx;
			height: 220rpx;
			display: flex;
			margin-bottom: 41rpx;

			.image-wrapper {
				width: 220rpx;
				height: 220rpx;

				image {
					width: 220rpx;
					height: 220rpx;
					opacity: 1;
				}
			}

			.good-box {
				width: 452rpx;
				height: 220rpx;
				margin-left: 25rpx;
				font-size: 28rpx;

				.title {
					width: 444rpx;
					// height: 62rpx;
					color: #000000;
					word-break: break-all;
					display: -webkit-box;
					/**对象作为伸缩盒子模型展示**/
					-webkit-box-orient: vertical;
					/**设置或检索伸缩盒子对象的子元素的排列方式**/
					-webkit-line-clamp: 2;
					/**显示的行数**/
					overflow: hidden;
					/**隐藏超出的内容**/
					margin: 9rpx 0 19rpx 0;
				}

				.shop-box {
					height: 26rpx;
					display: flex;
					align-items: center;

					.shopIcon {
						width: 28rpx;
						height: 26rpx;

						image {
							width: 28rpx;
							height: 26rpx;
						}
					}

					.shopName {
						font-size: 24rpx;
						color: #999999;
						margin-left: 13rpx;
						flex: 1;
					}
				}

				.price-box {
					margin-top: 40rpx;
					display: flex;
					align-items: center;

					.price {
						font-size: 40rpx;
						font-weight: bold;
						color: #db2929;

						&::before {
							content: '￥';
							font-size: 28rpx;
							font-weight: bold;
						}
					}

					.sales {
						flex: 1;
						text-align: right;
						font-size: 24rpx;
						color: #999999;

					}
				}
			}
		}
	}
</style>

