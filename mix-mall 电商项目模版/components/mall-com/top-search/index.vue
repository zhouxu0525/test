//顶部搜索框
<template>
	<view class="u-skeleton">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP
		
		<view class="mp-search-box u-skeleton-fillet" >
			<input class="ser-input" type="text" value="输入关键字搜索" disabled @click="navtosearch"/>
		</view>
		
		<!-- #endif -- -->
		<!-- 顶部导航栏 -->
		
		<view class="top_navigate u-skeleton-fillet">
			<view class="scan_null"></view>
			<!-- <view class="scan_btn" @tap="hTapScanBTN"></view> -->
			<view class="search u-skeleton-fillet">
				<input class="ipt" maxlength="23" type="text" disabled @click="navtosearch"/>
				<view class="placeholder-wrap" >
					<image class="search_icon" src="@/static/index/icon_seach.png" mode="widthFix"></image>
					<text class="placeholder_text" >请输入关键字</text>
				</view>
			</view>
			<view class="category_btn" @tap="hTapCategory"></view>
			<view class="msg_btn" @tap="hTapMsg"></view>
		</view>
		
		<!-- 标题栏和状态栏占位符 -->
		<view class="titleNview-placing"></view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>	
</template>
<script>
    export default {
		name: 'TopSearchBox',
        props: {
			loading: false
        },
        data() {
            return {
            }
        },
        watch: {
        },
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.$api.msg('点击了搜索框');
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
        methods: {
           navtosearch() {
				uni.navigateTo({
					url: "/pages/product/list"
				})
           },
		   // 导航栏分类按钮
		   hTapCategory() {
				uni.switchTab({
					url: "/pages/category/category"
				})
		   },
		   // 导航栏消息按钮
		   hTapMsg() {
		   	// uni.showToast({
		   	// 	 title: '点击了消息',
		   	// 	 duration: 2000
		   	// })
		   },
        },
    }
</script>
<style lang="scss" scoped>
 //    #ifdef MP */
	
 //    .mp-search-box{
 //    	position:fixed;
 //    	left: 0;
 //    	top: 0rpx;
 //    	z-index: 9999;
 //    	width: 100%;
 //    	padding: 20rpx 80rpx;
	// 	background-color: #F8F8F8;
 //    	.ser-input{
 //    		flex:1;
 //    		height: 65rpx;
 //    		line-height: 65rpx;
 //    		text-align: center;
 //    		font-size: 28rpx;
 //    		color:$font-color-base;
	// 		// border: 2rpx solid red;
 //    		border-radius: 20px;
 //    		background-color: #C0C4CC;
 //    	}
 //    }
	// /* #endif
	// 顶部导航
	.top_navigate{
		position: fixed;
		left:0;
		top: 0;
		z-index:10;
		height: 96rpx;
		width:100%;
		box-sizing: border-box;
		padding:  16rpx 30rpx 0;
		display: flex;
		align-items: center;
		background-color: #fff;
		.scan_btn {
			width: 70rpx;
			height: 100%;
			background:url(@/static/index/scan_icon.png) no-repeat left center/44rpx auto;
		}
		.scan_null {
			width: 50rpx;
			height: 100%;
		}
		.search {
			position: relative;
			width: 494rpx;
			height: 64rpx;
			background-color: #ececec;
			border-radius: 32rpx;
			overflow: hidden;
			.ipt {
				position: relative;
				z-index: 11;
				display: block;
				width: 100%;
				height:100%;
				box-sizing: border-box;
				padding-left: 30rpx;
			}
			.placeholder-wrap {
				position: absolute;
				top: 50%;
				left: 30rpx;
				height: 100%;
				transform: translateY(-50%);
				z-index: 10;
				display: flex;
				align-items: center;
				.search_icon {
					width: 27rpx;
					vertical-align: middle;
				}
				.placeholder_text {
					display: block;
					height: 100%;
					line-height: 64rpx;
					padding-left: 20rpx;
					font-family: NotoSansHans-Regular;
					font-size: 26rpx;
					color: #bbbbbb;
				}
			}
		}
		.category_btn {
			flex: 1;
			height:100%;
			background:url(@/static/index/category_icon.png) no-repeat right center/44rpx auto;
		}
		.msg_btn {
			flex: 1;
			height:100%;
			background:url(@/static/index/msg_icon.png) no-repeat right center/44rpx auto;
		}
	}
	.titleNview-placing {
		height: var(--status-bar-height);
		padding-top: 44px;
		box-sizing: content-box;
	}
	

     // #ifndef H5
	.titleNview-placing{
		
		padding-top: 0px;
	
	}
	// #endif
</style>
