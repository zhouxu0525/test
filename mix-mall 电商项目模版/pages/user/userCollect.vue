<!-- 我的收藏页面 -->
<template>
	<view class="collect_container">
		<!-- #ifdef H5 -->
		<!-- 顶部导航 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="@/static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				我的收藏
			</view>
			<view class="right-btn">
				<view class="edit-btn" @tap="hTapEdit">{{collectListEditStatus? '编辑':'完成'}}</view>
				<view class="show-mode" @tap="hTapShowMode">
					<image v-if="collectListShowMode" class="mode-img" src="@/static/user/collect_mode1.png" mode="widthFix"></image>
					<image v-else class="mode-img" src="@/static/user/collect_mode2.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!-- 标题栏和状态栏占位符 -->
		<view class="titleNview-placing"></view>
		<!-- #endif -->
			
		<!-- 商品列表	 -->
		<view class="commodity-list" v-if="collectListShowMode">
			<movable-area class="commodity-item" v-for="(item,index) in collectList" :key="item.id">
				<movable-view direction="horizontal" :style="{'paddingRight':collectListEditStatus? '260rpx':0}" :x="shopItemActive==index? x:0"  class="commodity-content"  @change="hMoveListItem($event,index)" @touchmove="hTouchItem($event,index)" >
					<view class="commodity-wrap" @tap="hTapEditItem(item)">
						<!-- 左侧编辑按钮 -->
						<view class="edit-wrap" v-if="!collectListEditStatus">
							<image v-if="isChoose(index)" class="edit-img" src="@/static/user/icon_sel.png" mode="widthFix"></image>
							<image v-else class="edit-img" src="@/static/user/icon_nor.png" mode="widthFix"></image>
						</view>
						<!-- 左侧商品图 -->
						<view class="commodity-show">
							<image class="show-img" :src="getImage(item.productPic)" mode="widthFix"></image>
						</view>
						<!-- 右侧详情 -->
						<view class="commodity-desc">
							<view class="title">{{item.productName}}</view>
							<view class="store">
								<image class="store-icon" src="@/static/common/icon_shop.png" mode="widthFix"></image>{{item.shopName}}
							</view>
							<view class="btm-wrap">
								<view class="price">
									￥<view class="amount">{{item.productPrice}}</view>
								</view>
<!--								<view v-if="collectListEditStatus" @tap="hTapFindSame" class="similarity-btn">找相似</view>-->
							</view>
						</view>
					
					</view>
					<!-- 右侧按钮组 -->
					<view class="item-btn" id="btn" >
						<view @tap="hTapGoStore(item.shopNum)" class="goStore-btn">去店铺</view>
						<view @tap="hDelOne(index,item.productId)" class="del-btn">删除</view>
					</view>
				</movable-view>
			</movable-area>
		</view>

		<!-- 商品列表宫格 -->
		<view class="commodity-grid" v-if="!collectListShowMode">
			<view class="grid-item" v-for="(item,index) in collectList" :key="item.id"  @tap="hTapEditItem(item)">
				<image class="grid-img" :src="getImage(item.productPic)" mode="widthFix"></image>
				<view class="edit-wrap" v-if="!collectListEditStatus">
					<image v-if="isChoose(index)" class="edit-img" src="@/static/user/icon_sel.png" mode="widthFix"></image>
					<image v-if="!isChoose(index)"  class="edit-img" src="@/static/user/icon_nor.png" mode="widthFix"></image>
					<view v-if="isChoose(index)" class="grid-mask"></view>
				</view>

			</view>
			<view v-if="collectList.length%3==2" class="grid-item holder"></view>
			<view v-if="collectList.length%3==1" class="grid-item holder"></view>
		</view>
		<!-- 底部全选操作栏 -->
		<view class="edit-bar" v-if="!collectListEditStatus">
			<view class="choose-wrap" @tap="hTapAllChoose">
				<image v-if="isAllChoose" class="edit-img" src="@/static/user/icon_sel.png" mode="widthFix"></image>
				<image v-else class="edit-img" src="@/static/user/icon_nor.png" mode="widthFix"></image>全选
			</view>
			<view class="del-btn" @tap="hTapDel" >
				删除
			</view>
		</view>
	</view>
</template>
<script>

