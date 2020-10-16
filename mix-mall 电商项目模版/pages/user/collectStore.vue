<!-- 收藏店铺页面 -->
<template>
	<view class="collectStore-constainer">
		<!-- 商铺列表 	 -->
		<view class="store-list" v-if="storeList.length">
			<movable-area class="store-item" v-for="(item,index) in storeList" :key="index">
				<movable-view direction="horizontal" 
				:x="shopItemActive==index? x:0"  
				class="store-content" 
				:animation="animation"
				@change="hMoveListItem($event,index)"  
				@touchstart="hTouchStart" 
				@touchend="hTouchEnd($event,index)" 
				>
					<view class="store-wrap" @tap="hTapStoreItem(index)">
						<!-- 左侧商品图 -->
						<view class="store-show">
							<image class="show-img" lazy-load="true" :src="getImage(item.shopLogo)" mode=""></image>
						</view>
						<!-- 右侧详情 -->
						<view class="store-desc">
							<view class="name">
								{{item.shopName}}
							</view>
							<view class="follow">
								关注人数：{{item.followNumber}}
							</view>
						</view>
						<!-- 右侧更多按钮 -->
						<view class="more-wrap">
							<image class="more-img" src="@/static/user/store_more.png" mode="widthFix"></image>
						</view>
					</view>
					<!-- 右侧按钮组 -->
					<view class="item-btn" id="btn" @tap="hTapCancelFollow(index,item)">取消关注</view>
				</movable-view>
			</movable-area>
		</view>
	</view>
</template>

