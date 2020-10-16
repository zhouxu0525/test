<template>
	<view class="tarbar u-skeleton">
		<view class="tarbar-rows u-skeleton-fillet" 
			@click="jumpTo(1)" :class="{active: 1 == $attrs.currentId}" >
			<view class="tarbar-img">
				<image src="@/static/shop/tab_icon/store_tabbar_home_nor.png" mode="" v-if="1 != $attrs.currentId"></image>
				<image src="@/static/shop/tab_icon/store_tabbar_home_sel.png" mode="" v-else></image>
			</view>
			<view class="tarbar-label">
				首页
			</view>
		</view>
		<view class="tarbar-rows u-skeleton-fillet"
			@click="jumpTo(2)" :class="{active: 2 == $attrs.currentId}" >
			<view class="tarbar-img">
				<image src="@/static/shop/tab_icon/store_tabbar_good_nor.png" mode="" v-if="2 != $attrs.currentId"></image>
				<image src="@/static/shop/tab_icon/store_tabbar_home_sel.png" mode="" v-else></image>
			</view>
			<view class="tarbar-label">
				商品
			</view>
		</view>
		<view class="tarbar-rows u-skeleton-fillet"
			@click="jumpTo(3)" :class="{active: 3 == $attrs.currentId}" >
			<view class="tarbar-img">
				<image src="@/static/shop/tab_icon/store_tabbar_sort_nor.png" mode="" v-if="3 != $attrs.currentId"></image>
				<image src="@/static/shop/tab_icon/store_tabbar_sort_sel.png" mode="" v-else></image>
			</view>
			<view class="tarbar-label">
				分类
			</view>
		</view>
		<view class="tarbar-rows u-skeleton-fillet"
			@click="jumpTo(4)" :class="{active: 4 == $attrs.currentId}" >
			<view class="tarbar-img">
				<image src="@/static/shop/tab_icon/store_tabbar_kefu_nor.png" mode="" v-if="4 != $attrs.currentId"></image>
				<image src="@/static/shop/tab_icon/store_tabbar_kefu_sel.png" mode="" v-else></image>
			</view>
			<view class="tarbar-label">
				客服
			</view>
		</view>
		
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		props: {
			loading:{
				default: false
			}
		},
		data() {
			return {
			};
		},
		methods:{
			jumpTo(id){
				this.$emit('changeTab', id);
			}
		}
	}
</script>

<style lang="scss">
	/* 自定义底部  */
	.tarbar{
		width: 750rpx;
		height: 98rpx;
		background-color: #ffffff;
		box-shadow: 0rpx -3rpx 20rpx 0rpx rgba(153, 153, 153, 0.08);
		position: fixed;
		bottom: 0;
		display: flex;
		// justify-content: space-around;
		.tarbar-rows{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-flow: column;
			.tarbar-img{
				margin-top: 15rpx;
				width: 36rpx;
				height: 36rpx;
				image{
					width: 36rpx;
					height: 36rpx;
				}
			}
			.tarbar-label{
				margin-top: 14rpx;
				font-family: PingFang-SC-Medium;
				font-size: 22rpx;
				color: #313131;
			}
		}
		.active{
			.tarbar-label{
				color: #db2929;
			}
		}
	}
</style>
