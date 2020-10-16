<template>
	 
	<view class="evaluate">
		<view style="width: 100%;margin-top: 300rpx;" v-if="evaluateContentList.length == 0">
			<u-empty text="还没有评论,赶快来评论吧!" mode="list"></u-empty>
		</view>
		<!-- 评价列表 -->
		<view v-for="(item,i) in evaluateContentList" :key="i">
		<view  class="evaluate-item"  >
			<view class="header">
				<view class="headerImg">
					<image :src="item.memberIcon"  mode=""></image>
				</view>
				<view class="headerNews">
					<view v-if="item.anonymousstatus==0">
						{{item.memberNickName}}
					</view>
					<view v-if="item.anonymousstatus==1">
						匿名用户
					</view>
					<view>
						{{item.productsku}}
					</view>
				</view>
			</view>
			<view class="title">
				{{item.content}} 
			</view>
		   <view class="imgList" v-if="item.imgList.length > 0">
				<view class="img-item" v-for="(sItem,j) in item.imgList" :key="j">
					<image :src="getImage(sItem)" @click="imgDetail(item)" mode="aspectFit"></image>
				</view>
				<view class="img-item" v-for="k in ['item1','item1']" :key="k" style="height: 0;"></view>   
			</view>  
			<!--商家评论-->
			  <view class="businessContent"  v-if="item.businessReplay.length > 0">
				<view class="businessFont">商家回复</view>
				<view class="content"  v-for="(sjItem,m) in  item.businessReplay" :key="m"  >
					{{sjItem.content}} 
				</view>
			  </view> 
			  <view class="common-oper">
				<view class="item"><image src="@/static/comment/icon_comment.png" @click="jumpDetail(item)">{{item.userCommentsTotal}}</view>
					<view class="item" v-if="item.ifUserLikes==1"><image src="@/static/comment/icon_like_light.png" @click="userLike(item,1)">点赞</view>  
					<view class="item" v-else><image src="@/static/comment/icon_like.png" @click="userLike(item,0)">点赞</view>
			  </view>
		</view>
    </view>			
		
	</view>
</template>

