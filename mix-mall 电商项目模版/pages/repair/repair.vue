<template>

	<view style="width: 100%; height:140vh;background-color: #F8F8F8;">
		<!-- 标题 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="../../static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				{{channel|channelFilter}}
			</view>
		</view>
		<!-- 内容区 -->
		<view class="content">
			<view class="content_1">
				<img :src="getImage(productPic)" alt="">

				<p>申请数量</p>
			</view>
			<view class="content_2">
				<p>{{productName}}</p>
				<view style="display: flex;margin-top: 130rpx;font-weight:350; font-size: 3vw">
					<p style="flex: 1;">单价: &nbsp;<font color="red">￥{{realAmount}}</font></p>
					<p style="flex: 1;">购买数量:&nbsp; {{productQuantity}}</p>
					<!-- <p style="flex: 1;">申请数量:{{value1}}</p> -->
				</view>
				<view style="position: absolute;right: 30rpx; padding: 60rpx 0;">
					<u-number-box v-model="value1" @change="valChange" :max="productQuantity" :min='1'></u-number-box>
				</view>
			</view>
		</view>
		<u-popup v-model="flg" mode="bottom" border-radius=30>
			<view class="eject" style="height: 700rpx;">
				<view style="display: flex; justify-content:center; padding: 40rpx 0 ;">
					<text>{{isReason|isReasonType}}</text>
				</view>
				<view v-if="isReason===1">
					<view v-for="(item,index) in reasonList" :key="index">
						<view style="margin-top: 100rpx;" @tap="checkRadio(index)">
							<label class="radio" style="display: flex; justify-content: space-between; padding: 0 20rpx;">
								<text>{{item.name}}</text>
								<radio value='item.id' :checked="index === current" color="red"></radio>

							</label>

						</view>
					</view>
				</view>
				<view v-else>
					<view v-for="(item,index) in addressList" :key="index">
						<view style="margin-top: 100rpx;" @tap="checkRadio(index)">
							<label class="radio" style="display: flex; justify-content: space-between; padding: 0 20rpx;">
								<text style="height:50px; width:150px; font-size: 2vw; padding-left: 30rpx;">{{item.province}}{{item.city}}{{item.region}}{{item.street}}{{item.detailAddress}}</text>
								<text style="height:50px; width:60px; font-size: 2vw; " />
								<text style="height:50px; width:150px; font-size: 2vw; ">{{item.name}}
									{{item.phoneNumber}}</text>
								<radio value='item.id' :checked="index === current1" color="red"></radio>

							</label>

						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<view class="operation">
			<view class="debugging">
				<view class="operation_1">申请原因
					<p style="font-size: 30rpx;padding: 30rpx 0;">请描述问题并上传收到的商品图片</p>
				</view>


				<!-- 商品故障 -->
				<view @tap="openReason(channel)">
					<view class="operation_2">{{reasonList[current].name}}</view>
					<view class="operation_3">
						<image class="img_1" src="../../static/common/jt.png" mode="widthFix"></image>
					</view>
				</view>
			</view>

			<textarea class="comment" v-model="val" maxlength="500">
			</textarea>
			<view class="card_2">
				<!-- <view style="position: relative; padding-top:30rpx ; ">
					<u-upload :action="action" :file-list="fileList"></u-upload>
				</view> -->
				<view class="upload-Img">
					<view class="imgListBox1">

						<robby-image-upload v-model="imgList" @delete="deleteImage" @add="addImage" :limit="5"></robby-image-upload>

					</view>
				</view>
			</view>
			<p style="color:#C0C4CC; position: absolute;top: 73vh; right: 40rpx;font-size: 26rpx;">{{val.length}}/500</p>
		</view>
		<view class="card1">
			<view class="debugging" style="font-size: 30rpx;padding: 30rpx 0;">
				<view class="operation_1">退回方式</view>
				<view style="font-size: 3vw; margin-left: 20rpx;line-height: 40rpx; color: #C8C9CC;">（审核通过后可查看商家地址）</view>
				<!-- 返回方式 tap选择打开pop的方法即可-->

				<view @tap="">
					<view class="operation_2">快递至商家</view>
					<!-- <view class="operation_3">
						<image class="img_1" src="../../static/common/jt.png" mode="widthFix"></image>
					</view> -->
				</view>
			</view>
			<!-- <view class="card_1">
				<view style="display: flex;">
					<p>商家名称</p>
					<p style="margin-left: 20rpx;">15167892446</p>

				</view>
				<view style="padding: 20rpx 0; color: #C8C9CC;">
					山东省济南市市中区xxxx号xxx
					市中区<br />经七纬二路 利达妈妈
				</view>
				<u-button plain size="mini" shape="square" style="color: red; position: absolute;right: 75rpx;top: 95vh;">复制</u-button>
			</view> -->
		</view>

		<view class="card" v-if="this.channel != 2">
			<view class="debugging" style="font-size: 30rpx;padding: 30rpx 0;">
				<view class="operation_1">收货地址</view>
				<view style="font-size: 3vw; margin-left: 20rpx;line-height: 40rpx; color: #C8C9CC;">（该地址是商家回寄给您的地址）</view>
				<view class="operation_3" @tap="openAddress">
					<image class="img_1" src="../../static/common/jt.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="card_1">
				<view style="display: flex;">
					<p>{{addressList[current1].name}}</p>
					<p style="margin-left: 20rpx;">{{addressList[current1].phoneNumber}}</p>

				</view>
				<view style="padding: 20rpx 0; color: #C8C9CC;">
					{{addressList[current1].province}}{{addressList[current1].city}}{{addressList[current1].region}}{{addressList[current1].street}}
					<br />{{addressList[current1].detailAddress}} {{addressList[current1].regionCode}}
				</view>

			</view>

		</view>
		<p class="footer">商家客服可能与您电话沟通，请保持手机畅通</p>
		<button style="color:#FFFFFF; border-radius: 200rpx;background-color: #DB2929;width: 90%;" @tap='sucBtn'>提交</button>
	</view>
