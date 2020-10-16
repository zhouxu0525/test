<template>
	<view class="content">
		<!-- 顶部tabl -->
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" @click="tabClick(index)" class="nav-item" :class="{current: tabCurrentIndex === index}">
				{{item.text}}
				<!-- 角标 
				<u-badge type="error" :offset="[5,8]" count="17"></u-badge>-->
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData('nextPage')">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view v-if="tabCurrentIndex !==4">
							<view class="i-top b-b">
								<view class="shopIcon">
									<image :src="getImage(item.shopLogo)" mode=""></image>
								</view>
								<text class="shopName">{{item.shopName}}</text>
								<text class="state" :style="{color: statusColor(item.status)}">{{item.status | statusTitle}}</text>
							</view>
							<!-- 评价多商品布局 --><strong></strong>
							<!-- (tabCurrentIndex!=3 && item.status == 3) -->
							<view v-if="item.orderItemList.length > 1 && tabCurrentIndex==3" v-for="(goodsItem, goodsIndex) in item.orderItemList"
							 :key="goodsIndex">
								<view class="goods-box-single">
									<image @click="getOrderDetail(item.id,item.status)" class="goods-img" :src="getImage(goodsItem.productPic)"
									 mode="aspectFill"></image>
									<view class="right">
										<text class="title clamp" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productName}}</text>
										<text class="attr-box" v-if="!goodsItem.flashPromotionId" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productAttr | specText}}</text>
										<view style="width:100%;display: flex;align-items: center;font-weight: bold;" v-if="goodsItem.flashPromotionId">
											<view style="width:70%;">
												<text class="attr-box" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productAttr | specText}}
												</text>
											</view>
											<view style="width:30%;">
												<text style="font-size:24rpx;color:#db2929;margin-left: 45%;">活动</text>
											</view>
										</view>
										<view class="price-box1">
											<text class="price">{{goodsItem.productPrice}}</text>
											<text class="num">X{{goodsItem.productQuantity}}</text>
										</view>
									</view>
								</view>
								<view class="action-box b-t">
									<view class="action-btn recom" v-if="goodsItem.commentTime" @click="LookEvaluate(item,goodsItem)">
										查看评价
									</view>
									<view class="action-btn recom" v-else @click="toEvaluate(item,goodsItem)">
										评价
									</view>
								</view>
							</view>

							<!-- 多商品布局 -->
							<view class="goodsList" v-if="item.orderItemList.length > 1 && tabCurrentIndex!=3">
								<scroll-view class="goods-box" scroll-x>
									<view v-for="(goodsItem, goodsIndex) in item.orderItemList" :key="goodsIndex" class="goods-item">
										<image @click="getOrderDetail(item.id,item.status)" class="goods-img" :src="getImage(goodsItem.productPic)"
										 mode="aspectFill"></image>
									</view>
								</scroll-view>
								<view class="goodsBox">
									<view class="goodsBoxIcon">
										<image @click="getOrderDetail(item.id,item.status)" src="@/static/order/ellipsis.png"></image>
									</view>
									<view class="goodsBoxText">
										共{{item.orderItemList.length}}件
									</view>
								</view>
							</view>
							<!-- 单商品布局-->
							<view v-if="item.orderItemList.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.orderItemList"
							 :key="goodsIndex">
								<image @click="getOrderDetail(item.id,item.status)" class="goods-img" :src="getImage(goodsItem.productPic)"
								 mode="aspectFill"></image>
								<view class="right">
									<text class="title clamp" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productName}}</text>
									<text class="attr-box" v-if="!goodsItem.flashPromotionId" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productAttr | specText}}</text>
									<view style="width:100%;display: flex;align-items: center;font-weight: bold;" v-if="goodsItem.flashPromotionId">
										<view style="width:70%;">
											<text class="attr-box" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productAttr | specText}}
											</text>
										</view>
										<view style="width:30%;">
											<text style="font-size:24rpx;color:#db2929;margin-left: 45%;">活动</text>
										</view>
									</view>
									<view class="price-box1">
										<text class="price">{{goodsItem.productPrice}}</text>
										<text class="num">X{{goodsItem.productQuantity}}</text>
									</view>
								</view>
							</view>
							<!-- 总价:{{item.totalAmount}}, 优惠:{{item.promotionAmount}}, -->
							<view class="price-box" v-if="tabCurrentIndex!=3">
								实付款 <text class="price">{{item.payAmount}}</text>
							</view>
							<!-- 但商品评价 -->
							<view class="action-box b-t" v-if="item.orderItemList.length === 1 && tabCurrentIndex==3">
								<view class="action-btn recom" v-if="item.orderItemList[0].commentTime" @click="LookEvaluate(item)">
									查看评价
								</view>
								<view class="action-btn recom" v-else @click="toEvaluate(item)">
									评价
								</view>
							</view>
							<view class="action-box b-t" v-if="tabCurrentIndex!=3">
								<view class="action-btn" @click="lookLogistics(item)" v-if="item.status == 3 || item.status == 2">
									查看物流
								</view>
								<view class="action-btn recom" @click="cancelOrder(item)" v-if="item.status == 0">
									取消订单
								</view>
								<view class="action-btn recom" @click="deleteOrder(item)" v-if="item.status == 3 || item.status == 4">
									删除订单
								</view>
								<view class="action-btn recom" @click="payOrder(item)" v-if="item.status == 0">
									立即支付
								</view>
							</view>
						</view>
						<view v-if="tabCurrentIndex ===4">
								<view class="i-top b-b">
									<view class="shopIcon">
										<image :src="getImage(item.shopLogo)" mode=""></image>
									</view>
									<text class="shopName">{{item.shopName}}</text>
								</view>
								<view v-for="(goodsItem, goodsIndex) in item.orderItemList" :key="goodsIndex">
									<view class="i-top b-b">
										<view class="operation_1">收到的商品</view>
										<view class="state1" :style="{color: statusColor1(item,goodsIndex)}">{{returnStatus(item,goodsIndex)}}</view>
										<view>
											<img :src='iconUrl(item,goodsIndex)' class="img_2">
										</view>
									</view>
									<view class="goods-box-single">
										<image @click="getOrderDetail(item.id,item.status)" class="goods-img" :src="getImage(goodsItem.productPic)"
										 mode="aspectFill"></image>
										<view class="right">
											<text class="title clamp" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productName}}</text>
											<text class="attr-box" @click="getOrderDetail(item.id,item.status)">{{goodsItem.productAttr | specText}}</text>
											<view class="price-box1">
												<text class="price">{{goodsItem.productPrice}}</text>
												<text class="num">X{{goodsItem.productQuantity}}</text>
											</view>
										</view>
									</view>
									<view class="action-box b-t" >
										<!-- && goodsItem.productId === item.omsOrderReturnApply[goodsIndex].productId -->
										<view class="action-btn recom" @click="returnReason(goodsItem)" v-if="compareReturn(item,goodsItem,goodsIndex)">
											申请售后
										</view>
										<view class="action-btn " @click="cs(item,goodsItem,goodsIndex)" v-else>
											修改申请
										</view>
										<view class="action-btn " @click="returnReason(goodsItem)" v-if="!compareReturn(item,goodsItem,goodsIndex)">
											取消申请
										</view>
									</view>
								</view>						
								<view class="price-box">
									<!-- 总价:{{item.totalAmount}}, 优惠:{{item.promotionAmount}}, -->
									实付款 <text class="price">{{item.payAmount}}</text>
								</view>		
							
						</view>
					</view>
					<!-- 加载框 -->
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	import * as OrderReq from '../../api/Order.js'
	import * as PayReq from '../../api/Pay.js'
	import {
		getImgUrl
	} from '../../util/common.js'

	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				pageSize: 10,
				returnFlag:null,
				navList: [{
					index: 0, //tab状态
					text: '全部',
					loadingType: 'more',
					pageNum: 1,
					orderStatus: '-1', //实际订单状态
					orderList: []
				}, {
					index: 1,
					text: '待付款',
					loadingType: 'more',
					pageNum: 1,
					orderStatus: '0', //实际订单状态
					orderList: []
				}, {
					index: 2,
					text: '待收货',
					loadingType: 'more',
					pageNum: 1,
					orderStatus: '2', //实际订单状态
					orderList: []
				}, {
					index: 3,
					text: '待评价',
					loadingType: 'more',
					pageNum: 1,
					orderStatus: '3', //查询订单状态
					orderList: []
				}, {
					index: 4,
					text: '售后',
					loadingType: 'more',
					pageNum: 1,
					orderStatus: '3', //查询订单状态
					orderList: []
				}],
			};
		},

		onLoad(options) {
			//默认全部
			this.tabCurrentIndex = 0;
			//页签
			if (options.state === 'all') this.tabCurrentIndex = 0;
			if (options.state === 'dfk') this.tabCurrentIndex = 1;
			if (options.state === 'dsh') this.tabCurrentIndex = 2;
			if (options.state === 'dpj') this.tabCurrentIndex = 3;
			if (options.state === 'sh') this.tabCurrentIndex = 4;
			//加载订单数据
			this.loadData()
		},
		filters: {
			statusTitle(val) {
				if (val == 0) return '待付款';
				if (val == 1) return '待发货';
				if (val == 2) return '已发货';
				if (val == 3) return '已完成';
				if (val == 4) return '已关闭';
			},
			specText(val) {
				let specValArray = [];
				let spec = JSON.parse(val);
				spec.forEach(d => {
					specValArray.push(d.key + ":" + d.value);
				})
				return specValArray.join(" ");
			}
		},
		methods: {
			//获取订单列表
			loadData(type) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let orderStatus = navItem.orderStatus;

				if (type === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading' ||
					navItem.loadingType === 'noMore') {
					//防止重复加载
					return;
				}
				if (type === 'nextPage') {
					navItem.pageNum = navItem.pageNum + 1;
				}
				const that = this;
				navItem.loadingType = 'loading';
				//加载分页数据
				var param = {
					"pageNum": navItem.pageNum,
					"pageSize": this.pageSize
				};
				param = Object.assign(param, {
					"status": orderStatus
				});
				OrderReq.getOrderList(param).then(res => {
					var orderlist = [];
					if (res.code == 200 && res.data.list) {
						orderlist = res.data.list;
					}
					orderlist.forEach(o => {
						//console.info("orderlist收藏",o.shopInfo);
						if (typeof(o.shopInfo) == 'undefined') {

						} else {
							o.shopLogo = o.shopInfo.shopLogo;
							o.shopName = o.shopInfo.shopName;
						}
						navItem.orderList.push(o)
					})
					that.$set(navItem, 'loaded', true);
					//判断是否还有数据， 有改为 more， 没有改为noMore
					navItem.loadingType = (orderlist.length == 0 ? 'noMore' : 'more');
				});
			},
			getImage(imgUrl) {
				//return imgUrl
				return getImgUrl(imgUrl);
			},
			LookEvaluate(item, goodsItem) {
				let goodsBean = item.orderItemList[0];
				if (goodsItem) {
					goodsBean = goodsItem;
				}
				uni.navigateTo({
					url: '/pages/evaluate/detail?orderId=' + item.id + "&goodsId=" + goodsBean.productId
				});
			},
			//评价跳转
			toEvaluate(item, goodsItem) {
				let goodsBean = item.orderItemList[0];
				if (goodsItem) {
					goodsBean = goodsItem;
				}

				uni.navigateTo({
					url: '/pages/evaluate/addEvaluate?orderId=' + item.id + "&goodsId=" + goodsBean.productId
				});
			},
			//售后跳转
			returnReason(item) {
				console.info("====>", JSON.stringify(item));
				uni.navigateTo({
					//url: '/pages/repair/afterSale?productPic=' + item.productPic + '&productName=' + item.productName + '&realAmount=' + item.realAmount+'&productQuantity='+item.productQuantity+'&id='+item.id,
					url: '/pages/repair/afterSale?item=' + encodeURIComponent(JSON.stringify(item)),
				});

			},
			//售后状态
			returnStatus(item, index) {
			console.info("1111",item)
				if (typeof item.omsOrderReturnApply !== 'undefined') {
					if (typeof item.omsOrderReturnApply[index] !== 'undefined') {
						if (typeof item.omsOrderReturnApply[index].returnChannel !== 'undefined') {
							if (item.omsOrderReturnApply[index].returnChannel === 1) {
								this.returnFlag = '维修';
								return '维修';
							} else if (item.omsOrderReturnApply[index].returnChannel === 2) {
								this.returnFlag = '退货';
								return '退货';
							} else {
								this.returnFlag = '换货';
								return '换货';
							}
						}
					}
				}
				return '';
			},
			//比较售后状态
			compareReturn(item, goodsItem, goodsIndex) {
				if (typeof item.omsOrderReturnApply === 'undefined') {
					return true;
				}
				var i = item.omsOrderReturnApply[goodsIndex];
				if (typeof i === 'undefined') {
					return true;
				}
				if (goodsItem.productId === item.omsOrderReturnApply[goodsIndex].productId) {
					return false;
				} else {
					return true;
				}
			},
			//查看物流
			lookLogistics(item) {
				uni.navigateTo({
					url: "../logisticsDetails/index?id=" + item.id
				})
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index) {
				//console.info("itemitemitemitem",index);
				uni.showModal({
					title: '删除订单提示',
					content: '确认要删除该订单嘛？',
					cancelText: '我再想想',
					success: res => {
						if (res.confirm) {
							this.deleteOrderReq(index);
						}
					}
				});
			},
			deleteOrderReq(item) {
				uni.showLoading({
					title: '正在处理中'
				})
				const that = this;
				OrderReq.deleteOrder({
					"orderId": item.id
				}).then(res => {
					if (res.code == 200) {
						//删除订单后 删除已加载列表
						that.navList.forEach(nav => {
							let list = nav.orderList;
							let index = list.findIndex(val => val.id === item.id);
							index !== -1 && list.splice(index, 1);
						})
						that.$api.msg("订单删除成功");
					}
					uni.hideLoading();
				});
			},
			//取消订单
			cancelOrder(item) {
				uni.showModal({
					title: '取消订单提示',
					content: '确认要取消该订单嘛？',
					cancelText: '我再想想',
					success: res => {
						if (res.confirm) {
							this.cancelOrderReq(item);
						}
					}
				});
			},
			cancelOrderReq(item) {
				uni.showLoading({
					title: '正在处理中'
				})
				const that = this;
				OrderReq.cancelUserOrder({
					"orderId": item.id
				}).then(res => {
					if (res.code == 200) {
						//取消订单后删除待付款中该项
						let list = that.navList[1].orderList;
						let index = list.findIndex(val => val.id === item.id);
						index !== -1 && list.splice(index, 1);
						//订单状态 修改为 已关闭
						item.status = 4;
						that.$api.msg("订单取消成功");
					}
					uni.hideLoading();
				});
			},
			//确认收货
			confirmReceiveOrder(index) {
				uni.showModal({
					title: '确认收货提示',
					content: '确认已经收到商品了嘛？',
					cancelText: '还没有',
					success: res => {
						if (res.confirm) {
							this.confirmReceiveOrderReq(item);
						}
					}
				});
			},
			confirmReceiveOrderReq(item) {
				uni.showLoading({
					title: '正在处理中'
				})
				const that = this;
				OrderReq.confirmReceiveOrder({
					"orderId": item.id
				}).then(res => {
					if (res.code == 200) {
						//订单状态 修改为 已完成
						item.status = 3;
						that.$api.msg("订单确认收货成功");
					}
					uni.hideLoading();
				});
			},
			//订单去支付
			payOrder(item) {
				uni.showLoading({
					title: '正在处理中'
				})
				const that = this;
				OrderReq.placeAnOrderValidate({
					"orderId": item.id
				}).then(res => {
					if (res.code == 200) {
						//调用支付
						OrderReq.prePayOrder({
							"orderSn": item.orderBatchNum
						}).then(res => {
							if (res.code == 200) {
								//跳转支付页面
								uni.navigateTo({
									url: '/pages/money/pay?orderSn=' + res.data
								});
							}
						})
					} else {
						this.$api.msg(res.message)
					}
				})
				uni.hideLoading();
			},
			//颜色判断
			statusColor(val) {
				//console.info("color", val)
				return (val == 4 ? '#909399' : '#fa436a')
			},
			//售后颜色
			statusColor1(item, goodsIndex) {
				var i = '';
				i = this.returnStatus(item, goodsIndex);
				var ri = '';
				if (i === '维修') {
					ri = '#5555ff';
				}
				if (i === '退货') {
					ri = '#ff0000';
				}
				if (i == '换货') {
					ri = '#ffaa00';
				}
				return ri;
			},
			//售后图标
			iconUrl(item, goodsIndex) {
				var i = '';
				i = this.returnStatus(item, goodsIndex);
				var ri = '';
				if (i === '维修') {
					ri = '../../static/comment/wx.png';
				}
				if (i === '退货') {
					ri = '../../static/comment/th.png';
				}
				if (i == '换货') {
					ri = '../../static/comment/hh.png';
				}
				return ri;
			},

			getOrderDetail(orderId, status) {
				uni.navigateTo({
					url: '/pages/orderDetails/index?id=' + orderId
				});
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
		font-family: PingFang-SC-Medium;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 20rpx;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30rpx;
			color: #222222;
			position: relative;

			&.current {
				color: #db2929;
				font-weight: bold;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 41rpx;
					height: 6rpx;
					border-radius: 3rpx;
					background-color: #db2929;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.img_2 {
		position: absolute;
		right: 30rpx;
		width: 27rpx;
		height: 34rpx;
	}



	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30rpx;
		background: #fff;
		margin-top: 20rpx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80rpx;
			padding-right: 30rpx;
			font-size: 24rpx;

			position: relative;

			.shopIcon {
				width: 28rpx;
				height: 26rpx;
				margin-right: 21rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.shopName {
				height: 30rpx;
				font-size: 24rpx;
				color: #333333;
				flex: 1;
			}

			.state {
				height: 30rpx;
				color: #db2929 !important;
			}

			.state1 {
				height: 10rpx;
				//color: #5555ff !important;
				position: absolute;
				right: 60rpx;
				font-size: 28rpx;

			}

			.del-btn {
				padding: 10upx 0 10upx 36rpx;
				font-size: $font-lg;
				color: #db2929 !important;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30rpx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goodsList {
			height: 178rpx;
			position: relative;

			.goods-box {
				height: 148rpx;
				margin: 20rpx 0;
				white-space: nowrap;

				.goods-item {
					width: 148rpx;
					height: 148rpx;
					display: inline-block;
					margin-right: 24rpx;
				}

				.goods-img {
					display: block;
					width: 100%;
					height: 100%;
				}

			}

			.goodsBox {
				position: absolute;
				top: 0;
				right: 0;
				width: 102rpx;
				height: 178rpx;
				background-color: rgba(255, 255, 255, .95);
				// opacity: 0.95;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.goodsBoxIcon {
					width: 40rpx;
					height: 40rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.goodsBoxText {
					font-size: 24rpx;
					color: #313131;
					margin-top: 23rpx;
				}
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			width: 684rpx;
			height: 149rpx;
			margin: 20rpx 0;

			.goods-img {
				display: block;
				width: 148rpx;
				height: 148rpx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-left: 25rpx;
				overflow: hidden;
				font-size: 24rpx;
				color: #999999;

				.title {
					font-size: 28rpx;
					color: #000000;
					font-weight: bold;
					line-height: 1;
					height: 28rpx;
				}

				.attr-box {
					color: #999999;
					margin: 21rpx 0 40rpx 0;
					height: 23rpx;
				}

				.price-box1 {
					display: flex;
					justify-content: space-between;

					.price {
						font-size: 36rpx;
						font-weight: bold;
						height: 28rpx;
						color: #db2929;

						&:before {
							content: '￥';
							font-size: 36rpx;
						}
					}

					.num {
						font-size: 20rpx;
						font-weight: bold;
						color: #000000;
					}
				}

			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30rpx;
			font-size: 24rpx;
			color: #999999;

			.price {
				font-size: 32rpx;
				color: #313131;
				font-weight: bold;

				&:before {
					content: '￥';
					font-size: 24rpx;
					font-weight: bold;
					margin: 0 2rpx 0 8rpx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100rpx;
			position: relative;
			padding-right: 30rpx;
		}

		.action-btn {
			width: 148rpx;
			height: 48rpx;
			margin: 0;
			margin-left: 24rpx;
			padding: 0;
			text-align: center;
			line-height: 48rpx;
			font-size: 24rpx;
			color: #666666;
			background: #fff;
			border-radius: 24rpx;
			border: solid 1rpx #999999;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				color: #db2929;
				border: solid 1rpx #db2929;

				&:after {
					border-color: #db2929;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80rpx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28rpx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
