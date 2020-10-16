<!-- 轮播图 -->
<template>
	<view class="carousel-section">
		<!-- 背景色区域 -->
		<!-- <view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view> -->
		<u-swiper border-radius="16" height="284" :list="carouselList" @click="to_carouselUrl" img-mode="scaleToFill"
			class="uswiper u-skeleton-fillet"></u-swiper>
	</view>
</template>

<script>
	import  {carouselList_} from '@/util/skeletonJson.js'
	import {getImgUrl} from '../../../util/common.js'
	import {getPageInfo,getFloorInfoConfig} from '../../../api/Page.js'
	
	export default {
		name: 'LunBoBox',
	    props: {
	    	"floorData": {}
	    },
	    data() {
	        return {
				carouselList: []
	        }
	    },
	    watch: {
	    },
		async mounted() {
			await getFloorInfoConfig({"id":this.floorData.id}).then(res => {
				res.data.forEach(lunbo=>{
					this.carouselList.push({image:getImgUrl(lunbo.img), url:res.data.url});
					console.log(lunbo.img)
				})
			})
			//通知父组件 加载完成
			this.$emit('loadsuccess', this.floorData.id)
		},
	    methods: {
	       //点击轮播
	       to_carouselUrl(index) {
				var url = this.carouselList[index].url;
				uni.navigateTo({
					url: url
				})
	       }
	    },
	}
</script>

<style scoped lang="scss">
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;
		/deep/.u-indicator-item-round-active{
			background-color:#db2929 ;
		}
		.uswiper{
			padding: 0 30rpx;
		}
		.titleNview-background {
			// position: absolute;
			// top: 0;
			// left: 0;
			width: 100%;
			height: 426rpx;
			transition: .4s;
		}
	}
</style>
