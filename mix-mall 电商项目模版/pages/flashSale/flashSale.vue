<template>
	<view>
		<!-- 导航 -->
		<view class="navigation" :style="{backgroundColor: topBackground}">
			<view class="left-btn" @tap="hTapBackIcon">
			</view>
			<view class="title">
				<img src="../../static/goodList/xsqj.png" alt="">
			</view>
		
		</view>
		<!-- 导航结束 -->
		<!-- 背景轮播 -->
		<view class="background" :style="{backgroundColor: topBackground}">
			<view class="wrap">
				<!-- <u-swiper height="284" :list="list" @change="swiperChange"></u-swiper> -->
				<swiper class="swiper" @change="swiperChange" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500">
					<swiper-item v-for="(item, index) in list" :key="index">
						<image mode="scaleToFill" class="bg_img" :src="getImage(item.bannerImg)"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 背景轮播结束 -->

		<!-- 中间 -->
		<view class="time">
			<scroll-view class="limit-list" scroll-x v-for="(itemTime, index1) in listTime" :key="index1">
				<view class="scoll-wrapper">
					<view class="select" v-if="compareDate(itemTime.timeType)">
						<span>{{itemTime.startTime}}</span>
						<view class="select_2">未开始</view>
					</view>
					<view class="select" v-else>
						<span>{{itemTime.startTime}}</span>
						<view class="select_1" @click="productList(itemTime)">已开抢</view>
					</view>




					<!-- <p  class="select_2"  v-if="compareDate(itemTime.timeType)">即将开始</p>
								<p class="select_1" @click="productList(itemTime)" v-else>已开抢</p> -->
				</view>

				<!-- <view class="scoll-wrapper">
					<view class="select">
						<span>08:00</span>
						<p class="select_1">抢购中</p>
					</view>
					<view class="select">
						<span>08:00</span>
						<p class="select_2">抢购中</p>
					</view> -->
				<!-- <view class="select">
						<span>08:00</span>
						<p class="select_2">抢购中</p>
					</view>
					<view class="select">
						<span>08:00</span>
						<p class="select_2">抢购中</p>
					</view>
					<view class="select">
						<span>08:00</span>
						<p class="select_2">抢购中</p>
					</view> -->
			</scroll-view>

			<!-- <view>
			<span>12:00</span>
			<p class="select_2">即将开始</p>
		</view>
		<view>
			<span>12:00</span>
			<p class="select_2">即将开始</p>
		</view>
		<view>
			<span>12:00</span>
			<p class="select_2">即将开始</p>
		</view> -->
		</view>


		<!-- <view class="commodity">
			<view class="goodsImg">
				<img src="@/static/temp/cate3.jpg" alt="" width="100%">
			</view>
			<view class="goodsInfo">
				<p>昨夜星辰昨夜风，画楼西畔桂堂东风，画楼西畔桂堂
					谁念西风独自凉，
				</p>
				<p class="money">¥1299</p> <del>1599</del>
				<view class="button">
					<view>去抢购</view>
					<u-line-progress active-color="#FEF0F0" :percent="40"></u-line-progress>
				</view>
				<p class="bottom">限购500件</p>
			</view>

		</view> -->
		<view class="commodity" v-for="(itemProduct, index) in productlist" :key="index">
			<view class="goodsImg">
				<!-- <img src="@/static/temp/cate3.jpg" alt="" width="100%"> -->
			</view>
			<view class="goodsInfo">

				<view class="commodity_1">{{itemProduct.name}}
				</view>

				<view style="display: flex; padding: 30rpx; justify-content: space-between;">
					<view>
						<view class="money">¥{{itemProduct.flashPromotionPrice}}</view> <del>{{itemProduct.price}}</del>
						<view class="bottom">限购{{itemProduct.flashPromotionLimit}}件</view>
					</view>
					<view class="button" v-if="!soldOut(itemProduct)" @click="productDetail(itemProduct)">
						<view>去抢购</view> 
						<u-line-progress active-color="#FEF0F0" :percent="getNum(itemProduct)"></u-line-progress>
				   </view>
				   <view class="button_1"  v-else>
					<view>已售罄</view> 
				   </view>
				</view>
			</view>


		</view>
		<!-- <view class="commodity">
			<view class="goodsImg">
				<img src="@/static/temp/cate3.jpg" alt="" width="100%">
			</view>
			<view class="goodsInfo">
				<p>昨夜星辰昨夜风，画楼西畔桂堂东风，画楼西畔桂堂
					谁念西风独自凉，
				</p>
				<p class="money">¥1299</p> <del>1599</del>
				<view class="button">
					<view>去抢购</view>
					<u-line-progress active-color="#FEF0F0" :percent="40"></u-line-progress>
				</view>
				<p class="bottom">限购500件</p>
			</view>
		</view> -->

	</view>
