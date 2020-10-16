<template>
	<view class="addEvaluate">
		<!-- 上传 -->
		<view class="upload">
			<view class="shop-box">
				<view class="shopImg">
					<image :src="getImage(productDetail.pic)" mode=""></image>
				</view>
				<view class="shopNews">
					<view class="clamp">
						{{productDetail.name}} 
					</view>
					<view class="">
						 {{skuStockInfo}} 
					</view>
				</view>
			</view>
			<view class="upload-evaluate">
				<view class="input">
					<u-input v-model="value" type="textarea" :maxlength="150" :auto-height="false" placeholder="请写下您对商品的评价，说说商品的优点和不足吧。"
					 @input="numberChange" />
				</view>
				<view class="text" v-if="value == null">您还可以输入150字 </view>
				<view class="text" v-else><text class="num">{{number}}</text>/150 </view>
			</view>
			<view class="upload-Img">
				<view class="imgListBox">
					<robby-image-upload v-model="imgList" @delete="deleteImage" @add="addImage" :limit="5"></robby-image-upload>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="evaluate">
			<view class="evaluateList" v-for="(item,i) in evaluateList" :key="i">
				<view class="title">
					{{item.title}}
				</view>
				<view class="rate">
					<u-rate :current="item.value" size="36" gutter="20" @change="rateChange($event,i)"></u-rate>
				</view>
				<view class="text">
					{{item.rate}}
				</view>
			</view>
		</view>
		<view class="nmEvaluation">
			<view class="nmEvaluationImg">
				<image src="@/static/evaluate/icon_nm_gray.png" v-model="anonymousStatus" mode="" v-if="imageShow == true" @click="imageshow"></image>
				<image src="@/static/evaluate/icon_nm_sel.png" v-model="anonymousStatus" mode="" v-else @click="imagehide"></image>
				<text class="text">匿名评价</text>
			</view>
		</view>
		<view class="complete" @click="sucBtn">
			完成
		</view>
	</view>
</template>

