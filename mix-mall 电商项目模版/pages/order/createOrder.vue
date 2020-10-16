<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content">
				<image src="../../static/line.png" mode="" class="line"></image>
				<view class="cen">
					<view class="top">
						<text class="name">{{addressData.name}}</text>
						<text class="mobile">{{addressData.phoneNumber}}</text>
					</view>
					<text class="address">{{addressData.detailAddress}}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</navigator>
		<!-- 购物车商品 -->
		<view class="goods-section">
			<view class="goodcart" v-for="(item,i) in shopList" :key="i">
				<view class="g-header">
					<image class="logo" :src="getImage(item.shopLogo)"></image>
					<text class="name">{{item.shopName}}</text>
				</view>
				<!-- 商品列表 -->
				<view class="g-item" v-for="(sitem,j) in shopList[i].carPromoItemList" :key="j" :class="{'active':j != shopList[i].carPromoItemList - 1 }">
					<image :src="getImage(sitem.productPic)"></image>
					<view class="right">
						<text class="title">{{sitem.productName | productNameInterception}} </text>
						<text class="spec" v-if="!flashId && !sitem.flashPromotionId">{{sitem.productSpec | productNameInterception}} </text>
								<view style="width:100%;display: flex;align-items: center;font-weight: bold;" v-if="flashId || sitem.flashPromotionId">
							<view style="width:70%;">
								<text class="spec">{{sitem.productSpec | productNameInterception}} </text>
							</view>
							<view style="width:30%;">
								<text style="font-size:24rpx;color:#db2929;margin-left: 45%;">活动</text>
							</view>
						</view>
						<!-- <text v-if="flashId" style="font-size:18rpx;color:red;">活动</text> -->
						<view class="price-box">
							<text class="price">￥{{sitem.price}} </text>
							<text class="number">x {{sitem.quantity}}</text>
						</view>
					</view>
				</view>
				<!-- 金额明细 -->
				<view class="yt-list">
					<view class="yt-list-cell">
						<text class="cell-tit clamp">配送方式</text>
						<text class="cell-tip">物流配送</text>
					</view>
					<view class="yt-list-cell">
						<text class="cell-tit clamp">运费</text>
						<text class="cell-tip">￥{{item.freightTemplatePrice|ifFreightAmount}}</text>
					</view>
					<view class="yt-list-cell desc-cell">
						<text class="cell-tit clamp">备注</text>
						<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
					</view>
					<view class="yt-list-cell">
						<text class="cell-tit clamp">共{{item.quantityCount}}件</text>
						<text class="price">小计:￥{{item.goodsPriceCount}} </text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="goods-section">
			<view class="g-box">以下商品所选地区暂时无货</view>
			<view class="goodcart" v-for="(item,i) in shopList" :key="i">
				<view class="g-header">
					<image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>
					<text class="name">西城小店铺</text>
				</view> -->
		<!-- 商品列表 -->
		<!-- <view> 
					<view class="g-item" v-for="(sitem,j) in shopList" :key="j" :class="{'active':j != shopList.length }">
						<view style="position: relative;">
							<image src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=756705744,3505936868&fm=11&gp=0.jpg"></image>
							<view class="imgShadow">
								<view>
									无货
								</view>
							</view>
						</view>
						<view class="right">
							<text class="title">古黛妃 短袖t恤女夏装2019新款</text>
							<text class="spec">春装款 L</text>
							<view class="price-box">
								<text class="price">无货</text>
								<text class="number">x 1</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
 -->

		<!-- 优惠明细 -->
		<view class="yt-list">

			<!-- <view class="yt-list-cell" @click="toggleMask('show')">
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell">
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view> -->
		</view>


		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text class="price-tip">共{{quantityTotal}}件 ￥</text>
				<text class="price">{{payAmountNum}} </text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>

		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>

						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {getAddressList} from '../../api/Address';
	import {prePayOrder} from '../../api/Order';
	import {getOrderList,getGenerateOrder,getFreightTemplate,getGenerateConfirmOrderByProId,getGenerateOrderBySkuId} from '../../api/CreateOrder';
	import {getImgUrl} from '../../util/common.js'
	export default {
		data() {
			return {
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				couponList: [{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				addressData: {},
				shopList: [],
				cartIds: [],
				productSpec: '',
				calcAmount: {},
				payAmountNum:0,
				sourceType: '',
				orderParam: [],
				addressId: '',
				skuId: '',
				buyNumber: 0,
				flashId:'',
				quantityTotal: 0,
				orderParamList: [],
				feePriceTotal:0,
				freightPrice:0,
				//确认订单使用得计算运费商品集合--直接确认订单
				orderFeePriceParamList:[],
				//确认订单使用得计算运费商品集合--购物车确认订单
				orderFeePriceCarParamList:[]
			}
		},
		filters: {
			//商品名字截取
			productNameInterception(value) {
				if (!value) return ''
				if (value.length > 16) {
					return value.slice(0, 16) + '...'
				}
				return value
			},
			//判断是否免费
			ifFreightAmount(value) {

				console.info("value=====",value);
				if (value == 0 ) {
					return "0"
				}else if(typeof  value==='undefined'){
					return "0"
				}
				else {
					return   value;
				}
			}
		},
		onLoad(option) {
			//区分购物车商品和直接购买商品
			this.sourceType = option.sourceType;
			var sourceType = option.sourceType;
			if (sourceType == "goodsCar") {
				//商品数据
				this.cartIds = option.cartIds.split(',');
			}
			if (sourceType == "goods") {
				this.buyNumber = option.buyNumber;
				this.skuId = option.skuId;
				this.flashId = option.flashId;
			}
			this.loadData(option.sourceType);
		},
		methods: {
			//图片链接
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//根据购物车信息生成确认单信息
			async loadData(sourceType) {
				const that = this;
				//获取用户收货地址
				getAddressList().then(res => {
					if (res.code == 200) {
						let addressList = res.data;
						var type=0;
						for (var i = 0; i < addressList.length; i++) {
							var status = addressList[i].defaultStatus;
							if (status == 1) {
								type=status;
								that.addressData = addressList[i]
								that.addressId = addressList[i].id;
							}
						}
						if(type!=1){
							that.addressData = addressList[0]
							that.addressId = addressList[0].id;
						}
					}
				});
				//console.info("sthat.addressData",JSON.stringify(that.addressData))
				//调用购物车确认订单
				if (sourceType == 'goodsCar') {
					//获取商品信息列表
					getOrderList({
						"cartIds": this.cartIds
					}).then(res => {
						if (res.code == 200) {
							 this.calcAmount = res.data.calcAmount;
							 this.payAmountNum = this.calcAmount.payAmount;
							let cartPromotionItemList = res.data.cartPromotionItemList;
							var quantityTotal = 0;
							var orderParamList = [];
							for (var j = 0; j < cartPromotionItemList.length; j++) {
								let carPromoItemList = cartPromotionItemList[j].carPromoItemList;
								var quantityCount = 0;
								var goodsPriceCount = 0;
								for (var k = 0; k < cartPromotionItemList[j].carPromoItemList.length; k++) {
									var cartPromParam = {
										"goodsCount": cartPromotionItemList[j].carPromoItemList[k].quantity,
										"goodsNum": cartPromotionItemList[j].carPromoItemList[k].productId
									}
									quantityCount += cartPromotionItemList[j].carPromoItemList[k].quantity;
									goodsPriceCount += cartPromotionItemList[j].carPromoItemList[k].price * cartPromotionItemList[j].carPromoItemList[
										k].quantity;
									orderParamList.push(cartPromParam);
									let productAttr = JSON.parse(cartPromotionItemList[j].carPromoItemList[k].productAttr);
									let productSpec = '';
									for (var m = 0; m < productAttr.length; m++) {
										productSpec += " " + productAttr[m].key + ":" + productAttr[m].value;
									}
									cartPromotionItemList[j].carPromoItemList[k].productSpec = productSpec;
								}
								cartPromotionItemList[j].quantityCount = quantityCount;
								cartPromotionItemList[j].goodsPriceCount = goodsPriceCount;
								quantityTotal += cartPromotionItemList[j].quantityCount;
							}
							this.quantityTotal = quantityTotal;
							this.shopList = res.data.cartPromotionItemList;
							//调用运费
							this.orderFeePriceCarParamList=orderParamList;
							this.getFeePriceCount(that.addressData.id,orderParamList)
						}else{
							this.$api.msg(res.message)
						}
					});
				} else if (sourceType == 'goods') {
					//调用 根据商品信息生成确认单信息
					var param = {
						"count": this.buyNumber,
						"skuId": this.skuId,
						"flashId": this.flashId
					}
					getGenerateConfirmOrderByProId(param).then(res => {
						var orderParamList = [];
						if (res.code == 200) {
							 this.calcAmount = res.data.calcAmount;
							 this.payAmountNum = this.calcAmount.payAmount;
							let cartPromotionItemList = res.data.cartPromotionItemList;
							for (var j = 0; j < cartPromotionItemList.length; j++) {
								var quantityCount = 0;
								var quantityTotal = 0;
								var goodsPriceCount = 0;
								for (var k = 0; k < cartPromotionItemList[j].carPromoItemList.length; k++) {
									quantityCount += cartPromotionItemList[j].carPromoItemList[k].quantity;
									goodsPriceCount += cartPromotionItemList[j].carPromoItemList[k].price * cartPromotionItemList[j].carPromoItemList[k].quantity;
									orderParamList.push({
										"goodsCount": cartPromotionItemList[j].carPromoItemList[k].quantity,
										"goodsNum": cartPromotionItemList[j].carPromoItemList[k].productId
									});
									let productAttr = JSON.parse(cartPromotionItemList[j].carPromoItemList[k].productAttr);
									let productSpec = '';
									for (var m = 0; m < productAttr.length; m++) {
										productSpec += " " + productAttr[m].key + ":" + productAttr[m].value;
									}
									cartPromotionItemList[j].carPromoItemList[k].productSpec = productSpec;
								}
								//单个店铺总计件数
								cartPromotionItemList[j].quantityCount = quantityCount;
								//单个店铺小计
								cartPromotionItemList[j].goodsPriceCount = goodsPriceCount;
								//总计件数
								quantityTotal += cartPromotionItemList[j].quantityCount;
							}
							this.quantityTotal = quantityTotal;
							this.shopList = res.data.cartPromotionItemList;
							this.orderFeePriceParamList=orderParamList;
							//调用运费
							this.getFeePriceCount(that.addressData.id,orderParamList)
						}else{
							this.$api.msg(res.message)
						}
					});
				}
			},
			//调用运费计算
			getFeePriceCount(id,orderParamList) {
				const that=this;
				//封装数据
				var param = {
					"addrId": id,
					"orderParam": orderParamList
				}
				getFreightTemplate(param).then(res => {
					if (res.code == 200) {
						 var calcAmountPayCount=0;
						for (var i = 0; i < res.data.length; i++) {
							var feePrice= res.data[i].feePrice;
							var shopNumYf=res.data[i].shopNum;
							for(var j=0;j<this.shopList.length;j++){
								var shopNum=this.shopList[j].shopNum;
								if(shopNumYf==shopNum){
									//运费
									this.shopList[j].freightTemplatePrice=feePrice;
									//小计
									this.shopList[j].goodsPriceCount=this.shopList[j].goodsPriceCount+feePrice;
									calcAmountPayCount+=feePrice;
								}
							}
						}
						//运费
						this.freightPrice=calcAmountPayCount;
						//总计
						this.calcAmount.payAmount=this.calcAmount.payAmount+calcAmountPayCount;
						this.payAmountNum = this.calcAmount.payAmount;
					}
				});
			},
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			submit() {
				//区分购物车还是直接购买商品
				if(this.sourceType=='goods'){
					//根据商品信息生成订单
					var param = {
						"addrId":this.addressData.id,
						"memberReceiveAddressId": this.addressData.id,
						"skuId": this.skuId,
						"count": this.buyNumber,
						"flashId": this.flashId,
						"freightPrice": this.freightPrice,
						"orderParam":this.orderFeePriceParamList
					}
					  getGenerateOrderBySkuId(param).then(res => {
						if (res.code == 200 && res.data) {
							this.calcAmount = res.data.orderResult;
							this.payAmountNum = this.calcAmount.payAmount;
							//调用支付
                            prePayOrder({"orderSn":res.data.orderResult[0].orderBatchNum}).then(res => {
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
					});

				}
				if(this.sourceType=='goodsCar'){
					//根据购物车信息生成订单
					var param = {
						"addrId": this.addressData.id,
						"memberReceiveAddressId": this.addressData.id,
						"cartIds": this.cartIds,
						"flashId": this.flashId,
						"freightPrice": this.freightPrice,
						"orderParam":this.orderFeePriceCarParamList
					}
					  getGenerateOrder(param).then(res => {
						if (res.code == 200 && res.data) {
							this.calcAmount = res.data.orderResult;
							this.payAmountNum = this.calcAmount.payAmount;
							//调用支付
							prePayOrder({"orderSn":res.data.orderResult[0].orderBatchNum}).then(res => {
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
					});
				}
			},
			stopPrevent() {}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f8f8f8;
		padding-bottom: 173rpx;
		font-family: PingFang-SC-Medium;
	}

	.address-section {
		margin-top: 20rpx;
		height: 170rpx;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90rpx;
			color: #888;
			font-size: 44rpx;
		}

		.cen {
			margin-left: 30rpx;
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28rpx;
		}

		.top {
			font-size: 36rpx;
			font-weight: bold;
			color: #232323;
		}

		.name {
			margin-right: 40rpx;
		}

		.address {
			margin-top: 22rpx;
			font-size: 24rpx;
			color: #666666;
			line-height: 36rpx;
		}

		.icon-you {
			font-size: 32rpx;
			color: $font-color-light;
			margin-right: 30rpx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5rpx;
		}

		.line {
			width: 10rpx;
			height: 170rpx;
		}
	}

	.goods-section {
		margin-top: 16rpx;
		background: #fff;
		padding-bottom: 1px;
		overflow: hidden;

		.g-header {
			display: flex;
			align-items: center;
			// height: 84rpx;
			margin: 24rpx 28rpx 6rpx 30rpx;
			position: relative;
		}

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

		.g-box {
			width: 750rpx;
			height: 60rpx;
			background-color: #fff3bd;
			line-height: 60rpx;
			padding-left: 34rpx;
			font-size: 28rpx;
			color: #f46264;
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
				margin-top: 4rpx;

				.price {
					font-size: 36rpx;
					color: #db2929;
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

	.yt-list {
		margin-top: 16rpx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40rpx;
		line-height: 70rpx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30rpx;
		}

		.price {
			font-size: 26rpx;
			color: #db2929;
		}

		.cell-more {
			align-self: center;
			font-size: 24rpx;
			color: $font-color-light;
			margin-left: 8rpx;
			margin-right: -10rpx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26rpx;
			color: #333333;
			// margin-right: 10rpx ;
		}

		.cell-tip {
			font-size: 26rpx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90rpx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40rpx;
		margin-top: 16rpx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20rpx;
			line-height: 1;
			height: 110rpx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80rpx;
			font-size: 40rpx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80rpx;
			font-size: 40rpx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			font-size: 40rpx;
			color: $base-color;
		}

		.tit {
			font-size: 32rpx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 103rpx;
		justify-content: space-between;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-tip {
			font-size: 30rpx;
			color: #db2929;
			margin-left: 22rpx;
		}

		.price {
			font-size: 36rpx;
			color: #db2929;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 228rpx;
			height: 100%;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
			background-color: #db2929;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24rpx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120rpx;
			padding: 0 30rpx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100rpx;
		}

		.title {
			font-size: 32rpx;
			color: $font-color-dark;
			margin-bottom: 10rpx;
		}

		.time {
			font-size: 24rpx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			color: $font-color-base;
			height: 100rpx;
		}

		.price {
			font-size: 44rpx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34rpx;
			}
		}

		.tips {
			font-size: 24rpx;
			color: $font-color-light;
			line-height: 60rpx;
			padding-left: 30rpx;
		}

		.circle {
			position: absolute;
			left: -6rpx;
			bottom: -10rpx;
			z-index: 10;
			width: 20rpx;
			height: 20rpx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6rpx;
			}
		}
	}
</style>
