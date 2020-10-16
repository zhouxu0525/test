<template>
	<view class="ImgList">
		<!-- 顶部 -->
		<view class="header" v-show="!fullScreen">
			<view class="close" @click="doclose">
				<image src="@/static/evaluate/close.png" mode=""></image>
			</view>
			<view class="num">
				{{num}}
			</view>
		</view>
		<view class="swiperBox" @click="fullScreen = !fullScreen">
			<!-- 轮播展示 -->
		    <view class="swiper">
				<swiper class="swiper" @change="change">
					<swiper-item v-for="(item, index) in imgList" :key="index">
						<view   class="bg_img" :style="{ backgroundImage: 'url('+ getImage(item.image) +')'}"></view>
					</swiper-item>
				</swiper> 
			</view>  
		</view>
		<!-- 底部信息 -->
		<view class="bottom" v-show="!fullScreen">
			<view class="">
				{{memberNickName}}
			</view>
			<view class="">
				{{productsku}}
			</view>
			<view class="">
				{{content}}
			</view>
		</view>
	</view>
</template>

<script>
	import { getEvaluateList } from '../../api/Evaluate'; 
	import {
		getImgUrl
	} from '../../util/common.js'
	export default {
		data() {
			return {
				//商品得id
				goodsId:null,
				commentId:null,
				orderId:null,
				productsku:null,
				memberNickName:null,
				content:null,
				imgList:[],
				list: [],
				ImgNum:1,
				fullScreen: false,
			};
		},
		computed:{
			num(){
				return `${this.ImgNum+'/'+this.imgList.length}`
			}
		},
		onLoad(option) {
			//评论ID
			this.commentId = option.commentId; 
			//加载商品评价信息
			this.loadEvaluateList(); 
		}, 
		methods:{ 
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//查询评价信息
			loadEvaluateList(){ 
				var param = {"commentId": this.commentId};
				getEvaluateList(param).then(res => {
					if (res.code == 200 && res.data) {
						var dataInfo = {};
						if(res.data.list && res.data.list.length > 0) {
							dataInfo = res.data.list[0]; 
						}
						//处理图片
						var picsString = dataInfo.pics;
						var picsList = picsString.split(",");	
						var srcList = []; 
						picsList.forEach(pics => {
							srcList.push({"image": pics});						 
						}); 
						this.imgList = srcList;  
						this.productsku = dataInfo.productsku;
						this.memberNickName = dataInfo.memberNickName;
						this.content = dataInfo.content;
					}
				});
			}, 
			change(e){
				this.ImgNum = e.detail.current + 1
			},
			doclose() {
				//后退路由
				uni.navigateBack();  
			}
		}
	}
</script>

<style lang="scss">
	page{
		font-family: PingFang-SC-Medium;
	}
	image{
		width: 100%;
		height: 100%;
	}
	.ImgList{
		.header{
			height: 120rpx;
			width: 750rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1000;
			background-color:#000 ;
			.close{
				width: 28rpx;
				height: 28rpx;
				position: absolute;
				top: 52rpx;
				left: 30rpx;
			}
			.num{
				padding-top: 56rpx;
				text-align: center;
				color: #fff;
				font-size: 26rpx;
			}
		}
		.swiperBox{
			width: 100%;
			height: 100%;
			position: absolute;
			background-color: #000;
		}
		.swiper{
			width: 100%;
			height: 100%;
		}
		.bg_img {
			background-size: 100% auto;
			background-repeat: no-repeat;
			background-position:center;
			width: 100%;
			height: 100%;
			background-color: #000;
		}
		.bottom{
			//height: 310rpx;
			width: 750rpx;
			background-color:#000 ;
			padding: 40rpx 30rpx;
			position: absolute;
			bottom: 0px;
			overflow: hidden;
			view{
				color: #ffffff;
				&:first-child{
					font-size: 32rpx;
					height: 30rpx;
				}
				&:nth-child(2){
					height: 40rpx;
					font-size: 24rpx;
					opacity: 0.5;
					margin: 19rpx 0 20rpx 0;
					overflow: hidden;/*内容超出后隐藏*/
					text-overflow: ellipsis;/* 超出内容显示为省略号*/
					white-space: nowrap;/*文本不进行换行*/
				}
				&:last-child{
					width: 100%;
					font-size: 26rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					overflow: hidden;
				}
			}
		}
	}
</style>
