<!-- 横向商品滚动 -->
<template>
	<view class="floor">
		<view class="floor-header" :style="headerStyle">
			<view class="header-title" :style="titleStyle">
				{{title}}
			</view>
			<view @click="navToMore()" v-if="floorData.url && floorData.url != ''" class="header-more">更多</view>
		</view>
		<view class="floor-body floor-limit" :style="bodyStyle">
			<scroll-view class="limit-list" scroll-x>
				<view class="scoll-wrapper">
					<view v-for="(item, index) in datalist" :key="index" class="floor-item u-skeleton-fillet"
						@click="hTapFloor(item)">
						<image class="limit-img" :src="getImage(item.pic)" mode="aspectFit" ></image>
						<text class="new-price clamp">￥{{item.originalPrice}}</text>
						<text class="old-price">￥{{item.price}}</text>
					</view>
				</view>
			</scroll-view>
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
		name: 'GoodsTransverseBox',
	    props: {
	    	"floorData": {},
			loading: false
	    },
	    data() {
	        return {
				title: '',
				datalist: [],
				// 倒计时计数器
				countDown:3600,
				// 定时器
				countDownTimer:'',
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
				this.data = res.data;
				if(res.code == 200) {
					this.datalist = res.data[0].productList;
				}
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id)
		},
	    methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			hTapFloor(type) {
				let id = type.id;
				uni.navigateTo({
					url: `/pages/product/product?id=` + id
				})
			},
			//更多跳转
			navToMore() {
				navigateTo(this.floorData.url)
			},
			countDownHour() {
				let hour =Math.floor(this.countDown / 3600)
				hour >= 10? '':hour = '0'+hour
				return hour
			},
			countDownMin() {
				let minute = Math.floor(Math.floor(this.countDown % 3600) / 60)
				minute >= 10? '':minute = '0'+minute
				return minute
			},
			countDownSeconds() {
				let seconds =Math.floor(Math.floor(this.countDown % 3600) % 60)
				seconds >= 10? '':seconds = '0'+seconds
				return seconds
			},
			timer() {
				// 设置限时抢购倒计数定时器
				this.countDownTimer = setInterval(()=>{
					--this.countDown
					if(this.countDown<=0){
						clearInterval(this.countDownTimer)
					}
				},1000)
			}
	    },
	}
</script>

<style scoped lang="scss">
	.floor {
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
		// 限时抢购
		.floor-limit {
			.limit-list{
				white-space: nowrap;
			}
			.scoll-wrapper{
				padding-top: 30rpx;
				padding-left: 30rpx;
				padding-bottom: 30rpx;
				// height:390rpx;
				display:flex;
				align-items: flex-start;
			}
			.floor-item{
				width: 206rpx;
				height: 300rpx;
				margin-right: 20rpx;
				background-color: #fff;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
				border-radius: 16rpx;
				text-align: center;
				.limit-img{
					vertical-align: top;
					border-radius: 16rpx 16rpx 0 0;
					width: 206rpx;
					height: 206rpx;
				}
				.new-price{
					padding-top: 10rpx;
					font-family: PingFang-SC-Medium;
					font-size: 24rpx;
					font-weight: bold;
					color: #db2929;
				}
				.old-price{
					font-family: PingFang-SC-Medium;
					font-size: 24rpx;
					padding-top: 15rpx;
					color: #bbbbbb;
					text-decoration:line-through;
				}
			}
			
		}
	}
</style>