// 导入列表测试数据
import {getCollectionList} from '../../api/Collection';
import {deleteProductCollection} from '../../api/Product';
import {getImgUrl} from '../../util/common.js'
import {mapGetters} from 'vuex';

	export default {
		data() {
			return {
				// 收藏列表显示模式 true:列表 false: 宫格
				collectListShowMode:true,
				// 编辑状态 true:编辑 false: 完成
				collectListEditStatus:true,
				x:0,
				oldX:0,
				timer:'',
				// 当前被操作的元素
				shopItemActive:0,
				collectList:[],
				// 请求参数
				paramsData:{
					// 第几页数据
					pageNum:1,
					// 每页数据条数
					pageSize:5
				},
				// 已勾选商品
				chooseList:[],
				nextPage:true
			}
		},
		onLoad() {
			if(this.checkLoginTo()){
			this.getCollectionList(this.paramsData);
			}

		},
		//下拉刷新
		onPullDownRefresh() {
		},
		//加载更多
		onReachBottom() {
			if(this.nextPage){
			this.paramsData.pageNum = this.paramsData.pageNum+1;
			this.getCollectionList(this.paramsData);
			}
		},
		computed:{
			isAllChoose() {
				if(this.collectList.length==0) return false
				return this.chooseList.length==this.collectList.length? true:false
			},
			...mapGetters(['hasLogin'])
		},
		methods: {
			checkLoginTo() {
				if(!this.hasLogin) {
					//跳转至登录页
					var tourl = encodeURI('/pages/user/userCollect');
					uni.navigateTo({
						url: '/pages/public/login?to=' + tourl
					});
				}
				return this.hasLogin;
			},
			//获取收藏列表
			getCollectionList(paramsData) {
				getCollectionList(paramsData).then(res => {
					if("200"==res.code){
						if(res.data.list.length<=0){
							this.nextPage=false;
						}
						this.collectList=res.data.list
					}
				});
			},
			hTapShowMode(){
				this.collectListEditStatus = true
				this.collectListShowMode = !this.collectListShowMode
				this.chooseList = []
			},
			hTapAllChoose(){
				if(this.collectList.length){
					this.chooseList = this.isAllChoose? []:[...this.collectList]
				}
			},
			hTapBackIcon() {
				uni.navigateBack()
			},
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			hMoveListItem(e,index) {
				// 如果滚动处理函数非当前操作元素触发  逻辑终止
				if(index!=this.shopItemActive){
					return
				}
				this.oldX = e.target.x
				// 每次滑动清除上次定时器  设置新定时器
				clearTimeout(this.timer)
				this.timer =setTimeout(()=>{
					// 根据手指离开屏幕 滑动的最后位置判断   是否要展示右侧按钮
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
			hTapFindSame() {
				uni.showToast({
					title:'点击了找相同按钮'
				})
			},
			// 点击编辑 完成按钮
			hTapEdit(){
				this.chooseList = []
				this.x= 0
				this.collectListEditStatus =!this.collectListEditStatus
			},
			isChoose(i) {
				for(let index=0;index<this.chooseList.length;index++){
					if(this.collectList[i] == this.chooseList[index])return true
				}
				return false
			},
			hTouchItem(e,index){
				// 当前操作的第几项
				if(this.shopItemActive !=index) {
					// 操作其他项 将之前元素滚回0
					const offsetLeft = e.target.offsetLeft
					// 判断是否向左滑动
					// if(offsetLeft==0) {
						// 如果向左滑动 就让其他盒子滚动到原位
						this.$nextTick(()=>{
							this.x = 0
							this.shopItemActive = index
						})
					// }
				}
			},
			// 去商铺
			hTapGoStore(i) {
				this.$nextTick(()=>{
					this.x = 0
					this.shopItemActive = ''
				})
				//跳转店铺
				uni.navigateTo({
					url: '/pages/shop/index?shopNum=' + i
				});
				// uni.showToast({
				// 	title:'点击了去商铺'+i
				// })
			},
			hTapDel() {
				if(!this.chooseList.length||!this.collectList.length)return
				for(let index = 0;index<this.chooseList.length;index++){
					for(let i = 0;i<this.collectList.length;i++){
						if(this.collectList[i]==this.chooseList[index]){
							this.collectList.splice(i,1)
						}
					}
				}
				console.log(this.chooseList)
				//批量删除商品收藏
				var ids=[];
				this.chooseList.forEach(function(item, index) {
					ids.push(item.productId)
				})
				deleteProductCollection({"ids": ids}).then(res => {
					if(res.code != 200) {
						this.$api.msg("抱歉！未能将商品移除收藏")
					} else {
						this.favorite = false;
						this.$api.msg("删除成功!");
						this.getCollectionList(this.paramsData)
					}
				})
				this.chooseList = []
			},
			// 点击了删除
			hDelOne(i,productId){
				this.$nextTick(()=>{
					this.x = 0
					this.shopItemActive = ''
				//	this.collectList.splice(i,1)
					//删除商品收藏
					deleteProductCollection({"ids": productId}).then(res => {
						if(res.code != 200) {
							this.$api.msg("抱歉！未能将此商品移除收藏")
						} else {
							this.favorite = false;
							this.$api.msg("删除成功!");
							this.getCollectionList(this.paramsData)
						}
					})
				})
			},
			// 选择或取消商品某一项
			hTapEditItem(item) {
				// 非编辑状态终止
				if(this.collectListEditStatus){
					//跳转商品详情
					uni.navigateTo({
						url: '/pages/product/product?id=' + item.productId
					});
					return
				}
				let indexOf = -1
				if(this.chooseList.length!=0){
					for(let index=0;index<this.chooseList.length;index++){
						if(item.id == this.chooseList[index].id){
							indexOf=index
						}
					}
					if(indexOf!=-1) {
						this.chooseList.splice(indexOf,1)
					}
				}
				if(indexOf==-1){
					this.chooseList.push(item)
				}
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}
	.titleNview-placing {
		height: var(--status-bar-height);
		padding-top: 44px;
		box-sizing: content-box;
	}
	.collect_container {
		line-height: 1;
		background-color:#F5F5F5;
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
		.right-btn {
			position: absolute;
			right: 0;
			top: 0;
			padding-right: 30rpx;
			height: 100%;
			z-index: 100;
			display: flex;
			align-items: center;
			.edit-btn {
				height: 100%;
				font-family: PingFang-SC-Medium;
				font-size: 28rpx;
				color: #999999;
				padding:0 15rpx
			}
			.show-mode {
				padding-left: 15rpx;
				height: 100%;
				display: flex;
				align-items: center;
			}
			.mode-img {
				width: 38rpx;
				vertical-align: top;
			}
		}
	}
	
	// 商品列表
	.commodity-list {
		width: 750rpx;
		background-color: #fff;
		margin-top: 40rpx;
		padding-bottom: 40rpx ;
		
		.commodity-item {
			width: 750rpx;
			height: 260rpx;
		}
		.commodity-content {
			position: relative;
			width: 750rpx;
			padding-right: 260rpx;
			height: 100%;
			overflow: hidden;
		}
		.commodity-wrap {
			width: 750rpx;
			padding: 45rpx 30rpx 0;
			display: flex;
			justify-content: space-between;
			// align-items: center;
			float: left;
			.edit-wrap {
				width: 32rpx;
				height: 212rpx;
				display: flex;
				align-items: center;
				.edit-img {
					width: 32rpx;
					height: 32rpx;
					vertical-align: top;
				}
			}
			.commodity-show {
				width: 212rpx;
				height: 212rpx;
				border-radius: 4rpx;
				overflow: hidden;
				background-color: pink;
				.show-img {
					width: 100%;
					height: 100%;
				}
			}
			.commodity-desc {
				position: relative;
				width: 405rpx;
				font-family: PingFang-SC-Medium;
				font-size: 28rpx;
				line-height: 36rpx;
				color: #000000;
				.title {
					width: 100%;
					overflow : hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.store {
					display: flex;
					margin-top: 18rpx;
					align-items: center;
					font-family: PingFang-SC-Medium;
					font-size: 24rpx;
					color: #999999;
				}
				.store-icon {
					width: 28rpx;
					height: 28rpx;
					vertical-align: top;
					margin-right: 13rpx;
				}
				.btm-wrap {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.similarity-btn {
						width: 96rpx;
						height: 42rpx;
						border-radius: 20rpx;
						border: solid 1px #999999;
						font-family: PingFang-SC-Medium;
						font-size: 24rpx;
						display: flex;
						justify-content: center;
						align-items: cneter;
						color: #999999;
					}
				}
				.price {
					display: flex;
					align-items: flex-end;
					font-family: PingFang-SC-Medium;
					font-size: 28rpx;
					font-weight: bold;
					color: #db2929;
				}
				.amount {
					font-size: 40rpx;
				}
			}
		}
		
		.item-btn {
			position: absolute;
			top: 0;
			left: 750rpx;
			height: 100%;
			width: 260rpx;
			overflow: hidden;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: bold;
			.goStore-btn {
				float: left;
				width: 130rpx;
				background-color: #f38f3e;
				line-height: 260rpx;
				color: #ffffff;
				text-align: center;
				
			}
			.del-btn {
				float: left;
				width: 130rpx;
				background-color: #db2929;
				line-height: 260rpx;
				color: #ffffff;
				text-align: center;
			}
		}
	}
		
	// 商品宫格
	.commodity-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30rpx 108rpx;
		overflow: hidden;
		justify-content: space-between;
		background-color: #fff;
		.grid-item{
			position: relative;
			z-index: 1;
			width: 222rpx;
			height: 222rpx;
			background-color: pink;
			border-radius: 5rpx;
			margin-top: 30rpx;
			overflow: hidden;
		}
		.grid-img {
			width: 222rpx;
			height: 222rpx;
		}
		
		.holder {
			visibility: hidden;
		}
		.edit-wrap {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 4;
			.grid-mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 4;
				background-color: rgba(0,0,0,.2)
			}
			.edit-img {
				position: absolute;
				top: 13rpx;
				right:13rpx;
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				background-color: fff;
				z-index: 5;
				vertical-align: top;
			}
		}
	}	
	
	
	.edit-bar {
		width: 750rpx;
		height: 108rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		box-shadow: 0rpx -3rpx 20rpx 0rpx rgba(153, 153, 153, 0.08);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.choose-wrap {
			display: flex;
			align-items: center;
			padding-left: 30rpx;
			height: 100%;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			color: #000000;
			font-size: 24rpx;
		}
		.edit-img {
			width: 32rpx;
			height: 32rpx;
			vertical-align: top;
			margin: 10rpx;
		}
		.del-btn{
			display: flex;
			justify-content: center;
			margin-right: 30rpx;
			align-items: center;
			width: 172rpx;
			height: 72rpx;
			border-radius: 36rpx;
			border: solid 1px #db2929;
			font-family: PingFang-SC-Medium;
			font-size: 28rpx;
			font-weight: bold;
			color: #db2929;
		}
	}
</style>
