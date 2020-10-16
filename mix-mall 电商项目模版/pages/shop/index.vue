<template>
	<view class="container u-skeleton" >
		
		<shop-box :shopInfo="shopInfo" class="u-skeleton-fillet" ref="shopBox"></shop-box>
		
		<shop-index :shopInfo="shopInfo" class="u-skeleton-fillet" v-if="currentId == 1"
			:scrollBottomIndex="scrollBottomIndex" ref="shopIndex" @changeTab="changeTab" ></shop-index>
		
		<shop-goods :shopInfo="shopInfo" class="u-skeleton-fillet" v-if="currentId == 2"
			:scrollBottomIndex="scrollBottomIndex" ref="shopGoods"></shop-goods>
		
		<shop-cate :shopInfo="shopInfo" class="u-skeleton-fillet" v-if="currentId == 3"></shop-cate>
		
		<!-- tarbar自定义底部 -->
		<Tarbar :currentId = "currentId" :loading="loading" :shopInfo="shopInfo" @changeTab="changeTab"/>
		<!-- 骨架屏 加载动画 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {shoplunbolist_, shophostlist_} from '@/util/skeletonJson.js'
	import Tarbar from './components/shopTabbar.vue';
	import ShopBox from './components/shopBox.vue';
	import ShopIndex from './index/index.vue';
	import ShopGoods from './goods/index.vue';
	import ShopCate from './category/index.vue'
	
	import {getShopRecommendProductList} from '../../api/Product.js'
	import * as shopReq from '../../api/Shop.js'
	import {getShopLunbo} from '../../api/ShopLunbo.js'
	import {getProductByModuleConfig} from '../../api/GoodsModules'	
	import {getImgUrl} from '../../util/common.js'
	export default {
		components: {
			Tarbar, ShopBox, ShopIndex, ShopGoods, ShopCate
		},
		data() {
			return {
				loading: true,
				scrollBottomIndex: 0,
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				back:true,
				keyword: '',
				shopNum: '',
				shopInfo: {},
				shopBackground: "",
				tjGoodsList: [],  //猜你喜欢
				goodsList: [], 
				value: "",
				pageNum:1,
				isloadData: true,
				currentId: 1,
				hotList: shophostlist_,
				loveGoodsList: [],
				lunbolist: []
			};
		},
		//加载更多
		onReachBottom() {
			this.scrollBottomIndex = this.scrollBottomIndex + 1;
		},
		
		async onLoad(option) {
			//店铺编码
			this.shopNum = option.shopNum;
			this.shopInfo.shopNum = option.shopNum;
			
			var that = this;
			//获取店铺信息
			await shopReq.getShopInfo(option.shopNum).then(res => {
				if(res.code != 200) {
					this.$api.msg("未发现店铺信息，即为为你跳转至首页")
					return;
				}
				this.shopInfo = res.data;
			})
			//设置店铺页面标题
			uni.setNavigationBarTitle({title: that.shopInfo.shopName});
			
			//关闭加载效果
			this.loading = false;
		},
		onPageScroll(obj){
			this.$refs.shopBox.pageScroll(obj.scrollTop);
			if(this.$refs.shopIndex) {
				this.$refs.shopIndex.pageScroll(obj.scrollTop);
			}
			if(this.$refs.shopGoods) {
				this.$refs.shopGoods.pageScroll(obj.scrollTop);
			}
		},
		methods: {
			changeTab(tabId) {
				if(tabId == 4) {
					//客服拨打电话
					uni.makePhoneCall({
						phoneNumber: "'"+this.shopInfo.customerTel+"'",
					});
					return;
				}
				if(this.currentId != tabId) {
					this.currentId = tabId;
				}
			}
		},
	}
</script>

<style lang="scss">

	page {
		background: #f5f5f5;
		font-family: NotoSansHans-Regular;
		padding-bottom: 154rpx;
	}
	
</style>
