<!-- 购物车页面 -->
<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="empty === true" class="empty">
			<image src="/static/emptyCart.png" class="empty-img" mode="aspectFit"></image>
			<view class="empty-box">
				<view class="empty-tips">
					空空如也
				</view>
				<view class="empty-btn" @click="to_other" v-if="hasLogin">
					随便逛逛
				</view>
				<view v-else class="empty-btn">
					<view class="navigator" @click="navToLogin">去登陆></view>
				</view>
				
				<view class="empty-wares">
					<view class="wares-title">
						为你推荐
					</view>
					<view class="wares-box">
						<view v-for="(item, index) in tjGoodsList" :key="index" class="wares-box-list" @click="to_productDetail(item.id)">
							<view class="wares-box-img">
								<image :src="getImage(item.pic)"></image>
							</view>
							<view class="wares-box-tips">
								<view>{{item.name}}</view>
								<view>¥{{item.price}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			
		</view>
		<view v-else>
			<view class="cart-list">
				<uni-swipe-action>
					<view class="cart-shop" v-for="(item,i) in cartList" :key="i">
						<view class="cart-shopName-box">
							<view class="cart-img" @click="check('shop',item,i)">
								<image src="../../static/icon_nor.png" mode="" v-if="isCheckAll(item)"></image>
								<image src="../../static/icon_sel.png" mode="" v-else></image>
							</view>
							<view class="cart-img-shop">
								<image :src="getImage(item.shopLogo)" mode=""></image>
							</view>
							<view class="cart-shopName">
								{{item.shopName}}
							</view>
							<view class="cart-img-return">
								<image src="../../static/return.png" mode=""></image>
							</view>
						</view>
						<uni-swipe-action-item v-for="(catItem, j) in item.cartItemList" :right-options="options" :key="j" @change="swipeChange($event, j)"
							@click="swipeClick($event, i, j)" class="cart-shop-list">
							<view class="content-box">
								<view class="content-img" @click="check('item',item.shopName,j)">
									<image src="../../static/icon_nor.png" mode="" v-if="!catItem.checked"></image>
									<image src="../../static/icon_sel.png" mode="" v-else></image>
								</view>
								<view class="content-shop">
									<image :src="getImage(catItem.productPic)" mode=""></image>
								</view>
								<view class="content-desc">
									<view class="desc-shop">
										{{catItem.productName}} 
									</view>
									<view style="width:100%;display:flex;align-items: center;font-weight: bold;" class="desc-size">
										<view style="width:70%;">
											{{catItem.productAttr | getSkuInfo}}
										</view>
										<view style="width:30%;">
											<text v-if="catItem.flashPromotionId" style="font-size:24rpx;color:#db2929;margin-left:45%;">活动</text>
										</view>
									</view>
									<view class="desc-price">
										¥{{catItem.price}}
									</view>
									<view class="desc-num">
										<uni-number-box :value="catItem.quantity" :min="1"  v-on:change="changeReworkNumber($event,catItem)" />
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</view>
				</uni-swipe-action>
			</view>
			<!-- 底部结算栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image src="../../static/icon_nor.png" mode="" v-if="!ischeck"></image>
					<image src="../../static/icon_sel.png" mode="" v-else></image>
				</view>
				<view class="total-sel" @click="check('cunk')">
					全选
				</view>
				<view class="total-isEdit" v-if="isedit">
					<view class="total-btn" @click="toCheckedCollect">
						移入收藏夹
					</view>
					<view class="total-btn1" @click="delCheckedCart">
						删除
					</view>
				</view>
				<view class="total-box" v-if="!isedit">
					合计:¥{{total}}
				</view>
				<button type="primary" v-if="!isedit" class="no-border confirm-btn" @click="toComfirmOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	import {goodsCarList, delGoodsCar, updateQuantity, moveToCollect} from '../../api/GoodsCar'
	import {getProductByModuleConfig} from '../../api/GoodsModules'
	import {getImgUrl} from '../../util/common.js'
	export default {
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: true, //空白页现实  true|false
				cartList: [],
				tjGoodsList: [],
				waresList: [1, 2, 3, 4, 5, 6],
				ischeck: true,
				isedit: false,
				tjGoodsModuleNum: 'cart-recommend',  //购物车 推荐商品池编码
				options: [{
					text: '移入收藏',
					style: {
						backgroundColor: '#f38f3e'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#db2929'
					}
				}]
			};
		},
		onLoad() {
			if(this.hasLogin) {
				//加载购物车数据
				this.loadData(); 
			}
			
			//加载推荐商品列表
			this.getTjGoodsList();
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
				if(this.empty) {
					//加载推荐商品列表
					that.getTjGoodsList();
				}
			},
			
		},
		filters: {
			formatProductName(name){
				if (!name) return ''
				if (name.length > 14) {
					return name.slice(0, 14) + '...'
				}
				return name;
			},
			getSkuInfo(skuinfo) {
				var skustr = '';
				if(skuinfo) {
					try{
						var skuObj = JSON.parse(skuinfo);
						skuObj.forEach(item => {
							skustr += item.key + ': ' + item.value;
						})
					}catch(e){
					}
				}
				/* if (skustr.length > 16) {
					return skustr.slice(0, 16) + '...'
				}else{ */
					return skustr;
				//}
			}
		},
		computed: {
			...mapGetters(['hasLogin'])
		},
		methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			to_productDetail(productId) {
				uni.navigateTo({
					url: '/pages/product/product?id=' + productId
				})
			},
			//请求数据
			async loadData() {
				const that = this;
				console.log(this)
				goodsCarList().then(res => {
					if(res.code == 200) {
						that.tjGoodsModuleNum = res.data.tjGoodsModuleNum;
						let list = res.data.cartList;
						//默认选中
						let cartList = list.map(item => {
							item.checked = true;
							item.cartItemList.forEach(item1 => {
								item1.checked = true
							});
							return item;
						});
						that.cartList = cartList;
						that.calcTotal(); //计算总价
					}
				});
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				var to_url = encodeURI("/pages/cart/cart");
				uni.navigateTo({
					url: '/pages/public/login?to=' + to_url
				})
			},
			// 店铺全选，店铺回显
			isCheckAll(item){
				return item.cartItemList.some(item=>item.checked !== true)
			},
			// 更新选中的数量
			changeReworkNumber(value, catItem){
				 if(value == catItem.quantity){ //防止重复传送  
					return false;  
				}  
				//更新商品数量
				updateQuantity({"id": catItem.id, "quantity": value}).then(res => {
					if(res.code != 200) {
						this.$api.msg("商品数量更新失败了！");
					} else {
						catItem.quantity = value;
						this.calcTotal();
					}
				})
			},
			//选中状态处理
			check(type,name, index) {
				// console.log(type, name,index);
				const list = this.cartList;
				if (type === 'item') {
					list.forEach(item=>{
						if(item.shopName === name){
							item.cartItemList[index].checked = !item.cartItemList[index].checked
						}
					})
				} else if(type === 'shop'){
					list[index].cartItemList.forEach(item=>{
						item.checked = !item.checked
					})
				}else {
					const checked = !this.allChecked
					this.ischeck = !this.ischeck
					list.forEach(item => {
						item.checked = checked;
						item.cartItemList.forEach(item1=>{
							item1.checked = checked
						});
					})	
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//左滑购物车商品删除
			deleteCartItem(index, subIndex) {
				let shopCart = this.cartList[index];
				let cartItemList = shopCart.cartItemList;
				//购物车ID
				let cartItemId = cartItemList[subIndex].id;
				const that = this;
				//删除购物车商品
				delGoodsCar({"ids": cartItemId}).then(res => {
					if(res.code == 200) {
						that.cartList[index].cartItemList.splice(subIndex, 1);
						//校验是否删除当前店铺下最后一个商品
						for(var i = 0; i < that.cartList.length; i++) {
							let item = that.cartList[i];
							//店铺下商品列表
							let cartItemList = item.cartItemList;
							if(cartItemList.length == 0) {
								that.cartList.splice(i, 1);
							}
						}
						that.calcTotal();
					}
				})
			},
			//随便逛逛
			to_other() {
				//跳转至首页  路由跳转首页 不起作用 待优化
				location.href = "../../pages/index/index"
			},
			//左滑 移入收藏夹
			moveGoodsToCollect(index, subIndex) {
				let shopCart = this.cartList[index];
				let cartItemList = shopCart.cartItemList;
				//购物车ID
				let cartItemId = cartItemList[subIndex].id;
				const that = this;
				//删除购物车商品
				moveToCollect({"cartId": cartItemId}).then(res => {
					if(res.code == 200) {
						that.cartList[index].cartItemList.splice(subIndex, 1);
						//校验是否删除当前店铺下最后一个商品
						for(var i = 0; i < that.cartList.length; i++) {
							let item = that.cartList[i];
							//店铺下商品列表
							let cartItemList = item.cartItemList;
							if(cartItemList.length == 0) {
								that.cartList.splice(i, 1);
							}
						}
						that.calcTotal();
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					item.cartItemList.forEach(item1=>{
						if (item1.checked === true) {
							total += item1.price * item1.quantity;
						}
					})
					
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			}, 
			//创建订单
			toComfirmOrder() {
				var list = this.cartList;
				var cartIdArray = [];
				list.forEach(item => {
					item.cartItemList.forEach(goods => {
						if (goods.checked) {
							cartIdArray.push(goods.id)
						}
					})
				})
				if(cartIdArray.length == 0) {
					this.$api.msg("请先选择至少一个商品！")
					return;
				}
				//当前已选择的购物车商品信息
				var cartIds = cartIdArray.join(",");
				uni.navigateTo({
					url: `/pages/order/createOrder?cartIds=` + cartIds + '&sourceType=goodsCar'
				})
			},

			swipeChange(e, index) {
				console.log('返回：', e);
				// console.log('当前索引：', index);
			},
			swipeClick(e, index, subIndex) {
				close(subIndex)
				let {
					content
				} = e;
				if (content.text === '删除') {
					uni.showModal({
						title: '提示',
						content: '确认要从购物车中删除该商品嘛？',
						cancelText: '我再想想',
						success: res => {
							if (res.confirm) {
								this.deleteCartItem(index, subIndex);
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						}
					});
				} else if (content.text === '移入收藏') {
					this.moveGoodsToCollect(index, subIndex);
				} 
			},
			//获取商品推荐列表
			getTjGoodsList() {
				let tjGoodsModuleNum = this.tjGoodsModuleNum;
				getProductByModuleConfig({"position": tjGoodsModuleNum, "pageSize": 20}).then(res => {
					if(res.code == 200) {
						this.tjGoodsList = res.data.list;
					}
				});
			},
			//批量移入收藏
			toCheckedCollect() {
				let cartItemIds = [];
				let list = this.cartList;
				list.forEach(item => {
					item.cartItemList.forEach(item1 => {
						if (item1.checked === true) {
							cartItemIds.push(item1.id);
						}
					})
				})
				if(cartItemIds.length == 0) {
					this.$api.msg("请至少选择一条商品数据！");
					return;
				}
				var ids = cartItemIds.join(",");
				const that = this;
				moveToCollect({"cartId": ids}).then(res => {
					if(res.code == 200) {
						//删除对应购物车列表数据
						for(var i = 0; i < that.cartList.length; i++) {
							let item = that.cartList[i];
							//店铺下商品列表
							let cartItemList = item.cartItemList;
							let removeIndexs = [];
							for(var j = 0; j < cartItemList.length; j++) {
								if (cartItemList[j].checked === true) {
									removeIndexs.push(j);
								}
							}
							if(removeIndexs.length == cartItemList.length) {
								//用户已选择删除该店铺下所有商品
								//所以直接删除该店铺购物车数据
								that.cartList.splice(i, 1);
							} else {
								removeIndexs.forEach(index => {
									cartItemList.splice(index, 1);
								})
							}
						}
						that.calcTotal();
					}
				});
			},
			//批量删除
			delCheckedCart() {
				let cartItemIds = [];
				let list = this.cartList;
				list.forEach(item => {
					item.cartItemList.forEach(item1 => {
						if (item1.checked === true) {
							cartItemIds.push(item1.id);
						}
					})
				})
				if(cartItemIds.length == 0) {
					this.$api.msg("请至少选择一条商品数据！");
					return;
				}
				const that = this;
				uni.showModal({
					title: '提示',
					content: '确认要从购物车中删除已选定的商品嘛？',
					cancelText: '我再想想',
					success: res => {
						if (res.confirm) {
							var ids = cartItemIds.join(",");
							//删除购物车商品
							delGoodsCar({"ids": ids}).then(res => {
								if(res.code == 200) {
									//删除对应购物车列表数据
									for(var i = 0; i < that.cartList.length; i++) {
										let item = that.cartList[i];
										//店铺下商品列表
										let cartItemList = item.cartItemList;
										let removeIndexs = [];
										for(var j = 0; j < cartItemList.length; j++) {
											if (cartItemList[j].checked === true) {
												removeIndexs.push(j);
											}
										}
										if(removeIndexs.length == cartItemList.length) {
											//用户已选择删除该店铺下所有商品
											//所以直接删除该店铺购物车数据
											that.cartList.splice(i, 1);
										} else {
											removeIndexs.forEach(index => {
												cartItemList.splice(index, 1);
											})
										}
									}
									that.calcTotal();
								}
							})
						}
					}
				});
			}
		},
		onNavigationBarButtonTap: function(e) {
			let edit = document.querySelectorAll('.uni-page-head-btn .uni-btn-icon')[2]
			if (e.index === 1) {
				if (edit.innerText === "编辑") {
					this.isedit = !this.isedit
					edit.innerHTML = '完成'
				} else if (edit.innerText === '完成') {
					this.isedit = false
					edit.innerHTML = '编辑'
				}
			}
		},
	}
</script>

<style lang='scss'>
	uni-page-body {
		height: 100%;
	}

	/* 购物车为空时 */
	.container {
		/* padding-bottom: 134rpx; */
		/* 空白页 */
		height: 100%;
		/* background: #EEEEEE; */

		.empty {
			padding-top: 65rpx;
			width: 100%;
			/* height: 100vh; */
			padding-bottom: 100rpx;
			display: flex;
			/* justify-content: center; */
			flex-direction: column;
			align-items: center;
			background: #EEEEEE;

			.empty-img {
				width: 370rpx;
				height: 160rpx;
				margin-bottom: 30rpx;
			}

			.empty-box {
				font-size: 28rpx;

				.empty-tips {
					text-align: center;
					font-family: PingFangSC-Regular;
					color: #bbbbbb;
					height: 26rpx;
					margin-top: 56rpx;
				}

				.empty-btn {
					margin: 66rpx auto 0;
					font-family: PingFang-SC-Medium;
					width: 168rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					color: #db2929;
					border-radius: 30rpx;
					border: solid 1rpx #db2929;
				}

				.empty-wares {
					width: 697rpx;
					margin: 131rpx auto 0;
					font-family: PingFangSC-Regular;

					.wares-title {
						text-align: center;
						font-size: 32rpx;
						height: 30rpx;
						color: #000000;
						font-weight: bold;
					}

					.wares-box {
						display: flex;
						margin-top: 30rpx;
						width: 697rpx;
						flex-wrap: wrap;
						justify-content: space-between;

						.wares-box-list {
							width: 340rpx;
							height: 510rpx;
							background-color: #ffffff;
							box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
							border-radius: 10rpx;
							margin-bottom: 17rpx;
							overflow: hidden;

							.wares-box-img {
								height: 346rpx;
								width: 340rpx;

								image {
									height: 346rpx;
									width: 340rpx;
								}

							}

							.wares-box-tips {
								font-family: PingFang-SC-M;

								& view {
									font-family: PingFang-SC-Medium;
									font-weight: bold;
									margin: 19rpx 32rpx 31rpx 23rpx;

									&:first-child {
										margin-bottom: 29rpx;
										font-size: 24rpx;
										color: #000000;
										width: 285rpx;
										line-height: 36rpx;
									}

									&:last-child {
										height: 25rpx;
										font-size: 32rpx;
										color: #f11f22;
									}
								}
							}
						}
					}
				}
			}

		}
	}

	/* 购物车列表项 */
	.cart-list {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding-bottom: 252rpx;
		background: #EEEEEE;

		.cart-shop {
			width: 690rpx;
			overflow: hidden;
			background-color: #ffffff;
			border-radius: 10rpx;
			margin-top: 26rpx;

			.cart-shopName-box {
				margin: 36rpx 0 45rpx 10rpx;
				height: 32rpx;
				line-height: 32rpx;
				/* width: 286rpx; */
				display: flex;

				.cart-img {
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;

					image {
						width: 32rpx;
						height: 32rpx;
					}
				}

				.cart-img-shop {
					width: 28rpx;
					height: 26rpx;
					margin-right: 11rpx;
					line-height: 32rpx;

					image {
						width: 28rpx;
						height: 26rpx;
					}
				}

				.cart-shopName {
					height: 25rpx;
					font-family: PingFangSC-Regular;
					font-size: 28rpx;
					font-weight: bold;
					font-stretch: normal;
					/* line-height: 36rpx; */
					letter-spacing: 0rpx;
					color: #333333;
				}

				.cart-img-return {
					margin-left: 14rpx;

					image {
						width: 12rpx;
						height: 21rpx;
						transform: rotate(180deg);
					}
				}
			}

			.cart-shop-list {
				height: 228rpx;
				width: 662rpx;
				margin: 0 18rpx 10rpx 10rpx;
				.content-box {
					height: 228rpx;
					display: flex;
					align-items: center;

					.content-img {
						width: 32rpx;
						height: 32rpx;
						margin-right: 16rpx;

						image {
							width: 32rpx;
							height: 32rpx;
						}
					}

					.content-shop {
						width: 180rpx;
						height: 180rpx;

						image {
							width: 180rpx;
							height: 180rpx;
						}
					}

					.content-desc {
						font-family: PingFangSC-Regular;
						margin-left: 17rpx;
						position: relative;

						.desc-shop {
							width: 411rpx;
							height: 70rpx;
							max-height: 70rpx;
							font-size: 28rpx;
							font-weight: bold;
							font-stretch: normal;
							letter-spacing: 0rpx;
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

						.desc-size {
							margin-top: 16rpx;
							height: 23rpx;
							font-size: 24rpx;
							letter-spacing: 0rpx;
							color: #999999;
						}

						.desc-price {
							margin-top: 36rpx;
							height: 36rpx;
							font-size: 36rpx;
							font-weight: bold;
							font-stretch: normal;
							/* line-height: 48rpx; */
							letter-spacing: 0rpx;
							color: #db2929;
						}

						.desc-num {
							position: absolute;
							bottom: 0;
							right: 0;
							width: 159rpx;
							height: 42rpx;

							/deep/.uni-numbox {
								width: 159rpx;
								height: 42rpx;
								border-radius: 5rpx;
								border: solid 2rpx #f0f0f0;
							}
						}
					}
				}
			}
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		/* margin-bottom: 100rpx; */
		/* #endif */
		position: fixed;
		left: 0;
		bottom: 92rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 750rpx;
		height: 108rpx;
		background-color: #ffffff;

		.checkbox {
			margin-left: 30rpx;
			width: 32rpx;
			height: 32rpx;

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}

		.total-sel {
			height: 23rpx;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 0rpx;
			color: #000000;
			margin-left: 10rpx;
		}

		.total-box {
			margin-left: 24rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			font-family: PingFang-SC-Medium;
			height: 33rpx;
			font-size: 32rpx;
			font-weight: bold;
			font-stretch: normal;
			/* line-height: 36rpx; */
			letter-spacing: 0rpx;
			color: #000000;
		}

		.confirm-btn {
			width: 212rpx;
			height: 76rpx;
			line-height: 76rpx;
			background-color: #db2929;
			border-radius: 38rpx;
			font-size: 32rpx;
			font-weight: bold;
			font-stretch: normal;
			letter-spacing: 0rpx;
			color: #ffffff;
			margin-right: 32rpx;
		}

		.total-isEdit {
			display: flex;
			margin-left: 191rpx;
			font-family: PingFang-SC-Medium;
			line-height: 72rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: bold;

			.total-btn {
				width: 220rpx;
				height: 72rpx;
				border-radius: 36rpx;
				border: solid 1rpx #f38f3e;
				color: #f38f3e;
				margin-right: 24rpx;
			}

			.total-btn1 {
				width: 172rpx;
				height: 72rpx;
				border-radius: 36rpx;
				border: solid 1rpx #db2929;
				color: #db2929;
			}
		}
	}
</style>
