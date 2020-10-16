<!-- 横向三图片排列 -->
<template>
	<view class="floor">
		<view class="floor-header" :style="headerStyle">
			<view class="header-title " :style="titleStyle">{{title}}</view>
			<view @click="navToMore()" v-if="floorData.url && floorData.url != ''"
				class="header-more ">更多</view>
		</view>
		<view class="floor-body floor-new" :style="bodyStyle">
			<view class="new-item" v-for="(item, index) in datalist.slice(0,3)" @tap="hTapFloor(datalist,index)" >
				<image class="new-img u-skeleton-fillet" :src="item.img" mode="widthFix"></image>
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
		name: 'ThreeImgsBox',
		props: {
			"floorData": {},
			loading: false
		},
	    data() {
	        return {
				title: '',
				datalist: [],
	        }
	    },
		async mounted() {
			this.title = this.floorData.title;
			await getFloorInfoConfig({"id":this.floorData.id}).then(res => {
				if(res.code == 200) {
					res.data.forEach(louCeng=>{
						this.datalist.push({"img": getImgUrl(louCeng.img),"url":louCeng.url});
					})
				}
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id)
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
	    watch: {
	    },
	    methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			
			navToMore() {
				navigateTo(this.floorData.url) 
			},
			
			hTapFloor(type,index) {
				let url = type[index].url;
				console.log("三张图 url" + url)
				uni.navigateTo({
					url: url
				})
			},
	    },
	}
</script>

<style scoped lang="scss">
	.floor {
		line-height: 1;
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
		.floor-new {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 30rpx;
			.new-item {
				width: 216rpx;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
				border-radius: 10rpx;
				overflow: hidden;
				.new-img {
					width: 100%;
					vertical-align: top;
				}
			}
		}
	}
</style>
