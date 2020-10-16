<template>
	<view class="content u-skeleton">
		<!-- 自定义导航 -->
		
		<view class="searchTop">
			<view class="searchBox" ref="header">
				<!-- #ifndef H5 -->
				<view class="MD u-skeleton-fillet" style="width: 100%;">
					<image src="@/static/goodList/icon_seach_gray.png" mode="" />
					<input v-model="keyword" type="search" :placeholder="searchPlaceHolder"
						 @confirm="hConfirm" @click="searchClick" :focus="focus"/>
						 <!--@keydown.enter.native="hConfirm" -->
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image src="@/static/goodList/back.png" mode="" class="black" @click="doback"></image>
				<view class="MD u-skeleton-fillet">
					<image src="@/static/goodList/icon_seach_gray.png" mode="" />
					<input v-model="keyword" type="search" :placeholder="searchPlaceHolder"
						 @confirm="hConfirm" @click="searchClick" :focus="focus"/>
						 <!--@keydown.enter.native="hConfirm" -->
				</view>
				<view class="cancel" @tap="doCancel" v-show="searchTip">
					取消
				</view>
				<view class="right-img" @click="toggleList" v-show="!searchTip">
					<image src="@/static/goodList/icon_list.png" v-if="toggle" mode="" />
					<image src="@/static/goodList/icon_card.png" v-else mode="" />
					<!-- <u-badge type="error" class="badge" is-center="true" count="7"></u-badge> -->
				</view>
				<!-- #endif -->
			</view>
		</view>
		
		<!-- 默认页面 -->
		<view class="default-page" v-show="searchTip">
			<!-- 搜索历史 -->
			<view class="search-history" v-if="historyList.length" >
				<view class="list-header">
					搜索历史
					<view class="header-btn" @tap="hTapDelHistory">
						<image class="header-icon" src="@/static/search/icon_qingkong.png"></image>
					</view>
				</view>
				<view class="list-body history-body">
					<view @tap="hTapHotItem(item)" class="body-item" v-for="(item,index) in historyList" :key="index">{{item}}</view>
				</view>
			</view>
			<!-- 热门搜索 -->
			<view class="search-hot">
				<view class="list-header">
					热门搜索
				</view>
				<view class="list-body">
					<view @tap="hTapHotItem(item.keyword)" class="body-item" v-for="(item,index) in hotList" :key="index">{{item.keyword}}</view>
				</view>
			</view>
		</view>
		<view v-show="!searchTip">
			<view class="navbar u-skeleton-fillet" >
				<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
					综合
				</view>
				<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
					销量
				</view>
				<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
					<text>价格</text>
					<view class="p-box">
						<image v-if=" priceOrder === 0" src="@/static/goodList/icon_price_nor.png"></image>
						<image v-else-if="priceOrder === 1 && filterIndex === 2" src="@/static/goodList/icon_price_sel2.png"></image>
						<image v-else src="@/static/goodList/icon_price_sel1.png"></image>
					</view>
				</view>
				<view class="nav-item" :class="{current: filterIndex === 3}" @click="tabClick(3)">
					筛选
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="goods-list" v-if="toggle">
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item"
					@click="navToDetailPage(item)">
					<view class="image-wrapper u-skeleton-fillet">
						<image :src="getImage(item.pic)" mode="aspectFill"></image>
					</view>
					<view class="title u-skeleton-fillet">{{item.name}}</view>
					<view class="price-box u-skeleton-fillet">
						<text class="price">{{item.price}}</text>
						<text>已售 {{item.sale}}</text>
					</view>
				</view>
			</view>
			<view class="goods-list1" v-else>
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item"
					@click="navToDetailPage(item)">
					<view class="image-wrapper u-skeleton-fillet">
						<image :src="getImage(item.pic)" mode="aspectFill"></image>
					</view>
					<view class="good-box">
						<view class="title u-skeleton-fillet">{{item.name}}</view>
						<view class="shop-box u-skeleton-fillet">
							<view class="shopIcon">
								<image :src="getImage(item.shopLogo)" mode=""></image>
							</view>
							<view class="shopName">
								{{item.shopName}}
							</view>
						</view>
						<view class="price-box u-skeleton-fillet">
							<text class="price">{{item.price}}</text>
							<text class="sales">已售 {{item.sale}}</text>
						</view>
					</view>
				</view>
				<view class="fixed">
					<image src="@/static/goodList/icon_top.png" mode=""></image>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
			<!-- 筛选抽屉弹窗 -->
			<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
				<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
					<scroll-view scroll-y class="cate-list">
						<view class="cate-test">
							<view class="cate-name">价格区间</view>
							<view class="ctae-input">
								<view>
									<input type="text" v-model="priceStart" placeholder="最低价" />
								</view>
								-
								<view>
									<input type="text" v-model="priceEnd" placeholder="最高价" />
								</view>
							</view>
						</view>
						<view class="list" v-if="goodsRelate.brandNames">
							<view class="cate-name">品牌</view>
							<view class="cate-item">
								<view v-for="(it, index) in goodsRelate.brandNames" :key="index" 
									:class="{active: it.checked}" @click="changeCate(index, 'brand')">
									{{it.name}}
								</view>
								<!-- 补位元素 -->
								<view v-for="(item,k) in [1,2]" :key="k" style="height: 0;"></view>
							</view>
						</view>
						<view class="list" v-if="goodsRelate.categoryNames">
							<view class="cate-name">分类</view>
							<view class="cate-item">
								<view v-for="(it, index) in goodsRelate.categoryNames" :key="index" 
									:class="{active: it.checked}" @click="changeCate(index, 'category')">
									{{it.name}}
								</view>
								<!-- 补位元素 -->
								<view v-for="(item, k) in [1,2]" :key="k" style="height: 0;"></view>
							</view>
						</view>
						<u-collapse v-if="goodsRelate.productAttrs" v-for="(item, index) in goodsRelate.productAttrs" :key="item.attrId">
							<u-collapse-item :title="item.attrName" class="list">
								<view class="cate-item" >
									<view v-for="(tItem, j) in item.attrValues" :key="j " 
										:class="{active: item.checkedVal == tItem}" @click="changeAttr(index, tItem)">
										{{tItem}}
									</view>
									<!-- 补位元素 -->
									<view v-for="(item,k) in [1,2]" :key="k" style="height: 0;"></view>
								</view>
							</u-collapse-item>
						</u-collapse> 
					</scroll-view>
					<view class="cate-btn">
						<view @click="toggleCateMask('hide')">
							取消
						</view>
						<view @click="searchByRelate">
							确定
						</view>
					</view>
				</view>
			</view>
		</view>	
		<!--骨架屏-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {goodsList_} from '@/util/skeletonJson.js'
	import {setStore,getStore,clearStore} from '@/util/storage.js'
	import {getHotSearchList} from 'from ../../api/HotSearch'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {searchProduct, searchProductRelate} from '../../api/ProductSearch.js'
	import {getImgUrl, isNumber, navigateToBack} from '../../util/common.js'
	
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				focus: false,
				searchTip: true,  //是否展示 热门搜索 提示页
				loading: true,
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				back: false,
				value: null,
				toggle: false,
				loadingType: 'more', //加载更多状态
				searchPlaceHolder: '请输入关键字',
				filterIndex: 0,
				pageSize: 10,
				pageNum: 0,
				sort: 0,		//排序规则：0->按相关度；1->按新品；2->按销量；3->价格从低到高；4->价格从高到低
				cateId: 0, 		//三级分类id
				brandId: 0,	
				shopNum: '',	//店铺编码
				keyword: '',
				priceOrder: 0, 	//1 价格从低到高 2价格从高到低
				priceStart: '',
				priceEnd: '',
				goodsRelate: {},	//商品筛选相关
				goodsList: goodsList_,		//商品列表
				// 热门列表
				hotList:[],
				// 历史搜索列表
				historyList:[]
			};
		},
		async onLoad(options) {
			var t = '';
			this.modSearchPlaceHolder(options);
			//店铺编码
			if(options.shopNum) this.shopNum = options.shopNum;
			//搜索分类
			if(options.cateId) {
				this.cateId = options.cateId;
				this.searchTip = false;
			}
			//搜索关键字
			if(options.keyword) {
				this.keyword = options.keyword;
				this.searchTip = false;
			}
			//搜索品牌
			if(options.brandId) {
				this.brandId = options.brandId;
				this.searchTip = false;
			}
			if(!this.searchTip) {
				//直接筛选商品数据 不展开 热门搜索
				await this.loadData()
			}
			// 从本地获取搜索历史记录
			const historyArr = getStore('MALL_SEARCH_HISTORY_LIST')
			historyArr ? this.historyList = historyArr : ''
			// 获取搜索热门列表
			await this.getHotList()
			//展示热门搜索页
			if(this.searchTip) {
				//隐藏骨架屏加载状态
				this.loading = false;
				this.goodsList = []; 	//去除骨架屏加载填充数据
				this.focus = true
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData();
		},
		//加载更多
		onReachBottom() {
			this.loadData('add');
		},
		methods: {
			modSearchPlaceHolder(options) {
				var t = '';
				if(options.shopNum) t += '店铺内搜索';
				if(options.title) {
					if(options.cateId) t += '分类';
					if(options.brandId) t += '品牌';
					t += '`' + options.title + '`的结果';
				} 
				if(t != '') {
					this.searchPlaceHolder = t;
				}
			},
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//加载相关品牌、分类及筛选属性
			async loadRelateList() {
				//若已筛选出关联数据，则不再加载
				if(typeof(this.goodsRelate.brandNames) != 'undefined'
						|| typeof(this.goodsRelate.productCategoryNames) != 'undefined') {
					return;
				} 
				var param = this.createSearchParam();
				const that = this;
				let goodsRelate = {};
				uni.showLoading({title: '正在加载'})
				await searchProductRelate(param).then(res => {
					if(res.code == 200 && res.data) {
						goodsRelate = res.data;
						//品牌
						let brands = [];
						goodsRelate.brandNames.forEach(b => {
							brands.push({"name": b, "checked": false})
						})
						goodsRelate.brandNames = brands;
						//分类
						let categoryNames = [];
						goodsRelate.productCategoryNames.forEach(c => {
							categoryNames.push({"name": c, "checked": false})
						})
						goodsRelate.categoryNames = categoryNames;
						//参数
						goodsRelate.productAttrs.forEach(b => {
							b.checkedVal = ''
						})
					}
				});
				this.goodsRelate = goodsRelate;
				uni.hideLoading()
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'refresh') {
				this.searchTip = false;
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					//加载下一页商品
					this.loadingType = 'loading';
					this.pageNum = this.pageNum + 1;
				} else {
					//骨架屏加载状态
					this.loading = true;
					//刷新列表
					this.loadingType = 'more';
					this.pageNum = 0;
				}
				//组装商品筛选参数
				var param = this.createSearchParam(type);
				
				const that = this;
				let list = [];
				await searchProduct(param).then(res => {
					if(res.code == 200 && res.data.list) {
						list = res.data.list;
					}
				});
				//当前要查询的页码
				if(this.pageNum == 0) {
					this.goodsList = list;
				} else {
					this.goodsList = this.goodsList.concat(list);
				}
				//判断是否还有下一页，有是more  没有是nomore
				this.loadingType = (list.length < this.pageSize) ? 'nomore' : 'more';
				this.loading = false;
			},
			createSearchParam(type) {
				//当前已选择的Tab页
				if(this.filterIndex == 0) this.sort = 0;
				if(this.filterIndex == 1) this.sort = 2;
				if(this.filterIndex == 2 && this.priceOrder == 1) this.sort = 3;
				if(this.filterIndex == 2 && this.priceOrder == 2) this.sort = 4;
				//普通查询提交参数
				var param = {"pageNum": this.pageNum, "pageSize": this.pageSize, "sort": this.sort};
				//接收入参
				if(this.cateId != 0) {
					param = Object.assign(param, {"productCategoryId": this.cateId})
				}
				if(this.shopNum != '') {
					param = Object.assign(param, {"shopNum": this.shopNum})
				}
				if(this.brandId != 0) {
					param = Object.assign(param, {"brandId": this.brandId})
				}
				if(this.keyword != '') {
					param = Object.assign(param, {"keyword": this.keyword})
				}
				if(isNumber(this.priceStart)) {
					param = Object.assign(param, {"priceStart": this.priceStart})
				}
				if(isNumber(this.priceEnd)) {
					param = Object.assign(param, {"priceEnd": this.priceEnd})
				}
				//筛选提交参数
				if(type == 'relate') {
					var attrkv = {};
					var brand = this.goodsRelate.brandNames.filter((b) => {return b.checked});
					if(brand && brand.length > 0) {
						param = Object.assign(param, {"brandName": brand[0].name})
					}
					var category = this.goodsRelate.categoryNames.filter((c) => {return c.checked});
					if(category && category.length > 0) {
						param = Object.assign(param, {"productCategoryName": category[0].name})
					}
					var attrs = [];
					this.goodsRelate.productAttrs.forEach(a => {
						if(a.checkedVal != '') {
							attrs.push(a.attrName + ":" + a.checkedVal)
						}
					})
					if(attrs.length > 0) {
						var attrstr = attrs.join(";");
						param = Object.assign(param, {"attrValueList": attrstr})
					}
				}
				return param;
			},
			//筛选 “确定”
			searchByRelate() {
				this.loadData('relate');
				//关闭筛选
				this.toggleCateMask("hide");
			},
			//Tab点击
			tabClick(index) {
				//打开筛选抽屉
				if(index === 3) {
					this.cateMaskState = 1;
					this.loadRelateList();
					return;
				}
				//防止重复点击排序页签（价格除外）
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				//价格排序
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				this.loadData('refresh');
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//筛选品牌分类点击
			changeCate(index, type) {
				if(type == 'brand') {
					var bool = true;
					for(var i = 0; i < this.goodsRelate.brandNames.length; i++) {
						if(this.goodsRelate.brandNames[i].checked && i == index) {
							bool = false; //再次点击已选择项，则去除选定状态
						}
						this.goodsRelate.brandNames[i].checked = false;
					}
					if(bool) {
						this.goodsRelate.brandNames[index].checked = true;
					}
				}
				if(type == 'category') {
					var bool = true;
					for(var i = 0; i < this.goodsRelate.categoryNames.length; i++) {
						if(this.goodsRelate.categoryNames[i].checked && i == index) {
							bool = false; //再次点击已选择项，则去除选定状态
						}
						this.goodsRelate.categoryNames[i].checked = false;
					}
					if(bool) {
						this.goodsRelate.categoryNames[index].checked = true;
					}
				}
			},
			//筛选选择参数点击
			changeAttr(index, item) {
				let attrs = this.goodsRelate.productAttrs[index];
				var bool = true;
				attrs.attrValues.forEach(b => {
					if(attrs.checkedVal == item) {
						bool = false;
					}
				})
				this.goodsRelate.productAttrs[index].checkedVal = 
					(bool) ? item : '';
			},
			//详情
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {},
			// 切换列表
			toggleList() {
				this.toggle = !this.toggle
			},
			//获取热门列表
			async getHotList() {
				await getHotSearchList().then(res => {
					if(200 == res.code){
						this.hotList = res.data;
					}
				});
			},
			hTapDelHistory() {
				this.historyList = []
				clearStore('MALL_SEARCH_HISTORY_LIST')
			},
			searchClick() {
				this.searchTip = true;
				// 从本地获取历史记录
				const historyArr = getStore('MALL_SEARCH_HISTORY_LIST')
				historyArr ? this.historyList = historyArr : ''
			},
			async hTapHotItem(name) {
				// 筛选器值
				this.keyword = name
				// 加载商品数据
				this.hConfirm()
			},
			// 按下确认键
			async hConfirm() {
				const keyword = this.keyword.trim()
				if(!keyword){
					this.$api.msg("要先输入你想要的内容奥");
					return;
				}
				// 更新页面历史搜搜记录列表 
				// 判断是否有重复
				let historyList = [...this.historyList]
				const indexOf = this.historyList.findIndex(v => v==keyword)
				if(indexOf != -1) {
					historyList.splice(indexOf,1)
				}
				// 截取历史搜索列表的前十
				historyList = historyList.slice(0,9)
				// 将搜索的关键字添加到历史搜索列表最前面
				historyList.unshift(keyword)
				// 筛选器恢复默认状态
				this.historyList = historyList
				// 更新本地历史历史搜索记录
				setStore('MALL_SEARCH_HISTORY_LIST',historyList)
				this.goodsList = [];
				// 传入请求参数 获取更多数据
				this.loadData()
			},
			doCancel() {
				if(this.goodsList.length > 0) {
					this.searchTip = false;
				} else {
					this.doback()
				}
			},
			doback() {
				navigateToBack()
			}
		},
	}