</template>

<script>
	import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue'
	import * as returnReq from '../../api/return.js';
	import * as addressReq from '../../api/Address.js';
	import {getImgUrl} from '../../util/common.js';
	import {fileUpload} from '../../util/request.js'

	export default {
		components: {
			robbyImageUpload
		},
		data() {
			return {
				action: '',
				fileList: [{
					url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
				}],
				value1: 1,
				val: "",
				showUploadProgress: false,
				show: false,
				flg: false,
				channel: -1,
				current: 0,
				current1: 0,
				productName: '默认名称',
				productPic: '/202009/20200922165327_463804.jpg',
				realAmount: 20.9,
				imageShow: true,
				productQuantity: 1,
				reasonList: [],
				addressList: [],
				id: '',
				isReason: '',
				imgList: [],
				imageUrls: [],
			}

		},
		filters: {
			channelFilter(item) {
				if (item == 1) return '维修';
				if (item == 2) return '退货';
				if (item == 4) return '换货';
			},
			isReasonType(item) {
				if (item == 1) return '申请原因';
				if (item == 2) return '收货地址';
			},
		},
		onLoad(option) {
			this.loadReason(this.channel);
			this.loadAddress();
			this.item = JSON.parse(decodeURIComponent(option.item));
			this.productName = this.item.productName;
			this.productPic = this.item.productPic;
			this.realAmount = this.item.realAmount;
			this.productQuantity = this.item.productQuantity;
			this.id = this.item.id;
			console.info("item", this.item);
			this.channel = option.channel;
			this.value1 = this.item.productQuantity;

		},
		mounted: function(){
			
			if(this.showUploadProgress === false){
				this.showUploadProgress = false
			}else{
				this.showUploadProgress = true
			}
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			valChange(e) {
				console.log('当前值为: ' + e.value)
			},
			getImage(imgUrl) {
				//return imgUrl
				return getImgUrl(imgUrl);
			},
			checkRadio(index) {
				console.log(index);
				if (this.isReason === 1) {
					this.current = index
				} else {
					this.current1 = index
				}

			},
			async loadReason(channel) {
				uni.showLoading({
					title: '正在查询中'
				})
				const that = this;
				returnReq.findReturnReason(channel).then(res => {

					if (res.code == 200) {
						//查询到相应的原因列表已加载列表
						this.reasonList = res.data;
						console.info("data:", this.reasonList);

					} else {
						that.$api.msg("当前访问人数过多请稍后再试");
					}
					uni.hideLoading();
				});
			},
			async loadAddress(index) {
				uni.showLoading({
					title: '正在查询中'
				})
				const that = this;
				addressReq.getAddressList().then(res => {

					if (res.code == 200) {
						//查询到相应的原因列表已加载列表
						this.addressList = res.data;
						console.info("data:", this.addressList);

					} else {
						that.$api.msg("当前访问人数过多请稍后再试");
					}
					uni.hideLoading();
				});
			},
			openReason(index) {
				//console.info(index)
				this.isReason = 1;
				this.flg = true;
			},
			openAddress(index) {
				//console.info(index)
				this.isReason = 2;
				this.flg = true;
			},
			imageshow() {
				this.imageShow = false;
				this.anonymousStatus = 0;
			},
			imagehide() {
				this.imageShow = true;
				this.anonymousStatus = 1;
			},
			deleteImage(e) {},
			addImage(e) {},
			//循环上传评价图片
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
				uni.showLoading({
					title: '正在提交'
				})
				await this.uploadImages();
				var timeout = 3,
					i = 0,
					bool = true;
				const that = this;
				window.setInterval(function() {
					if (bool && ((++i) >= 3 || that.imageUrls.length == that.imgList.length)) {
						that.doSub();
						bool = false; //停止业务循环
					}
				}, 1000)
			},
			//提交
			doSub() {
				var param = {};
				if (this.channel !== 2) {
					param = {
						"description": this.val,
						"orderId": this.item.orderId,
						"orderSn": this.item.orderSn,
						"productAttr": this.item.productAttr,
						"productBrand": this.item.productBrand,
						"productCount": this.value1,
						"productId": this.item.productId,
						"productName": this.productName,
						"productPic": this.productPic,
						"productPrice": this.item.productPrice,
						"productRealPrice": this.realAmount,
						"proofPics": this.imageUrls.join(","),
						"reason": this.reasonList[this.current].name,
						"returnChannel": this.channel,
					};
					//提交评论数据
					console.info("param", param);
					returnReq.createReturn(param).then(res => {
						if (res.code == 200) {
							//成功之后跳转我的订单售后
							uni.navigateTo({
								url: '/pages/repair/result?channel=' + this.channel,
							})

						}
						uni.hideLoading()
					});
				} else {
					param = {
						"description": this.val,
						"orderId": this.item.orderId,
						"orderSn": this.item.orderSn,
						"productAttr": this.item.productAttr,
						"productBrand": this.item.productBrand,
						"productCount": this.item.productQuantity,
						"productId": this.item.productId,
						"productName": this.productName,
						"productPic": this.productPic,
						"productPrice": this.item.productPrice,
						"productRealPrice": this.realAmount,
						"proofPics": this.imageUrls.join(","),
						"reason": this.reasonList[this.current].name,
						"returnName": this.addressList[this.current1].name,
						"returnPhone": this.addressList[this.current1].phoneNumber,
						"returnAddress": this.addressList[this.current1].province + this.addressList[this.current1].city + this.addressList[
							this.current1].region + this.addressList[this.current1].street + this.addressList[this.current1].detailAddress,
						"returnId": this.addressList[this.current1].id,
						"returnChannel": this.channel,
					};
					//提交评论数据
					console.info("param", param);
					returnReq.createReturn(param).then(res => {
						if (res.code == 200) {
							//成功之后跳转我的订单售后
							uni.navigateTo({
								url: '/pages/repair/result?channel=' + this.channel + '&returnName=' + this.addressList[this.current1].name +
									'&returnPhone=' + this.addressList[this.current1].phoneNumber
							})

						}
						uni.hideLoading()
					});
				}


			}

		}


	}
