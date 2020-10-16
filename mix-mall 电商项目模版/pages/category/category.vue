<!-- 分类页面 -->
<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view @click="navToList(titem)" v-if="titem.parentId === item.id" 
						class="t-item" v-for="titem in tlist" :key="titem.id">
						<image :src="getImg(titem.icon)"></image>
						<text class="t-name">{{titem.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {getlist} from '../../api/GoodsCategory.js'
	import {getImgUrl} from '../../util/common.js'
	
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			getImg(imgurl) {
				return getImgUrl(imgurl);
			},
			async loadData() {
				await getlist().then((res) => {
					if(res.code == 200) {
						let list = res.data;
						list.forEach(item => {
							//一级分类
							this.flist.push(item); 
							//二级分类
							item.children.forEach(s_item => {
								this.slist.push(s_item); 
								//三级分类
								s_item.children.forEach(t_item => {
									this.tlist.push(t_item); //2级分类
								})
							})
						})
					}
				})
			},
			//一级分类点击
			tabtap(item) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				this.currentId = item.id;
				let index = this.slist.findIndex(sitem => sitem.parentId === item.id);
				
				this.tabScrollTop = this.slist[index].top + 44;
			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						console.log(h);
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(cate) {
				uni.navigateTo({
					url: `/pages/product/list?cateId=${cate.id}&title=${cate.name}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #fff;
		border-top: 1px solid #cdced3;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 164rpx;
		height: 100%;
		background-color: #f8f8f8;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 164rpx;
		height: 100rpx;
		font-size: 28rpx;
		color: $font-color-base;
		position: relative;
		
		&.active {
			color: $base-color;
			background: #ffffff;
			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36rpx;
				width: 6rpx;
				background-color: $base-color;
				border-radius: 0rpx 3rpx 3rpx 0rpx;
				opacity: .8;
			}
		}
		/* 去除分类左侧的默认边框 */
		&::after{
			border-bottom: none!important;
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		/* padding-left: 20rpx; */
	}

	.s-item {
		display: flex;
		align-items: center;
		/* width: 56rpx; */
		font-weight: bold;
		height: 27rpx;
		margin: 27rpx 0 28rpx 26rpx;
		font-size: 28rpx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 534rpx;
		background: #fff;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(31, 30, 28, 0.06);
		border-radius: 16rpx;
		padding-top: 12rpx;
		margin-left: 26rpx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176rpx;
		font-size: 26rpx;
		color: #666;
		padding-bottom: 20rpx;

		image {
			width: 100rpx;
			height: 100rpx;
		}
	}

	.t-name {
		height: 23rpx;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0rpx;
		color: #313131;
		margin-top:22rpx;
		margin-bottom:13rpx;
	}
</style>
