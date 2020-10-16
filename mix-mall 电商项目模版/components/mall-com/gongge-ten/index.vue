<!-- 10宫格 -->
<template>
	<view class="cate-section">
		<view class="cate-wrap">
			<view @tap="hTapCategoryFloor(item.url)" class="cate-item" v-for="(item, index) in categoryList.slice(0,n/2)" :key="index">
				<image class="item_img u-skeleton-circle" :src="getImage(item.img)"></image>
				<text class="item_desc u-skeleton-fillet" >{{item.title}}</text>
			</view>
		</view>
		<view class="cate-wrap" >
			<view @tap="hTapCategoryFloor(item.url)" class="cate-item" v-for="(item, index) in categoryList.slice(n/2)" :key="index">
				<image class="item_img u-skeleton-circle" :src="getImage(item.img)"></image>
				<text class="item_desc u-skeleton-fillet" >{{item.title}}</text>
			</view>
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {categoryList_} from '@/util/skeletonJson.js'
	import {getImgUrl} from '@/util/common.js'
	import {getPageInfo,getFloorInfoConfig} from '../../../api/Page.js'
	
	export default {
		name: 'GongGeTenBox',
	    props: {
			"floorData": {},
			loading: false
	    },
	    data() {
	        return {
				categoryList: categoryList_,
				n:""
	        }
	    },
	    watch: {
	    },
		async mounted() {
			await getFloorInfoConfig({"id":this.floorData.id}).then(res => {
				this.categoryList = res.data;
				this.n = res.data.length
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id) 
		},
	    methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			// 点击分类楼层
			hTapCategoryFloor(item) {
				uni.navigateTo({
					url: item
				})
/* 				 uni.showToast({
					title:`点击了分类楼层-${item}`
				}) */
			},
	    },
	}
</script>

<style scoped lang="scss">
	/* 分类 */
	.cate-section {
		.cate-wrap {
			display: flex;
			justify-content: space-around;
			padding: 32rpx 30rpx 0rpx;
		}
		.cate-item {
			// width: 93rpx;
			text-align: center;
			line-height: 1;
			.item_img {
				vertical-align: top;
				width: 88rpx;
				height: 88rpx;
				margin: 0;
				margin-bottom: 20rpx;
				border-radius: 44rpx;
				overflow: hidden;
			}
			.item_desc {
				display: block;
				font-family: PingFang-SC-Medium;
				font-size: 24rpx;
				color: #333333;
				white-space:nowrap; 
			}
		}
	}
</style>