<script>
	import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue'
	import { addEvaluate } from '../../api/Evaluate'; 
	import { getProductInfo } from '../../api/Product'; 
	import {getImgUrl} from '../../util/common.js'
	import {fileUpload} from '../../util/request.js'
	
	export default {
		components: {
			robbyImageUpload
		},
		data() {
			return {
				number: '0',
				value: null,
				imgList: [],
				evaluateList: [{
					title: '描述相符',
					value: '0',
					rate: '',
					type: 1,
				}, {
					title: '物流服务',
					value: '0',
					rate: '',
					type: 2,
				}, {
					title: '服务态度',
					value: '0',
					rate: '',
					type: 3,
				}],
				imageShow: true,
				content: '',
				anonymousStatus: 0,
				pmsCommentInfo: {},
				imageUrls: [],   //用户上传得评论图片
				goodsId:0,
				productDetail:{},
				skuStockInfo:'',
			};
		},
		onLoad(option) {
			//获取商品得id
			this.goodsId = option.goodsId;
			this.orderId = option.orderId;
			this.getProductDetail(option.goodsId); 
		},
		methods: {
			//处理图片
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//获取评价商品得详情信息
			getProductDetail(){
				getProductInfo(this.goodsId).then(res => {
					if (res.code == 200) {
						this.productDetail=res.data.product;
						//处理规格
						var skuStockList=res.data.skuStockList
						skuStockList.forEach(img => {
							 var spData= img.spData;
							 let productAttr = JSON.parse(spData);
							 let productSpec = '';
							 for (var m = 0; m < productAttr.length; m++) {
							 	productSpec += " " + productAttr[m].key + ":" + productAttr[m].value;
							 }
							 this.skuStockInfo=productSpec
						});
					}
				});
			},
			//评价
			rateChange(e, i) {
				switch (e) {
					case 5:
						this.evaluateList[i].rate = '非常好'
						this.evaluateList[i].value = 5
						break;
					case 4:
						this.evaluateList[i].rate = '好'
						this.evaluateList[i].value = 4
						break;
					case 3:
						this.evaluateList[i].rate = '一般'
						this.evaluateList[i].value = 3
						break;
					case 2:
						this.evaluateList[i].rate = '差'
						this.evaluateList[i].value = 2
						break;
					case 1:
						this.evaluateList[i].rate = '非常差'
						this.evaluateList[i].value = 1
						break;
					default:
						this.evaluateList[i].rate = '好'
						this.evaluateList[i].value = 4
						break;
				}
			},
			//评价数字
			numberChange() {
				this.number = this.value.length;
			},
			imageshow() {
				this.imageShow = false;
				this.anonymousStatus = 0;
			},
			imagehide() {
				this.imageShow = true;
				this.anonymousStatus = 1;
			},
			deleteImage(e) {
			},
			addImage(e) {
			},
			//循环上传评价图片
			async uploadImages() {  
				this.imageUrls = [];
				const that = this; 
				this.imgList.forEach(img => {
					fileUpload(img).then(res => {
						res = JSON.parse(res);
						if (res.code === 200){
							that.imageUrls.push(res.data);
						}
					});
				})
			},
			//点击保存评论
			async sucBtn() {
				uni.showLoading({title: '正在提交'})
				await this.uploadImages();
				var timeout = 3, i = 0, bool = true;
				const that = this; 
				setInterval(function () {
					if(bool && ((++i) >= 3 || that.imageUrls.length == that.imgList.length)) {
						that.doSub();
						bool = false;  //停止业务循环
					}
				}, 1000)
			},
			//提交评论请求
			doSub() {
				var param = {
					"goodsId": this.goodsId,
					"fileImgs": this.imageUrls.join(","),
					"content": this.value,
					"evaluateList": this.evaluateList,
					"anonymousstatus": this.anonymousStatus,
					"productName": this.productDetail.name,
					"skuStock": this.skuStockInfo,
					"orderId": this.orderId,
				}
				//提交评论数据
				addEvaluate(param).then(res => {
					if (res.code == 200) { 
						//成功之后跳转我的订单待评价
						uni.redirectTo({
							url: '/pages/order/order?state=dpj'
						})
					}
					uni.hideLoading()
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
		font-family: PingFang-SC-Medium;
		padding: 30rpx 30rpx 0;
	}

	image {
		width: 100%;
		height: 100%;
	}

	.addEvaluate {
		.upload {
			width: 690rpx;
			// height: 540rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
			border-radius: 16rpx;
			padding: 32rpx 30rpx;

			.shop-box {
				display: flex;
				border-bottom: 1px solid #e5e5e5;

				.shopImg {
					width: 100rpx;
					height: 100rpx;
				}

				.shopNews {
					margin: 16rpx 0 15rpx 24rpx;

					view {
						&:first-child {
							font-size: 28rpx;
							font-weight: bold;
							color: #313131;
							width: 495rpx;
						}

						&:last-child {
							margin-top: 15rpx;
							font-size: 24rpx;
							color: #bbbbbb;
						}
					}
				}
			}

			.upload-evaluate {
				.input {
					margin-top: 30rpx;
					height: 150rpx;
					width: 640rpx;
					overflow: hidden;

					textarea {
						width: 640rpx;
						height: 150rpx !important;
					}
				}

				.text {
					text-align: right;
					font-size: 20rpx;
					color: #bbbbbb;

					.num {
						color: #db2929;
					}
				}
			}

			.upload-Img {
				margin-top: 20rpx;
				// height: 114rpx;
				width: 640rpx;

				.imgListBox {
					display: flex;
					justify-content: flex-start;

					.imgList {
						width: 114rpx;
						height: 114rpx;
						// background: red;
						border-radius: 16px;
					}

					.addImg {
						width: 114rpx;
						height: 114rpx;
						background-color: #f8f8f8;
						border-radius: 16rpx;
						border: dashed 1rpx #c3c3c3;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						image {
							width: 36rpx;
							height: 32rpx;
							vertical-align: bottom;
						}

						view {
							margin-top: 13rpx;
							font-size: 20rpx;
							color: #313131;
						}
					}
				}

			}
		}

		.evaluate {
			margin-top: 20rpx;
			width: 690rpx;
			height: 284rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 40rpx 0;

			.evaluateList {
				display: flex;
				padding-left: 30rpx;
				font-size: 28rpx;

				.title {
					color: #313131;
				}

				.rate {
					margin: 4rpx 20rpx;
				}

				.text {
					color: #db2929;
				}
			}
		}

		.nmEvaluation {
			display: flex;
			justify-content: flex-end;
			margin-top: 40rpx;

			.nmEvaluationImg {
				image {
					width: 24rpx;
					height: 24rpx;
					vertical-align: middle;
				}

				.text {
					font-size: 26rpx;
					color: #333333;
					padding-left: 8rpx;
				}
			}
		}

		.complete {
			margin-top: 90rpx;
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			background-color: #db2929;
			border-radius: 45rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>