</script>

<style lang="scss">
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 750rpx;
		height: 95rpx;
		text-align: center;
		line-height: 95rpx;
		background-color: #fff;
	}

	.left-btn {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0 30rpx;
		height: 100%;
		z-index: 100;
	}

	.arrow-icon {
		width: 20rpx;
		height: 34rpx;
	}

	.title {
		font-family: PingFang-SC-Medium;
		height: 100%;
		font-size: 36rpx;
		font-weight: bold;
		color: #232323;
	}

	/* 内容区 */
	.content {
		margin-top: 120rpx;
		display: flex;
		width: 100%;
		height: 35vh;
		background-color: #FFFFFF;
		font-size: 4.2vw;
		font-weight: 500;
		padding: 0 10rpx;

	}

	.content_1 img {
		width: 240rpx;
		height: 240rpx;


	}

	.content_1 {
		width: 30%;
		padding: 0 40rpx;
		//padding-top: 40rpx;
	}

	.content_2 {
		width: 60%;
		margin-left: 80rpx;
	}
	.content_2>p {
		font-weight: bold;
	}
	
	.sapn_1 {
		margin-left: 10rpx;
	}

	.content_1>p {
		margin-top: 30rpx;
	}

	.operation {
		/* width: 100%;
		height: 60vh;
		background-color: #FFFFFF;
		margin-top: 30rpx;
		padding: 10rpx 20rpx; */
		width: 100%;
		// height: 540rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
		border-radius: 16rpx;
		padding: 32rpx 30rpx;
	}
	
	.upload-Img {
		margin-top: 20rpx;
		// height: 114rpx;
		width: 640rpx;
		
		
		.imgListBox1 {
			display: flex;
			justify-content: flex-start;
	
			.imgList {
				width: 114rpx;
				height: 114rpx;
				// background: red;
				border-radius: 16px;
	
	
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

	.debugging {
		display: flex;
	}

	.operation_1 {
		color: #C0C4CC;

	}

	.operation_2 {
		position: absolute;
		//font-size: 3vh;
		right: 40rpx;

	}

	.operation_3 {
		position: absolute;
		right: 15rpx;


	}

	.img_1 {
		width: 18rpx;
		height: 18rpx;
	}

	.comment {
		width: 100%;
		height: 300rpx;
		border-radius: 20rpx;
		background-color: #F8F8F8;
		overflow-y: scroll
	}

	/deep/.u-list-item {
		width: 120rpx !important;
		height: 120rpx !important;
		font-size: 2vw;
	}

	/deep/.u-add-tips {
		margin-top: 24rpx !important;
		line-height: 20rpx !important;
	}

	.card {
		width: 100%;
		height: 26vh;
		background-color: #FFFFFF;
		margin-top: 30rpx;
		padding: 10rpx 20rpx;
	}

	.card1 {
		width: 100%;
		height: 10vh;
		background-color: #FFFFFF;
		margin-top: 30rpx;
		padding: 10rpx 20rpx;
	}

	


	.card_1 {
		width: 90%;
		height: 15vh;
		margin-top: 2rpx;
		margin-left: 5%;
		border-radius: 20rpx;
		background-color: #FDFAE5;
		font-size: 4vw;
		padding: 20rpx 30rpx;


	}

	.footer {
		font-size: 3vw;
		color: #C8C9CC;
		margin-top: 30rpx;
		text-align: center;
		margin-bottom: 30rpx;

	}

	.uni-radio-input-checked {
		background-image: u'r'l;
	}
</style>
