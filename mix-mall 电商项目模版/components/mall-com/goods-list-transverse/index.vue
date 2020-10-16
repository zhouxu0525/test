<!-- 商品列表 横向两列布局 -->
<template>
	<view class="floor u-skeleton">
		<view class="floor-header" :style="headerStyle">
			<view class="header-title" :style="titleStyle">
				{{title}}
			</view>
			<view @click="navToMore()" v-if="floorData.url && floorData.url != ''"
				class="header-more">更多</view>
		</view>
		<view class="love" :style="bodyStyle">
			<view class="love-box">
				<view v-for="(item, i) in goodsList" class="love-goods" :key="i" @click="navToDetailPage(item)">
					<view class="love-goods-img u-skeleton-fillet">
						<image :src="getImage(item.pic)"></image>
					</view>
					<view class="love-goods-tips">
						<view class="u-skeleton-fillet">{{item.name}}</view>
						<view>
							<text class="u-skeleton-fillet">¥{{item.price}}</text>
							<text class="u-skeleton-fillet">¥{{item.originalPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import {searchProduct} from '../../../api/ProductSearch.js'
	import {getProductModule} from '../../../api/ProductModule.js'
	import {getImgUrl, navigateTo} from '../../../util/common.js'
	import {getPageInfo,getFloorInfoConfig} from '../../../api/Page.js'
	
	export default {
		name: 'GoodsListTransverseBox',
		data() {
			return {
				title: '',
				goodsList: [],
				loadingType: 'more',
				pageNum: 2,
				pageSize: 5,
				num:0,
				data:null
			};
		},
		props: {
			"floorData": {},
			"isMore":0,
			loading: false
		},
		async mounted() {
			this.title = this.floorData.title;
			await getFloorInfoConfig({"id":this.floorData.id}).then(res => {
				this.data = res.data;
				if(res.code == 200 && res.data.length > 0) {
					this.goodsList = res.data[0].productList;
				}
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id)
		},
		watch:{
			isMore(val){
				this.loadData();
			}
		},
		computed: {
			headerStyle() {
				var style = {};
				//标题栏 背景颜色设置
				var titleBgColor = this.floorData.titleBgColor;
				if(titleBgColor && titleBgColor != '') {
					style.backgroundColor = titleBgColor 
				}
				//标题栏 背景图设置
				var titleBgImg = this.floorData.titleBgImg;
				if(titleBgImg && titleBgImg != '') {
					style.background = "url('" + titleBgImg + "') no-repeat"
					style.backgroundSize = "cover";
				}
				return style;
			},
			titleStyle() {
				var style = {};
				var titleColor = this.floorData.titleColor;
				if(titleColor && titleColor != '') {
					//标题颜色设置
					style.color = titleColor 
				}
				return style;
			},
			bodyStyle() {
				var style = {};
				//楼层内容背景颜色设置
				var backgroundColor = this.floorData.backgroundColor;
				if(backgroundColor && backgroundColor != '') {
					style.backgroundColor = backgroundColor 
				}
				//楼层内容背景图设置
				var backgroundImg = this.floorData.backgroundImg;
				if(backgroundImg && backgroundImg != '') {
					style.background = "url('" + this.getImage(backgroundImg) + "') no-repeat"
					style.backgroundSize = "cover";
				}
				return style;
			}
		},
		methods: {
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},

			async loadData() {
				if(this.loadingType != 'more'){
					return;
				}
				this.loadingType = 'loading';
				console.info("this.currentId", this.currentId)
				//第一次进来更新页长
				if(this.num = 0){
					this.pageSize = this.goodsList.length;
					this.num = num + 1;
				}
				
				let param = {"pageNum": this.pageNum, "pageSize": this.pageSize, "id": this.data[0].productPoolCode};
				
				await getProductModule(param).then(res => {
					if(res.code == 200 && res.data.list.length > 0) {
						this.goodsList = this.goodsList.concat(res.data.list);
						this.loadingType = 'more';
						this.pageNum = this.pageNum + 1;
					} else {
						//没有更多数据了
						this.loadingType = 'nomore';
					}
				})
			},
			//详情页
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=` + id
				})
			},
			
			navToMore() {
				var url = this.floorData.url;
				navigateTo(url);
			},
		},
		
	}
</script>

<style lang="scss">

	.floor {
		padding-top: 20px; 
		.floor-header {
			height: 90rpx;
			line-height: 90rpx;
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			.header-title {
				display: flex;
				align-items: center;
				font-family: NotoSansHans-Medium;
				font-size: 40rpx;
				height: 42rpx;
				line-height: 42rpx;
				color: #333333;
				.count-down {
					display: flex;
					align-items: center;
					font-family: NotoSansHans-Regular;
					font-size: 22rpx;
					color: #313131;
					padding-left: 20rpx;
					.count-number {
						width: 32rpx;
						height: 32rpx;
						line-height: 32rpx;
						background-color: #ebebeb;
						border-radius: 6rpx;
						text-align: center;
						margin: 0 4rpx;
					}
				}
				
			}
			.header-more {
				display: flex;
				align-items: center;
				font-family: PingFang-SC-Medium;
				font-size: 22rpx;
				color: #999999;
			}
		}

		/* 猜你喜欢  */
		.love {
			width: 100%;
			padding: 0 30rpx;
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
	}
</style>
