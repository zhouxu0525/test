<!-- 左一右二 -->
<template>
	<view class="floor u-skeleton">
		<view class="floor-item floor-recommend">
			<view class="floor-header" :style="headerStyle">
				<view class="header-title" :style="titleStyle">
					{{title}}
				</view>
				<view @click="navToMore()" class="header-more" v-if="floorData.url && floorData.url != ''">更多</view>
			</view>
			<view class="floor-body" :style="bodyStyle">
				<view class="left u-skeleton-fillet">
					<image @click="navToDetailPage(imageOne.url)" v-if="imageOne.img != null" class="recomImg-left" :src="getImage(imageOne.img)" mode="widthFix"></image>
				</view>
				<view class="right u-skeleton-fillet">
					<image @click="navToDetailPage(imageTwo.url)" v-if="imageTwo != null" class="recomImg-right" :src="getImage(imageTwo.img)" mode="widthFix"></image>
					<image @click="navToDetailPage(imageThree.url)" v-if="imageThree != null" class="recomImg-right" :src="getImage(imageThree.img)" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {newProduct_} from '@/util/skeletonJson.js'
	import {getImgUrl, navigateTo} from '@/util/common.js'
	import {getPageInfo,getFloorInfoConfig} from '../../../api/Page.js'
	
	export default {
		name: 'LoneRtwoBox',
	    props: {
	    	"floorData": {},
			loading: false
	    },
	    data() {
	        return {
				title: '',
				datalist: newProduct_,
				imageOne:{"img":null,"url":null},
				imageTwo:{"img":null,"url":null},
				imageThree:{"img":null,"url":null}
	        }
	    },
	    watch: {
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
		async mounted() {
			this.title = this.floorData.title;
			
			await getFloorInfoConfig({"id":this.floorData.id}).then(res => {
				if(res.code == 200) {
					if (res.data.length == 3) {
						this.imageOne = res.data[0]
						this.imageTwo = res.data[1]
						this.imageThree = res.data[2]
					} else if(res.data.length == 2){
						this.imageOne = res.data[0]
						this.imageTwo = res.data[1]
					} else if(res.data.length == 1){
						this.imageOne = res.data[0]
					} 
				}
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id)
		},
		
	    methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			
			navToDetailPage (url) {
				uni.navigateTo({
					url: url
				})
			},
			//更多跳转
			navToMore() {
				navigateTo(this.floorData.url) 
			},
	    },
	}
</script>

<style scoped lang="scss">
	.floor {
		line-height: 1;
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
		// 精品推荐
		.floor-recommend{
			.floor-body {
				padding: 0rpx 30rpx;
				display: flex;
				justify-content: space-between;
			}
			.left {
				width: 309rpx;
				height: 408rpx;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
				border-radius: 16rpx;
			}
			.right {
				width: 366rpx;
				height: 408rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.recomImg-left {
				vertical-align: top;
				width: 100%;
			}
			.recomImg-right {
				border-radius: 16rpx;
				vertical-align: top;
				width: 366rpx;
				height: 196rpx;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
			}
		}
	}
</style>
