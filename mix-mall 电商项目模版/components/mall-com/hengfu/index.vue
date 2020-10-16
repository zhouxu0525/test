<!-- 横幅 -->
<template>
	<view class="ad-1">
		<image @tap="hTapAdFloor('广告楼层')" class="ad-img u-skeleton-fillet" :src="imgUrl" mode="widthFix"></image>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {carouselList_} from '@/util/skeletonJson.js'
	import {getImgUrl} from '../../../util/common.js'
	import {getPageInfo,getFloorInfoConfig} from '../../../api/Page.js'
	
	export default {
		name: 'HengFuBox',
		props: {
			"floorData": {},
			loading: false
		},
	    data() {
	        return {
				imgUrl: 'http://1g82496s05.imwork.net/mall/static/img/advertisting.dfec68b5.png'
	        }
	    },
		async mounted() {
			await getFloorInfoConfig({"id":this.floorData.id}).then(res => {
				this.imgUrl = getImgUrl(res.data[0].img);
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id)
		},
	    watch: {
	    },
	    methods: {
			// 点击广告楼层
			hTapAdFloor(title) {
				uni.showToast({title})
			},
	    },
	}
</script>

<style scoped lang="scss">
	.ad-1{
		padding: 30rpx 30rpx 0rpx 30rpx;
		// background: #fff;
		.ad-img{
			vertical-align: top;
			width:100%;
		}
	}
</style>