</template>

<script>
	import {
		getBaneerImg,
		getBaneerTime,
		getBaneerList
	} from '../../api/FlashSale';
	import {
		getImgUrl
	} from '../../util/common.js'
	export default {
		data() {
			return {
				topBackground: '#F93646',
				/* list: [{
						image: '../../static/temp/banner.png',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东',
						//bgColor: 'red'
					},
					{
						image: '../../static/temp/banner.png',
						title: '身无彩凤双飞翼，心有灵犀一点通',
						//bgColor: 'black'
					},
					{
						image: '../../static/temp/banner.png',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
						//bgColor: 'green'
					}
				], */
				list: [],
				listTime: [],
				productlist: [],
				value: 0,
				timer: '',
				activityId: ''
			}

		},
		onLoad(option) {
			this.activityId = option.activityId;
			this.loadData();
		},
		methods: {

			soldOut(obj){ 
							//计算百分比
							var num = parseFloat(obj.surplusStock);
							var total = parseFloat(obj.flashPromotionCount);
							if (isNaN(num) || isNaN(obj.flashPromotionCount)) {
							return false;
							}
							if(total <= 0){
								 return false;
							}
							if((Math.ceil((num) / total * 10000) / 100 )===100){
								 return true;
							}
							 return false;
						},
			getNum(obj){
				console.info("obj=======",obj)
				//计算百分比
				//{{flashPromotionCount}}/{{surplusStock}}
				var num = parseFloat(obj.surplusStock);
				var total = parseFloat(obj.flashPromotionCount);
				if (isNaN(num) || isNaN(obj.flashPromotionCount)) {
					return "0";
				}
				return total <= 0 ? "0" : Math.round(Math.round((num) / total * 10000) / 100 );
			},
			compareDate(obj) {
				if (obj == "2") {
					return true;
				} else {
					return false;
				}
			},
			async loadData() {
				var param = {
					"id": this.activityId
				}
				const that = this;
				//查询banner轮播图 
				await getBaneerImg(param).then(res => {
					if (res.code == 200) {
						this.list = res.data;
						console.info("this.list www==", this.list);
					}
				});
				//获取时间列表 
				let timeListInfo = []
				await getBaneerTime(param).then(res => {
					console.info("sdcsd======", res)
					if (res.code = 200) {
						that.listTime = res.data;
						timeListInfo = res.data;
					}

				});
				//获取当前时间商品列表数据 
				let flashPromotionSessionId = '';
				timeListInfo.forEach(dataInfo => {
					var bigSmall = dataInfo.bigSmall;
					if (bigSmall == "1") {
						this.productlist = dataInfo.flashList;
					}
				});


				console.log(obj)

				/* 	 var parm={
						"flashPromotionId":this.activityId,
						"flashPromotionSessionId":flashPromotionSessionId
					}  
					 
					 getBaneerList(parm).then(res => {
						 console.info("ssdds",parm)
							if (res.code == 200) { 
								this.productlist=res.data;  
							}
							
						}); */
			},

			productDetail(obj) {
				console.info("obj", obj)
				uni.navigateTo({
					url: '/pages/product/product?id=' + obj.id + "&flashId=" + this.activityId
				});
			},
			//获取图片链接
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//商品列表数据
			productList(obj) {
				var parm = {
					"flashPromotionId": obj.flashPromotionId,
					"flashPromotionSessionId": obj.id
				}
				getBaneerList(parm).then(res => {
					if (res.code == 200) {
						this.productlist = res.data;
					}

				});
			},
			hTapBackIcon() {
				uni.navigateBack()
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				var index = e.detail.current;
				if (this.list[index].backgroundColor && this.list[index].backgroundColor != '') {
					this.topBackground = this.list[index].backgroundColor;
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.background {
		width: 100%;
		height: 410rpx;
		background-color: #F93646;
		border-radius: 0 0 70% 70%;
		transition: .4s;
	}
	
	.wrap {
		position: relative;
		bottom: -76px;
		width:690rpx;
		height: 284rpx;
		margin: 0 auto;
	}
	/deep/.uni-swiper-wrapper{
		width: 690rpx !important;
		height: 284rpx !important;
		border-radius: 16rpx 16rpx 16rpx 16rpx !important;
		background-color: #ffffff !important;
		box-shadow: 0px 0px 48px 0px 
		rgba(90, 47, 47, 0.4) !important;
	}
	.bg_img{
		width: 690rpx !important;
		height: 284rpx !important;
	}
	
	
	// /deep/.u-list-image-wrap{
	// 	height: 65% !important;
	// }
	.u-swiper-wrap {
		border-radius: 16rpx !important;

	}

	// ::v-deep uni-swiper{
	// 	height: 390rpx !important;
	// }
	// 顶部导航
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		height: 90rpx;
		text-align: center;
		line-height: 120rpx;
		background-color: #F93646;
		transition: .4s;

		.left-btn {
			position: absolute;
			bottom: 0;
			left: 0;
			padding: 0 30rpx;
			height: 100%;
			z-index: 100;

			.arrow-icon {
				width: 27rpx;
				height: 34rpx;
			}
		}

		

		.title>img {
			width: 30%;
			height: 30%;

		}
	}

	// 中间
	.select {
		color: #ff0000;
	}

	.select_1 {
		width: 120rpx;
		border-radius: 50rpx;
		background-color: #FC4746;
		color: #FEF0F0;
		font-size: 16rpx;
		padding: 10rpx;
		margin: 4rpx 8rpx 0px;
	}

	.select_2 {
		width: 120rpx;
		border-radius: 50rpx;
		color: #C0C4CC;
		font-size: 18rpx;
		padding: 10rpx;
	}

	.time {
		text-align: center;
		width: 100%;
		height: 100rpx;
		margin-top: 56rpx;
		display: flex;
		font-family: 微软雅黑;
		font-size: 4vw;
		font-weight: 700;
		padding:0 46rpx;
		overflow-x: scroll;

		.limit-list {
			width: 130rpx;
			height: 100%;
			margin-right: 58rpx;
			white-space: nowrap;
			
		}

		.scoll-wrapper {
			width: 116rpx;
			margin-right: 78rpx;
			display: inline-block;
			float: left;
			
			// align-items: flex-start;

			// justify-content: space-between;
		}

	}

	.time>view {
		width: 100rpx;
		height: 100rpx;
		flex: 1;
		margin-left: 30rpx;
		justify-content: center;

	}

	.commodity {
		width: 690rpx;
		//height: 290rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;
		margin-left: 5%;
		border-radius: 16rpx;
		display: flex;
		font-weight: 700;
		font-size: 4vw;

		.goodsImg {
			width: 35%;
			padding: 20rpx;

			image {
				width: 100%;
			}
		}

		.goodsInfo {
			width: 65%;
			display: -webkit-box;
			/**对象作为伸缩盒子模型展示**/
			-webkit-box-orient: vertical;
			/**设置或检索伸缩盒子对象的子元素的排列方式**/
			-webkit-line-clamp: 2;
			/**显示的行数**/
			overflow: hidden;

			/**隐藏超出的内容**/
			p {
				overflow: hidden;
			}
		}
	}



	.commodity_1 {
		width: 423rpx;
		height: 70rpx;
		margin-top: 20rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font-family: PingFang-SC-Bold;
		font-size: 28rpx;
		font-weight: normal;
		color: #000000;
	}

	.money {
		color: #983832;
		font-weight: 700;
		font-size: 5vw;
		padding-top: 30rpx;
		display: inline;
	}

	del {
		margin-left: 20rpx;
		font-size: 3vw;
	}

	.bottom {
		color: #DCDFE6;
		font-size: 3vw;

	}

	.button {
		width: 38%;
		//height: 80rpx;
		font-size: 2vw;
		color: #FDF6EC;
		display: inline-block;
		margin-left: 20rpx;
		background-color: #DD2C2B;
		text-align: center;
		padding: 12rpx 4rpx;
		border-radius: 20rpx;
	}
	.button_1{
			width: 38%;
			//height: 80rpx;
			font-size: 2vw;
			color: #FDF6EC;
			display: inline-block;
			background-color: #DD2C2B;
			text-align: center;
			padding: 24rpx 4rpx;
			border-radius: 20rpx;
		}
	.u-progress {
		width: 50% !important;
		height: 8rpx !important;
	}
</style>
