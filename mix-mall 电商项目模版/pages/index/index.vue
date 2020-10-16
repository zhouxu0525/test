<template>
	<view class="container  u-skeleton">
		<view v-for="(item, index) in items" :key="index">
			
			<top-search-box :floorData="item" :loading="loading"
				v-if="item.styleCode == 'SEARCH'"></top-search-box>
			
			<goods-list-transverse-box :isMore="num" :floorData="item" @loadsuccess="loadsuccess"
				:loading="loading" v-if="item.styleCode == 'S-PRODUCT-LIST'"></goods-list-transverse-box>
			
			<gong-ge-ten-box :floorData="item" :loading="loading" @loadsuccess="loadsuccess" 
				v-if="item.styleCode == 'TEN-GRID'"></gong-ge-ten-box>
 			
			<lun-bo-box :floorData="item" :loading="loading" @loadsuccess="loadsuccess"
				v-if="item.styleCode == 'CAROUSEL-LIST'"></lun-bo-box>

			<heng-fu-box :floorData="item" :loading="loading" @loadsuccess="loadsuccess"
				v-if="item.styleCode == 'BANNER'"></heng-fu-box>
			
			<three-imgs-box :floorData="item" :loading="loading" @loadsuccess="loadsuccess"
				v-if="item.styleCode == 'THREE-IMG'"></three-imgs-box>
			
			<goods-transverse-box :floorData="item" :loading="loading" @loadsuccess="loadsuccess"
				v-if="item.styleCode == 'H-PRODUCT-LIST'"></goods-transverse-box>
			
			<lone-rtwo-box :floorData="item" :loading="loading" @loadsuccess="loadsuccess" 
				v-if="item.styleCode == 'ONE-TWO'"></lone-rtwo-box>
			
			<!--
			<fixer-btn-box :floorData="item" v-if="item.styleCode == 'fax'"></fixer-btn-box> -->
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>

	import TopSearchBox from '../../components/mall-com/top-search/index'
	import LunBoBox from '../../components/mall-com/lunbo/index.vue'
	import GongGeTenBox from '../../components/mall-com/gongge-ten/index.vue'
	import HengFuBox from '../../components/mall-com/hengfu/index.vue'
	import ThreeImgsBox from '../../components/mall-com/img-three/index.vue'
	import GoodsTransverseBox from '../../components/mall-com/goods-transverse/index.vue'
	import LoneRtwoBox from '../../components/mall-com/left-one-right-two/index.vue'
	import GoodsListTransverseBox from '../../components/mall-com/goods-list-transverse/index.vue'
	import FixerBtnBox from '../../components/mall-com/fixer-btn/index.vue'
	import {getPageInfo,getFloorInfoConfig,getIndex} from '../../api/Page.js'
	
	export default {
		components: {
			TopSearchBox, LunBoBox, GongGeTenBox, HengFuBox, ThreeImgsBox, 
			GoodsTransverseBox, LoneRtwoBox, GoodsListTransverseBox, FixerBtnBox
		},
		computed:{
			
		},
		data() {
			return {
				loading: true, // 是否显示骨架屏组件
				pageId:'',
				items:[],
				num:0,
				loadCount: 4,  //若组件数量大于4个，则已加载完成4个组件后 取消加载动效
				currLoad: 0		//当前已加载完成数
			};
		},
		async onLoad(option) {
			this.pageId = option.pageId;
			if(option.pageId == undefined){
				await getIndex().then(res => {
					this.pageId = res.data.id
				})
			}
			await getPageInfo({"id":this.pageId}).then(res => {
				res.data.list.forEach(d => {
					d.titleBgImg = "";
					d.titleBgColor = "";
				})
				this.items = res.data.list;
			})
			
		},
		onReachBottom() {
			this.num = this.num +1;
		},
		methods: {
			loadsuccess(val) {
				this.currLoad = this.currLoad + 1;
				var loadcounts = (this.items.length >= this.loadCount) ? this.loadCount : this.items.length
				//满足已完成加载个数，则去除加载层动效
				if(loadcounts <= this.currLoad) {
					this.loading = false
					return;
				}
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
</style>