</script>

<style lang="scss">
	.status_bar {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    z-index: 999;  
	}
	.searchTop{
		width: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
	}

	.searchBox{
		height: 44px;
		font-family: PingFang-SC-Medium;
		// box-shadow: 0rpx 3rpx 20rpx 0rpx rgba(153, 153, 153, 0.12);
		display: flex;
		align-items: center;
	}	
	
	.searchBox .black {
		width: 20rpx;
		height: 34rpx;
		margin-left: 30rpx;
	}

	.MD {
		width: 554rpx;
		height: 64rpx;
		background-color: #eee;
		border-radius: 32rpx;
		margin: 0 29rpx 0 45rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		input {
			width: 500rpx;
			height: 64rpx;
			// border-radius: 32rpx;
		}

		image {
			width: 30rpx;
			height: 30rpx;
			margin: 0 16rpx 0 30rpx;
		}
	}
	.cancel{
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		// padding: 0 30rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		color: #222222;
		flex: 1;
	}
	.right-img {
		width: 41rpx;
		height: 38rpx;
		position: relative;
		margin-right: 31rpx;

		image {
			width: 41rpx;
			height: 38rpx;
		}
	}
	
	.content {
		background: #fff;
		// background: #f8f8f8;
	}

	.content {
		padding-top: 96rpx;
	}

	// 默认页面
	.default-page {
		.list-header {
			margin-top: 48rpx;
			padding-left: 30rpx;
			font-family: PingFang-SC-Medium;
			font-size: 28rpx;
			font-weight: bold;
			color: #313131;
			position: relative;
			.header-btn {
				position: absolute;
				top: 0;
				right: 0;
				height: 100%;
				display: flex;
				align-items: center;
				padding: 0 30rpx;
			}
			.header-icon {
				width: 28rpx;
				height: 28rpx;
				vertical-align: top;
			}
		}
		.history-body {
			max-height: 166rpx;
		}
		.list-body {
			overflow: hidden;
			padding: 0 30rpx;
		}
		.body-item {
			float: left;
			min-width: 90rpx;
			text-align: center;
			margin-right: 18rpx;
			height: 48rpx;
			line-height: 48rpx;
			background-color: #f5f5f5;
			border-radius: 24rpx;
			padding: 0 15rpx;
			margin-top: 35rpx;
			font-family: PingFang-SC-Medium;
			font-size: 22rpx;
			color: #222222;
		}
	}

	.navbar {
		position: fixed;
		left: 0;
		top: 43px;
		display: flex;
		width: 100%;
		height: 80rpx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28rpx;
			color: #313131;
			position: relative;

			&.current {
				font-size: 28rpx;
				font-weight: bold;
				color: #db2929;
			}
		}

		.p-box {
			// display: flex;
			// flex-direction: column;
			margin-left: 8rpx;

			image {
				width: 13rpx;
				height: 19rpx;
			}

			.xia {
				transform: scaleY(-1);
			}
		}
	}

	/* 分类 */

	.cate-mask {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 1000;
		transition: .3s;

		.cate-content {
			width: 618rpx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		height: 100%;
		width: 618rpx;
		padding: 0 30rpx 160rpx 30rpx;

		// 价格区间
		.cate-test {
			margin-top: 90rpx;
			margin-bottom: 40rpx;
			.ctae-input {
				display: flex;
				justify-content: space-between;

				view {
					width: 256rpx;
					height: 64rpx;
					background-color: #f7f7f7;
					border-radius: 30rpx;
					text-align: center;
					line-height: 64rpx;

					input {
						height: 64rpx;
						font-size: 24rpx;
					}
				}
			}
		}

		.cate-name {
			font-size: 28rpx;
			font-weight: bold;
			color: #000000;
			margin-bottom: 24rpx;
			margin-top: 15rpx;
		}


		.list {
			// margin-top: 45rpx;
			// overflow: hidden;
			border-bottom: 1px solid #eee;
			.cate-item {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				padding-bottom: 20rpx;
				// margin-bottom: -20rpx;
				// overflow: hidden;
				view {
					width: 172rpx;
					height: 64rpx;
					background-color: #f7f7f7;
					border-radius: 10rpx;
					font-size: 24rpx;
					color: #333333;
					text-align: center;
					line-height: 64rpx;
					margin-bottom: 10rpx;
					margin-top: 10rpx;
					overflow: hidden;
				}

				.active {
					border: solid 2rpx #db2929;
					color: #f46264;
					background-color: #fff6f6;
				}
				.active1 {
					margin-top: 20rpx;
				}
			}
		}
	}

	.cate-btn {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 618rpx;
		height: 108rpx;
		align-items: center;
		justify-content: space-around;

		view {
			width: 256rpx;
			height: 72rpx;
			border-radius: 36rpx;
			line-height: 72rpx;
			text-align: center;
			font-size: 32rpx;

			&:first-child {
				background-color: #f7f7f7;
				color: #666666;
			}

			&:last-child {
				background-color: #db2929;
				color: #ffffff;
			}
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 30rpx;
		margin-top: 66px;

		.goods-item {
			background: #fff;
			width: 335rpx;
			height: 490rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.04);
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;

			.image-wrapper {
				width: 335rpx;
				height: 335rpx;
				// background-color: #e6e6e6;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					opacity: 1;
				}
			}

			.title,
			.price-box {
				padding: 0 25rpx 0 15rpx;
			}

			.title {
				color: #111111;
				width: 295rpx;
				height: 60rpx;
				margin-top: 20rpx;
				font-size: 24rpx;
				word-break: break-all;
				display: -webkit-box;
				/**对象作为伸缩盒子模型展示**/
				-webkit-box-orient: vertical;
				/**设置或检索伸缩盒子对象的子元素的排列方式**/
				-webkit-line-clamp: 2;
				/**显示的行数**/
				overflow: hidden;
				/**隐藏超出的内容**/
			}

			.price-box {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 10rpx;
				font-size: 24rpx;
				color: #b5b5b5;
			}

			.price {
				font-size: 30rpx;
				color: #db2929;
				line-height: 1;

				&:before {
					content: '￥';
					font-size: 24rpx;
					color: #db2929;
				}
			}
		}
	}


	.goods-list1 {
		margin-top: 66px;
		padding: 0 30rpx;
		background: #fff;
		padding-top: 21rpx;

		.fixed {
			position: fixed;
			bottom: 161rpx;
			right: 31rpx;
			width: 76rpx;
			height: 76rpx;

			image {
				width: 76rpx;
				height: 76rpx;
			}
		}

		.goods-item {
			width: 696rpx;
			height: 220rpx;
			display: flex;
			margin-bottom: 41rpx;

			.image-wrapper {
				width: 220rpx;
				height: 220rpx;

				image {
					width: 220rpx;
					height: 220rpx;
					opacity: 1;
				}
			}

			.good-box {
				width: 452rpx;
				height: 220rpx;
				margin-left: 25rpx;
				font-size: 28rpx;

				.title {
					width: 444rpx;
					// height: 62rpx;
					color: #000000;
					word-break: break-all;
					display: -webkit-box;
					/**对象作为伸缩盒子模型展示**/
					-webkit-box-orient: vertical;
					/**设置或检索伸缩盒子对象的子元素的排列方式**/
					-webkit-line-clamp: 2;
					/**显示的行数**/
					overflow: hidden;
					/**隐藏超出的内容**/
					margin: 9rpx 0 19rpx 0;
				}

				.shop-box {
					height: 26rpx;
					display: flex;
					align-items: center;

					.shopIcon {
						width: 28rpx;
						height: 26rpx;

						image {
							width: 28rpx;
							height: 26rpx;
						}
					}

					.shopName {
						font-size: 24rpx;
						color: #999999;
						margin-left: 13rpx;
						flex: 1;
					}
				}

				.price-box {
					margin-top: 40rpx;
					display: flex;
					align-items: center;

					.price {
						font-size: 40rpx;
						font-weight: bold;
						color: #db2929;

						&::before {
							content: '￥';
							font-size: 28rpx;
							font-weight: bold;
						}
					}

					.sales {
						flex: 1;
						text-align: right;
						font-size: 24rpx;
						color: #999999;

					}
				}
			}
		}
	}
</style>