<script>
	import {getEvaluateList,addGive,cancelGive} from '../../api/Evaluate'; 
	import {getImgUrl} from '../../util/common.js'
	export default {
		data() {
			return {
				//商品得id
				goodsId:null,
				evaluateContentList:[], 
				imgList:[], 
				evaluateList:[],
				paramsData:{
					pageNum:1,
					pageSize:6,
					goodsId:null
				},
				nextPage:true
			}
		},
		filters: {
			//判断是否匿名用户	
			ifAnonymousstatus(value) {
				if (value==0) {
					return "匿名用户"
				}
				return value
			},
		},
		onLoad(option) {
			//获取商品得id
			this.goodsId = option.goodsId; 
			this.paramsData.goodsId=option.goodsId; 
			this.loadEvaluateList(this.paramsData); 
		}, 
		//加载更多
		onReachBottom() {  
			if(this.nextPage){
				this.paramsData.pageNum = this.paramsData.pageNum+1;
				this.loadEvaluateList(this.paramsData);
			}
		},
		methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			//查询评价商品列表信息
			loadEvaluateList(paramsData){ 
				getEvaluateList(paramsData).then(res => {
					if (res.code == 200) { 
						var dataList=res.data.list;
						//处理图片
						dataList.forEach(dataInfo=>{
							//商品评价图片
							var picsList = [];
							var picsString = dataInfo.pics;
							if(dataInfo.pics && dataInfo.pics != '') {
								picsList = picsString.split(",");
							}
							dataInfo.imgList = picsList; 
							
							//处理是商家回复还是会员回复
							var businessReplay=[];
							var userReplay=[];
							var commentReplay=dataInfo.commentReplayList;
							commentReplay.forEach(commentReplay=>{
							 	 var type=commentReplay.type;
							 	 //商家回复
							 	 if(type==1){
							 		 businessReplay.push(commentReplay);
							 	 }  
								 if(type==0){
							 		 userReplay.push(commentReplay);
							 	 }
							  });
							  dataInfo.businessReplay=businessReplay;
							  dataInfo.userReplay=userReplay;
							  
						}); 
						if(dataList.length<=0){
							this.nextPage=false;
						}
						//this.evaluateContentList=dataList;
						 this.evaluateContentList=this.evaluateContentList.concat(dataList);
					}
					
				});
				
			},
			//跳转到详情页面
			imgDetail(obj){ 
				uni.navigateTo({
					url: '/pages/evaluate/ImgList?goodsId='+this.goodsId+'&commentId='+obj.id
				});
			},
			//用户点赞和取消点赞
			userLike(obj,type){ 
				console.info("用户点赞",obj);
				console.info("用户点赞",type);
				var param={
					"id":obj.id
				}
				if(type==0){
					addGive(param).then(res => {
						if (res.code == 200) {
							obj.ifUserLikes=1;
						}
					});
				}else{
					cancelGive(param).then(res => {
						if (res.code == 200) {
							obj.ifUserLikes=0;
						}
					});
				}
				
			},
			//跳转评论详情页面
			jumpDetail(obj){
				uni.navigateTo({
					url: '/pages/evaluate/detail?goodsId='+this.goodsId+"&memberId="+obj.id
				});
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		font-family: PingFang-SC-Medium;
		background: #f8f8f8;
		padding-bottom: 153rpx;
	}
	image{
		width: 100%;
		height: 100%;
	}
	.evaluate{
		// 评价列表
		.evaluate-item{
			padding: 40rpx 30rpx 32rpx;
			background-color: #fff;
			margin-top: 20rpx;
			.header{
				display: flex;
				.headerImg{
					width: 88rpx;
					height: 88rpx;
				}
				.headerNews{
					margin: 8rpx 0 8rpx 17rpx;
					height: 72rpx;
					flex: 1;
					view{
						&:first-child{
							font-size: 32rpx;
							color: #313131;
							height: 30rpx;
						}
						&:last-child{
							margin-top: 19rpx;
							font-size: 24rpx;
							color: #bbbbbb;
							height: 23rpx;
						}
					}
				}
			}
			.title{
				margin: 44rpx 0 32rpx 0;
				width: 673rpx;
				font-size: 26rpx;
				color: #313131;
			}
			.content{ 
				margin: 0px 10px 10px 10px;
				font-family: PingFang-SC-Medium;
				font-size: 26rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 40rpx;
				letter-spacing: 0rpx;
				color: #666666;
				overflow:hidden;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;
			}
			.businessContent{
				margin-top: 19rpx;
				background-color: #f8f8f8;
				border-radius: 10px;
			}
			.businessFont{  
				padding: 10px;
				width: 690rpx;
				font-family: PingFang-SC-Medium;
				font-size: 26rpx;
				font-weight: bold;
				font-stretch: normal;
				line-height: 40rpx;
				letter-spacing: 0rpx;
				color: #313131;
			}
			.allComment{ 
				
				width: 673rpx;
				font-size: 30rpx;
				color: #313131;
			}
			.imgList{
				display: flex;
				flex-wrap: wrap;
				width: 689rpx;
				justify-content: space-between;
				margin-bottom: -18rpx;
				.img-item{
					width: 218rpx;
					height: 218rpx;
					border-radius: 16rpx;
					margin-bottom:18rpx ;
					overflow: hidden;
				}
			}
			.common-oper{
				display: flex;
				flex-wrap: wrap;
				width: 689rpx;
				justify-content: flex-end;
				.item{
					margin: 16rpx;
					font-family: PingFang-SC-Medium;
					font-size: 26rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 0rpx;
					color: #666666;
					line-height: 32rpx;
					image {
						position: relative;
						bottom: -5rpx;
						margin-right: 10rpx;
						width: 30rpx;
					}
				}
			}
		}
		
		/* 底部操作菜单 */
		.page-bottom {
			position: fixed;
			/* left: 30rpx; */
			bottom: 0;
			z-index: 95;
			display: flex;
			/* justify-content: center; */
			align-items: center;
			width: 750rpx;
			height: 108rpx;
			background-color: #ffffff;
			box-shadow: 0rpx -3rpx 20rpx 0rpx rgba(153, 153, 153, 0.08);
		
			.p-b-btn {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 20rpx;
				color: #313131;
				width: 86rpx;
				height: 80rpx;
		
				text {
					margin-top: 11rpx;
				}
		
				.iconimg {
					width: 34rpx;
					height: 35rpx;
				}
		
				.iconimg1 {
					width: 36rpx;
					height: 36rpx;
				}
		
				.iconimg2 {
					width: 36rpx;
					height: 36rpx;
				}
			}
		
			.action-btn-group {
				display: flex;
				height: 76rpx;
				overflow: hidden;
				margin-left: 20rpx;
		
				.action-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 214rpx;
					height: 70rpx;
					border-radius: 35rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #ffffff;
				}
		
				.join {
					background-color: #e6a866;
					margin-right: 24rpx;
				}
		
				.buy {
					background-color: #db2929;
				}
			}
		}
		
	}
</style>