<script>
	import {getShopList,cancelShopFollow} from '../../api/Shop.js'
	import {getImgUrl} from '../../util/common.js'
	export default {
		data(){
			return{
				// 商铺列表
				storeList:[],
				x:0,
				oldX:0,
				// 手指上次坐标
				touchPageX:375,
				timer:'',
				animation:true,
				// 当前被操作的元素
				shopItemActive:0,
				// 上次被操作的元素
				lastItem:-1,
				paramsData:{
					pageNum:1,
					pageSize:10
				},
				nextPage:true
			}
		},
		onLoad() {
			this.getShopAllList(this.paramsData)
			//this.getCollectionList(this.paramsData);
		},
		//加载更多
		onReachBottom() {
			//this.loadData();
			if(this.nextPage){
			console.log("加载更多")
			this.paramsData.pageNum = this.paramsData.pageNum+1;
			console.log(this.paramsData)
			this.getShopAllList(this.paramsData);
			}
		},
		methods:{
			getShopAllList(paramsData) {
				getShopList(paramsData).then(res => {
					console.log(res)
					if("200"==res.code){
						if(res.data.list.length<=0){
							this.nextPage=false;
						}
						 this.storeList=this.storeList.concat(res.data.list)
					}
				})
			},
			getImage(imgurl) {
			    return getImgUrl(imgurl);
			},
			hTapBackIcon(){
				uni.navigateBack()
			}, 
				// 发送用户token 获取用户关注代表列表 
				//const res = await this.$api.json('storeList')
			hTouchStart(e,index) {
				this.touchPageX = e.changedTouches[0].pageX
			},
			hTouchEnd(e,index){
				if(this.shopItemActive !=index) {
					if(this.touchPageX<e.changedTouches[0].pageX){
						return 
					}
					if(this.x==0){
						this.x = 100
					}
					// 操作其他项 将之前元素滚回0
					this.$nextTick(()=>{
						console.log('改变了激活项',this.x ,this.shopItemActive)
						this.x = 0
						this.shopItemActive = index
					})
				}
			},
			hMoveListItem(e,index) {
				// 如果滚动处理函数非当前操作元素触发  逻辑终止
				if(index!=this.shopItemActive){
					return 
				}
				console.log('滚动事件',index,this.x,this.oldX,e.target.x)
				this.oldX = e.target.x
				// 点击取消关注 关闭动画期间
				if(!this.animation){
					console.log('动画关闭了',e.target.x)
					return this.x = 0
				}
				// 每次滑动清除上次定时器  设置新定时器
				clearTimeout(this.timer)
				this.timer =setTimeout(()=>{
					// 根据手指离开屏幕 滑动的最后位置判断   是否要展示右侧按钮
					console.log('定时器执行了',index,this.x,this.oldX,e.target.x)
					const x = this.oldX
					let btnBoxWidth = ''
					const query = uni.createSelectorQuery().in(this);
					query.select('#btn').boundingClientRect(data => {
						btnBoxWidth =   data.width/2 *-1
						btnBoxWidth = x>btnBoxWidth?  0 :btnBoxWidth*2
						if(this.x==btnBoxWidth){
							this.x = x
						}
						this.$nextTick(()=>{
							this.x = btnBoxWidth
						})
					}).exec();
				},150)
			},
			hTapStoreItem(){
				
			},
			// 点击取消商铺
			hTapCancelFollow(index,item) {
				// 发送请求 发送店铺id取消关注店铺
				const storeId = this.storeList[index].storeId
				console.log('取消关注店铺索引',index,storeId)
				// 请求成功 删除本地数据
				this.animation = false
				// this.shopItemActive = -1
				console.log('x',this.x,this.oldX)
				if(this.x==0){
					this.x = 100
				}
				// 让当前盒子恢复到默认位置 然后删除该项盒子在添加动画属性
				this.$nextTick(()=>{
					this.x = 0
					// this.shopItemActive = 'none'
					this.storeList.splice(index,1)
					this.animation = true
				});
				cancelShopFollow({"shopNum": item.shopNum}).then(res => {
						console.info("取消关注===",res);
						if(res.code=200){
							this.storeList=[];
							this.getShopAllList(this.paramsData);
						}
					}); 
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}
	.collectStore-constainer {
		line-height: 1;
		background-color: #f8f8f8;
		padding-top: 15rpx;
	}
	// 顶部导航
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 750rpx;
		height: 95rpx;
		text-align: center;
		line-height: 95rpx;
		background-color: #fff;
		.left-btn {
			position: absolute;
			top: 0;
			left: 0;
			padding:0 30rpx;
			height: 100%;
			z-index: 100;
			.arrow-icon {
				width: 20rpx;
				height: 34rpx;
			}
		}
		.title {
			font-family: PingFang-SC-Medium;
			height: 100%;
			font-size: 36rpx;
			font-weight: bold;
			color: #232323;
		}
	}
	
	// 商铺列表
	.store-list {
		width: 750rpx;
		background-color: #fff;
		padding-bottom: 40rpx;
		.store-item {
			width: 750rpx;
			height: 160rpx;
			overflow: hidden;
		}
		.store-content {
			position: relative;
			width: 750rpx;
			padding-right: 130rpx;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: cneter;
		}
		.store-wrap {
			width: 750rpx;
			height: 100%;
			margin: 0 30rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #e5e5e5;
			
			.store-show {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50rpx;
				overflow: hidden;
				.show-img {
					width: 100%;
					height: 100%;
					vertical-align: top;
				}
			}
			.store-desc {
				padding-left: 27rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				font-family: PingFang-SC-Medium;
				.name {
					font-size: 28rpx;
					font-weight: bold;
					color: #313131;
				}
				.follow {
					margin-top: 19rpx;
					font-size: 24rpx;
					color: #999999;
				}
			}
			.more-wrap {
				margin-left: auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				width: 84rpx;
				.more-img {
					width: 24rpx;
					height: 4rpx;
					vertical-align: top;
				}
			}
		}
		
		.item-btn {
			position: absolute;
			top: 0;
			left: 750rpx;
			height: 100%;
			width: 130rpx;
			overflow: hidden;
			line-height: 160rpx;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: bold;
			color: #FFFFFF;
			background-color: #f38f3e;
			text-align: center;
		}
	}
	
</style>
