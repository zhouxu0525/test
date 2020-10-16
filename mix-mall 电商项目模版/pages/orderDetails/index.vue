<template>
	<view class="orderDetails">
		<!-- 顶部 -->
		<view class="header">
			<view class="headerBack">
				<image src="@/static/order/back.png" mode="" @click="backPage"></image>
			</view>
			<view class="headerImg">
				<image :src="getImage('/mall-res/user-bg.png')" mode=""></image>
			</view>
			<!-- 待付款 -->
			<view class="headerBox" v-if="orderDetail.status == 0">
				<view class="headerBoxOne">
					<view>
						<image src="@/static/order/icon_waiting.png" mode=""></image>
					</view>
					<view>
						等待付款
					</view>
				</view>
				<view class="headerBoxTwo">
					<text>{{orderDetail.payAmount}}</text>
					<!-- <text>还剩 23时 12分 25秒</text> -->
					<text>{{remaining}}</text>
				</view>
				<view class="headerBoxThree" @click="payOrder(orderDetail)">
					立即付款
				</view>
			</view>
			<view class="headerBox" v-else-if="orderDetail.status == 1">
				<view class="headerBoxOne">
					<!-- 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 -->
					<view>
						<image src="@/static/order/icon_waiting.png" mode=""></image>
					</view>
					<view>
						等待揽收
					</view>
				</view>
				<view class="headerBoxFour">
					包裹正在等待揽收，请耐心等待！
				</view>
			</view>
			<!-- 待收货 -->
			<view class="headerBox" v-else-if="orderDetail.status == 2">
				<view class="headerBoxOne">
					<view>
						<image src="@/static/order/icon_waiting.png" mode=""></image>
					</view>
					<view>
						等待收货
					</view>
				</view>
				<view class="headerBoxFour">
					您的商品已发货，请耐心等待
				</view>
			</view>
			<!--  已完成  -->
			<view class="headerBox" v-else-if="orderDetail.status == 3">
				<view class="headerBoxOne">
					<view>
						<image src="@/static/order/icon_done.png" mode=""></image>
					</view>
					<view>
						已完成
					</view>
				</view>
				<view class="headerBoxText" v-if="orderDetail.orderItemList[0].commentTime">
					交易完成
				</view>
				<view class="headerBoxText" v-else>
					商家期待您对商品反馈哦
				</view>
				<view class="headerBoxThree" v-if="orderDetail.orderItemList.length===1 && !orderDetail.orderItemList[0].commentTime" @click="toEvaluate(orderDetail,1)">
					立即评价
				</view>
				<view class="headerBoxThree" v-if="orderDetail.orderItemList.length===1 && orderDetail.orderItemList[0].commentTime" @click="LookEvaluate(orderDetail)">
					查看评价
				</view>
				<view class="headerBoxThree" v-if="orderDetail.orderItemList.length>1" @click="toEvaluate(orderDetail,0)">
					立即评价
				</view>
			</view>
			<view class="headerBox" v-else-if="orderDetail.status == 4">
				<view class="headerBoxOne">
					<view>
						<image src="@/static/evaluate/close.png" mode=""></image>
					</view>
					<view>
						已关闭
					</view>
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="content">
			<!-- 地址信息 -->
			<view class="addressBox">
				<!-- 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 -->
				<!-- 待收货,已完成 -->
				<view class="addressBoxOne" v-if="orderDetail.status == 1">
					<view class="img">
						<image src="@/static/order/icon_car.png" mode=""></image>
					</view>
					<view class="text" @click="lookLogistics(orderDetail)">
						<view>商品已下单，包裹正在等待收揽</view>
						<view>{{orderDetail.deliveryTime | dateFormat}}</view>
					</view>
					<view class="back">
						<image src="@/static/order/back1.png" mode=""></image>
					</view>
				</view>
				<view class="addressBoxOne" v-if="orderDetail.status == 2">
					<view class="img">
						<image src="@/static/order/icon_car.png" mode=""></image>
					</view>
					<view class="text" @click="lookLogistics(orderDetail)">
						<view>订单正在派送中，请保持电话畅通</view>
						<view>{{orderDetail.deliveryTime | dateFormat}}</view>
					</view>
					<view class="back">
						<image src="@/static/order/back1.png" mode=""></image>
					</view>
				</view>
				<view class="addressBoxOne" v-if="orderDetail.status == 3">
					<view class="img">
						<image src="@/static/order/icon_car.png" mode=""></image>
					</view>
					<view class="text" @click="lookLogistics(orderDetail)">
						<view>订单已由本人签收</view>
						<view>{{orderDetail.receiveTime | dateFormat}}</view>
					</view>
					<view class="back">
						<image src="@/static/order/back1.png" mode=""></image>
					</view>
				</view>
				<view class="addressBoxTwo">
					<view class="img">
						<image src="@/static/order/icon_address.png" mode=""></image>
					</view>
					<view class="text" v-if="orderDetail.status==0" @click="editAddress">
						<view>
							<text>{{orderDetail.receiverName}}</text>
							<text>{{orderDetail.receiverPhone}}</text>
						</view>
						<view>{{orderDetail.receiverDetailAddress}}</view>
					</view>
					<view class="text" v-else>
						<view>
							<text>{{orderDetail.receiverName}}</text>
							<text>{{orderDetail.receiverPhone}}</text>
						</view>
						<view>{{orderDetail.receiverDetailAddress}}</view>
					</view>
				</view>
			</view>
			<!-- 订单商品 -->
			<view class="orderShop">
				<view class="goodcart">
					<view class="g-header" @click="toShop(orderDetail.shopInfo.shopNum)">
						<image class="logo" :src="getImage(orderDetail.shopInfo.shopLogo)" mode=""></image>
						<text class="name">{{orderDetail.shopInfo.shopName}}</text>
					</view>
					<!-- 商品列表 -->
					<view class="g-item" v-for="(sitem,j) in orderDetail.orderItemList" v-if="sitem.status != 1" :key="j" :class="{'active':j != shopList.length }">
						<image :src="getImage(sitem.productPic)" @click="toProductDetail(sitem)"></image>
						<view class="right">
							<text class="title" @click="toProductDetail(sitem)">{{sitem.productName | formatPorductName}}</text>
							<text class="spec" v-if="!sitem.flashPromotionId" @click="toProductDetail(sitem)">{{sitem.productAttr | specText}}</text>
							<view style="width:100%;display: flex;align-items: center;font-weight: bold;" v-if="sitem.flashPromotionId">
								<view style="width:70%;">
									<text class="spec" @click="toProductDetail(sitem)">{{sitem.productAttr | specText}} </text>
								</view>
								<view style="width:30%;">
									<text style="font-size:24rpx;color:#db2929;margin-left: 45%;">活动</text>
								</view>
							</view>
							<view class="price-box">
								<text class="price">￥{{sitem.productPrice}}</text>
								<text class="number">x {{sitem.productQuantity}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 订单价格 -->
			<view class="orderPrice">
					<view>
						<text>商品总价</text>
						<text>￥{{orderDetail.totalAmount}}</text>
					</view>
					<view>
						<text>运费</text>
						<text class="active">￥{{orderDetail.freightAmount}}</text>
					</view>
					<view>
						<text>优惠</text>
						<text class="active1">￥{{orderDetail.couponAmount}}</text>
					</view>
					<view>
						<text>实付款</text>
						<text class="active2">￥{{orderDetail.payAmount}}</text>
					</view>
					<!-- <text :class="{active:item.name === '运费',active1:item.name === '优惠',active2:item.name === '实付款'}">{{item.price}}</text> -->
			</view>
			<!-- 订单信息 -->
			<view class="orderNews">
				<text>订单信息</text>
				<view class="orderNewsOne" >
					<view class="orderNewsOneRows">
						<view>订单备注:</view>
						<view>{{orderDetail.note}}</view>
					</view>
					<view class="orderNewsOneRows">
						<view>订单编号:</view>
						<view>{{orderDetail.orderSn}}</view>
						<view class="copy" @click="copy(orderDetail.orderSn)">复制</view>
					</view>
					<view class="orderNewsOneRows">
						<view>创建时间:</view>
						<view>{{orderDetail.createTime | dateFormat}}</view>
					</view>
				</view>
				<!-- 待收货，已完成 -->
				<view class="orderNewsTwo" v-if="orderDetail.status == 1 || orderDetail.status == 2 
				|| orderDetail.status == 3 ">
					<view class="orderNewsTwoRows">
						<view>支付方式:</view>
						<view>{{orderDetail.payType | payTypeFormat}}</view>
					</view>
					<view class="orderNewsTwoRows">
						<view>支付时间:</view>
						<view>{{orderDetail.paymentTime | dateFormat}}</view>
					</view>
				</view>
				<view class="orderNewsThree">
					<view class="orderNewsThreeRows" v-if="orderDetail.status==2 || orderDetail.status == 1 
					 || orderDetail.status==3 ">
						<view>发货时间:</view>
						<view>{{orderDetail.deliveryTime | dateFormat}}</view>
					</view>
					<view class="orderNewsThreeRows" v-if="orderDetail.status==3 ">
						<view>收货时间:</view>
						<view>{{orderDetail.receiveTime | dateFormat}}</view>
					</view>
				</view>
				<view class="kefu" @click="contactCustomerService(orderDetail)">
					<view class="kefuIcon">
						<image src="@/static/order/icon_kefu.png" mode=""></image>
					</view>
					<view class="kefuText">
						联系客服
					</view>
				</view>
			</view>
		</view> 
		<!-- 底部 -->
		<view class="bottom">
			<view v-if="orderDetail.status == 1 || orderDetail.status == 2" @click="lookLogistics(orderDetail)">
				查看物流
			</view>
			<view v-if="orderDetail.status == 2" @click="confirmReceiveOrder(orderDetail)">
				确认收货
			</view>
			<view v-if="orderDetail.status == 0" @click="cancelOrder(orderDetail)">
				取消订单
			</view>
			<view v-if="orderDetail.status == 0" @click="payOrder(orderDetail)">
				立即付款
        	</view>
			<view v-if="orderDetail.status == 3" @click="applyAfterSale(orderDetail)">
				申请售后
			</view>
			<!-- <view v-if="orderDetail.status == 3" @click="buyAgain(orderDetail)">
				再次购买
			</view> -->
			<view v-if="orderDetail.status == 4" @click="deleteOrder(orderDetail)">
				删除订单
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import * as OrderReq from '../../api/Order.js'
	import {getImgUrl} from '../../util/common.js'
	import {formatDate} from '../../util/date.js'
	
	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return {
				orderDetail:{},
				remaining:'',//显示剩余时间
				remainingd:'',//数据返回时间秒
				static: 2,
				shopList: [{list:[1,2]}],
				priceList:[
					{
						name:'商品总价',
						price:'￥2598'
					},
					{
						name:'运费',
						price:'￥0.00'
					},
					{
						name:'优惠',
						price:'￥0.00'
					},
					{
						name:'实付款',
						price:'￥2598'
					}
				],
				orderNewsList:[
					{
						name:'订单备注',
						text:'需要礼盒包装'
					},
					{
						name:'订单编号',
						text:'54112018053051227'
					},
					{
						name:'创建时间',
						text:'2020.08.28 13:14:00'
					}
				],
				payList:[
					{
						name:'支付方式',
						text:'支付宝'
					},
					{
						name:'支付时间',
						text:'2020.08.28 13:14:16'
					}
				],
				goodLst:[
					{
						name:'发货时间',
						text:'2020.08.28 16:22:16',
					},
					{
						name:'收货时间',
						text:'2020.08.28 16:22:16',
						show:false
					}
				]
			};
		},
		async onLoad(options) {
			uni.showLoading(); //数据加载中
			let id = options.id;
			var _self = this;
			await OrderReq.orderDelteil(id).then(res=>{
				_self.orderDetail = res.data;
				if(res.data.status==0){
					//订单超时总时间
					var countDown = _self.orderDetail.dictValue;
					if(countDown <= 0 ){
						//调用取消订单方法
						OrderReq.cancelOrder({"orderId": _self.orderDetail.id}).then(res=>{
							if(res.code == 200){
								_self.orderDetail.status = 4;
							}
						})
					}else{
						_self.remainingd = countDown;
						_self.timer();//执行一次倒计时，因为进入页面有等待
						setInterval(function() {
							_self.timer();
						}, 1000)
					}
				}
				uni.hideLoading();
			})
		},
		filters: {
			//格式化sku
			specText(val) {
				let specValArray = []; 
				let spec = JSON.parse(val);
				spec.forEach(d => {
					specValArray.push(d.key + ":" +d.value);
				})
				return specValArray.join(" ");
			},
			//格式化支付类型
			payTypeFormat(type){
				if(0 == type){
					return "未支付";
				}else if(1 == type){
					return "支付宝";
				}else if(2 == type){
					return "微信";
				}else{
					return "";
				}
			},
			//格式化时间
			dateFormat(time){
				/* if(this.orderDetail.status==1){
					return "未发货";
				} */
				if(!time){
					return "";
				}
				let date = new Date(time);
				return formatDate(date,"yyyy-MM-dd hh:mm:ss");
			},
			//商品名称长度大于18时，部分展示
			formatPorductName(item){
				if(item != null && item.length > 16){
					return item.substring(0,16)+"...";
				}else{
					return item;
				}
			}
		},
		methods:{
			//倒计时计时器
			timer: function() {
				var time = this.remainingd;
				if (time <= 0) {
					this.remaining = "已过期";
				} else {
					var ddf = this.countDown(time); //格式化过后的时间
					this.remaining = ddf;
					//当前时间减去时间
					time = time - 1;
					this.remainingd = time;
				}
 
			},
			//复制到剪贴板
			copy(value){
				uni.setClipboardData({
					data:value,
					success:function(data){
						this.$api.msg("复制成功！")
					}
				})
			},
			//得到的秒换算成时分秒
			countDown: function(time) { 
				var h = parseInt(time / (60 * 60));
				var m = parseInt((time % (60 * 60)) / 60);
				var s = (time % (60 * 60)) % 60;
				return '还剩 '+h+"时 "+m+"分 "+s+"秒";
			},
			//格式化图片
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			//后退
			backPage(){
				uni.navigateBack();
			},
			//查看物流
			lookLogistics(item){
				uni.navigateTo({
					url:"../logisticsDetails/index?id="+item.id
				})
			},
			//地址修改
			editAddress(){
				console.log("地址修改");
			},
			//申请售后
			applyAfterSale(item){
				console.log("申请售后");
			},
			//联系客服
			contactCustomerService(item){
				uni.makePhoneCall({
					phoneNumber: "'"+item.shopInfo.customerTel+"'",
				});
			},
			//进入店铺界面
			toShop(shopNum){
				uni.navigateTo({
					url: '/pages/shop/index?shopNum=' + shopNum
				});
			},
			//查看评价详情
			LookEvaluate(item){
				uni.navigateTo({
					url: '/pages/evaluate/detail?goodsId=' + item.orderItemList[0].productId + "&orderId=" +item.id
				});
			},
			//评价跳转
			toEvaluate(item,status){
				if(status==1){
					uni.navigateTo({
						url: '/pages/evaluate/addEvaluate?goodsId=' + item.orderItemList[0].productId + "&orderId=" +item.id
					});
				}else{
					uni.navigateTo({
						url: '/pages/order/order?state=dpj'
					});
				}
				
			},
			//订单支付
			payOrder(item){
				uni.showLoading({
					title: '正在处理中'
				})
				const that = this;
				OrderReq.placeAnOrderValidate({"orderId":item.id}).then(res=>{
					if(res.code==200){
						OrderReq.prePayOrder({"orderSn":item.orderBatchNum}).then(res => {
							if (res.code == 200) {
								//跳转支付页面
								uni.navigateTo({
									url: '/pages/money/pay?orderSn=' + res.data
								});
							}
						})
					}else{
						this.$api.msg(res.message)
					}
				})
				uni.hideLoading();
			},
			//订单取消
			cancelOrder(item){
				uni.showModal({
					title: '取消订单提示',
					content: '确认要取消该订单嘛？',
					cancelText: '我再想想',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在处理中'
							})
							const that = this;
							OrderReq.cancelUserOrder({"orderId": item.id}).then(res => {
								if(res.code == 200) {
									//订单状态 修改为 已关闭
									that.orderDetail.status=4;
									that.$api.msg("订单取消成功");
								}
								uni.hideLoading();
							});
						} 
					}
				});
			},
			//删除订单
			deleteOrder(item){
				uni.showModal({
					title: '删除订单提示',
					content: '确认要删除该订单嘛？',
					cancelText: '我再想想',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在处理中'
							})
							const that = this;
							OrderReq.deleteOrder({"orderId": item.id}).then(res => {
								if(res.code == 200) {
									that.$api.msg("订单删除成功");
								}
								uni.hideLoading();
								//ajax
								uni.navigateTo({
								    url: '/pages/order/order'
								});
							});
						} 
					}
				});
			},
			//确认收货
			confirmReceiveOrder(item){
				uni.showModal({
					title: '确认收货提示',
					content: '确认已经收到商品了嘛？',
					cancelText: '还没有',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在处理中'
							})
							const that = this;
							OrderReq.confirmReceiveOrder({"orderId": item.id}).then(res => {
								if(res.code == 200) {
									//订单状态 修改为 已完成
									that.orderDetail.status=3;
									that.$api.msg("订单确认收货成功");
								}
								uni.hideLoading();
							});
						} 
					}
				});
			},
			//查看商品详情
			toProductDetail(product){
				if(product.flashPromotionId){
					uni.navigateTo({
						url: '/pages/product/product?id=' + product.flashPromotionId+'&flashId='+ 1
					});
				}else{
					uni.navigateTo({
						url: '/pages/product/product?id=' + productId
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #f8f8f8;
		padding-bottom: 208rpx;
		font-family: PingFang-SC-Medium;
	}

	image {
		width: 100%;
		height: 100%;
	}

	.orderDetails {

		// 顶部
		.header {
			position: relative;
			height: 353rpx;

			.headerBack {
				width: 20rpx;
				height: 34rpx;
				position: absolute;
				top: 67rpx;
				left: 30rpx;
				z-index: 100;
			}

			.headerImg {
				position: absolute;
				top: 0;
				width: 750rpx;
				height: 353rpx;
			}

			.headerBox {
				width: 489rpx;
				height: 185rpx;
				position: absolute;
				z-index: 100;
				top: 131rpx;
				left: 131rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.headerBoxOne {
					display: flex;
					align-items: center;

					view {
						&:first-child {
							width: 38rpx;
							height: 38rpx;
						}

						&:last-child {
							margin-left: 19rpx;
							font-size: 40rpx;
							font-weight: bold;
							color: #313131;
						}
					}
				}

				.headerBoxTwo {
					margin-top: 30rpx;
					width: 489rpx;
					font-size: 24rpx;
					color: #313131;
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						&:first-child {
							font-size: 32rpx;

							&::before {
								content: "需付款:￥";
								font-size: 24rpx;
								color: #313131;
							}

							&::after {
								font-size: 24rpx;
								color: #313131;
							}
						}
					}
				}

				.headerBoxThree {
					margin-top: 30rpx;
					width: 142rpx;
					height: 48rpx;
					background-image: linear-gradient(0deg, #ffecc7 0%, #fff3dd 100%);
					box-shadow: 0rpx 3rpx 6rpx 0rpx rgba(202, 163, 89, 0.52);
					border-radius: 24rpx;
					font-size: 24rpx;
					color: #313131;
					text-align: center;
					line-height: 48rpx;
				}

				.headerBoxFour {
					font-size: 24rpx;
					color: #313131;
					margin-top: 37rpx;
				}

				.headerBoxText {
					margin-top: 30rpx;
					width: 262rpx;
					font-size: 24rpx;
					color: #313131;
				}
			}
		}
		// 内容
		.content {
			.addressBox {
				width: 750rpx;
				// height: 287rpx;
				background-color: #ffffff;
				border-radius: 20rpx 20rpx 0rpx 0rpx;

				.addressBoxOne {
					height: 137rpx;
					width: 750rpx;
					padding: 0 30rpx;
					display: flex;
					align-items: center;

					.img {
						width: 45rpx;
						height: 30rpx;
					}

					.text {
						margin-left: 38rpx;
						height: 63rpx;
						flex: 1;

						view {
							font-size: 24rpx;

							&:first-child {
								font-weight: bold;
								color: #313131;
							}

							&:last-child {
								margin-top: 21rpx;
							}
						}
					}

					.back {
						width: 12rpx;
						height: 21rpx;
					}
				}

				.addressBoxTwo {
					height: 150rpx;
					width: 750rpx;
					padding: 0 30rpx;
					display: flex;
					align-items: center;

					.img {
						width: 30rpx;
						height: 40rpx;
					}

					.text {
						margin-left: 48rpx;

						view {
							font-size: 24rpx;

							&:first-child {
								font-weight: bold;
								color: #313131;

								text {
									&:first-child {
										margin-right: 40rpx;
									}
								}
							}

							&:last-child {
								margin-top: 21rpx;
								width: 569rpx;
								color: #999999;
								line-height: 36rpx;
							}
						}
					}
				}
			}

			.orderShop {
				margin-top: 19rpx;
				background: #fff;
				padding-bottom: 1px;
				overflow: hidden;

				.g-header {
					display: flex;
					align-items: center;
					// height: 84rpx;
					margin: 24rpx 28rpx 6rpx 30rpx;
					position: relative;

					.logo {
						display: block;
						width: 36rpx;
						height: 36rpx;
						background-color: red;
					}

					.name {
						font-size: 24rpx;
						color: #333333;
						font-weight: bold;
						margin-left: 16rpx;
					}
				}


				.g-item {
					display: flex;
					width: 692rpx;
					height: 212rpx;
					margin: 30rpx 28rpx 0rpx 30rpx;
					position: relative;

					image {
						flex-shrink: 0;
						display: block;
						width: 180rpx;
						height: 180rpx;
						border-radius: 5rpx;
						background: #eee;
					}

					.right {
						flex: 1;
						padding-left: 17rpx;
						overflow: hidden;
					}

					.title {
						width: 495rpx;
						// height: 25rpx;
						font-size: 28rpx;
						font-weight: bold;
						margin: 14rpx 0 21rpx 0;
						color: #000;
					}

					.spec {
						display: block;
						margin-top: 21rpx;
						font-size: 24rpx;
						color: #999999;
					}

					.price-box {
						display: flex;
						align-items: center;
						font-weight: bold;
						margin-top: 34rpx;

						.price {
							font-size: 28rpx;
							color: #313131;
						}

						.number {
							font-size: 20rpx;
							margin-left: 342rpx;
						}
					}

					.step-box {
						position: relative;
					}
				}

				.active {
					&::after {
						content: "";
						position: absolute;
						width: 702rpx;
						height: 1rpx;
						background-color: #f5f5f5;
						bottom: 0;
					}
				}

				.imgShadow {
					width: 180rpx;
					height: 180rpx;
					border-radius: 5rpx;
					background: rgba(0, 0, 0, .3);
					position: absolute;
					top: 0;
					display: flex;
					align-items: center;
					justify-content: center;

					view {
						width: 76rpx;
						height: 76rpx;
						border-radius: 76rpx;
						background: rgba(0, 0, 0, .5);
						line-height: 76rpx;
						text-align: center;
						font-size: 28rpx;
						color: #ffffff;
					}
				}

			}
			
			.orderPrice{
				width: 750rpx;
				 height: 252rpx;
				 background-color: #ffffff;
				 margin-top: 20rpx;
				 padding: 0 30rpx;
				 view{
					 height: 63rpx;
					 font-size: 24rpx;
					 display: flex;
					 align-items: center;
					 justify-content: space-between;
					 color: #313131;
				 }
				 .active{
					color: #bbbbbb;
				 }
				 .active1{
				 	color: #bbbbbb;
					&::before{
						content: "-";
					}
				 }
				 .active2{
				 	font-size: 32rpx;
				 }
			}
			
			.orderNews{
				margin-top: 20rpx;
				width: 750rpx;
				background-color: #ffffff;
				padding: 0 30rpx;
				overflow: hidden;
				text{
					color: #313131;
					font-size: 28rpx;
					display: block;
					margin: 30rpx 0 40rpx 0;
				}
				.orderNewsOne{
					.orderNewsOneRows{
						display: flex;
						font-size: 24rpx;
						height: 23rpx;
						margin-bottom: 27rpx;
						view{
							&:first-child{
								color: #666666;
								margin-right: 27rpx;
							}
							&:nth-child(2){
								color: #313131;
							}
						}
					}
					.copy{
						width: 64rpx;
						height: 32rpx;
						border-radius: 16rpx;
						border: solid 1rpx #db2929;
						font-size: 20rpx;
						color: #db2929;
						line-height: 32rpx;
						text-align: center;
						margin-left: 23rpx;
					}
				}
				.orderNewsTwo,.orderNewsThree{
					margin-top:40rpx;
					.orderNewsTwoRows,.orderNewsThreeRows{
						margin-bottom: 27rpx;
						display: flex;
						font-size: 24rpx;
						height: 23rpx;
						width: 750rpx;
						view{
							&:first-child{
								color: #666666;
								margin-right: 27rpx;
							}
							&:last-child{
								color: #313131;
							}
						}
					}
				}
			}
			
			.kefu{
				width: 160rpx;
				height: 36rpx;
				margin: 36rpx auto 29rpx;
				display: flex;
				align-items: center;
				.kefuIcon{
					width: 36rpx;
					height: 36rpx;
					margin-right: 7rpx;
				}
				.kefuText{
					font-size: 24rpx;
					font-weight: bold;
					color: #333333;
					height: 23rpx;
				}
			}
			
		}
		// 底部
		.bottom{
			position: fixed;
			bottom: 0;
			width: 749rpx;
			height: 108rpx;
			background-color: #ffffff;
			box-shadow: 0rpx -3rpx 20rpx 0rpx rgba(153, 153, 153, 0.08);
			display: flex;
			align-items: center;
			justify-content: flex-end;
			view{
				line-height: 64rpx;
				text-align: center;
				width: 173rpx;
				height: 64rpx;
				border-radius: 32rpx;
				font-size: 28rpx;
				&:first-child{
					border: solid 1rpx #999999;
					color: #666666;
				}
				&:last-child{
					margin: 0 25rpx 0 39rpx ;
					border: solid 1rpx #db2929;
					color: #db2929;
				}
			}
		}
	}
</style>
