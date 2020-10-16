<template>
	<view class="evaluate">
		<!-- 评价内容 -->
		<view  class="evaluate-item"  >
			<view class="header">
				<view class="headerImg">
					<image :src="evaluateContent.memberIcon"  mode=""></image>
				</view>
				<view class="headerNews">
					<view v-if="evaluateContent.anonymousstatus==0">
						{{evaluateContent.memberNickName}}
					</view>
					<view v-if="evaluateContent.anonymousstatus==1">
						匿名用户
					</view>
					<view>
						{{evaluateContent.productsku}}
					</view>
				</view>
			</view>
			<view class="title">
				{{evaluateContent.content}} 
			</view>
			<view class="imgList" v-if="evaluateContent.imgList && evaluateContent.imgList.length > 0" >
				<view class="img-item" v-for="(sItem,j) in evaluateContent.imgList" :key="j">
					<image :src="getImage(sItem)" mode="aspectFit"  @click="imgDetail()"  ></image>
				</view>
				<view class="img-item" v-for="jItem in ['1','2']" :key="jItem" style="height: 0;"></view>   
			</view>
			<!--商家评论-->
			<view class="businessContent"  v-if="businessReplaySize > 0">
				<view class="businessFont">商家回复</view>
				<view class="content"  v-for="(sjItem,m) in  evaluateContent.businessReplay" :key="m"  >
					{{sjItem.content}} 
				</view>
			</view> 
		</view>  
		
		<view class="all-comment">
			<view class="all-title">
				全部评论
			</view>
			<view class="all-content" v-for="(yjItem,i) in evaluateContent.userReplay" :key="i">
				<view class="header" >
					<view class="headerImg">
						<image :src="yjItem.memberIcon"  mode=""></image>
					</view>
					<view class="headerNews">
						<view>
							{{yjItem.memberNickName}}
						</view>
						<view>
							{{yjItem.createTime}}
						</view>
					</view>
				</view>
				<view class="title">
					{{yjItem.content}} 
				</view>
			</view>
		</view>
		<view class="comment-footer" >
			<view :style="{'width': '80%', 'background-color': '#f8f8f8'}">
				<u-input type="textarea" maxlength="150" height="70" :auto-height="true"
					 :border="true" v-model="commentContent" :clearable="false"
					 :custom-style='{"border-radius": "9px", "line-height": "29px"}' :trim="true" 
					 :showConfirmBar="false" :fixed="true" placeholder="快来说点什么吧"></u-input>	
			</view>
			<view class="common-oper" >
				<view v-if="isInput">
					<view class="bottom">
						<button @tap.stop='onConfirm'>发送</button>	 
					</view>
				</view>
				<view v-else style="display: flex;">
					<view class="item" @click="userLike(1)" v-if="evaluateContent.ifUserLikes == 1">
						<image src="@/static/comment/icon_like_light.png">点赞
					</view>  
					<view class="item" @click="userLike(0)" v-else>
						<image src="@/static/comment/icon_like.png">点赞
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getEvaluateList,getUserEvaluateList,addUserEvaluate,addGive,cancelGive} from '../../api/Evaluate'; 
	import {mapGetters} from 'vuex';
	import {getImgUrl} from '../../util/common.js'
	
	export default {
		components: {
		},
		data() {
			return {
				goodsId: '',
				orderId:'',
				commentId:'',
				evaluateContent: {}, 	//商品评论
				isVisible: false,
				evaluateList: [],		//评论回复
				commentContent: '',
				ifUserLikes:'',
				businessReplaySize: 0
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
		computed: {
			...mapGetters(['hasLogin']),
			isInput: function () {
			  return this.commentContent.length > 0;
			}
		},
		onLoad(option) {
			//商品ID
			if(option.goodsId) this.goodsId = option.goodsId; 
			//订单ID
			if(option.orderId) this.orderId = option.orderId; 
			//评论ID
			if(option.commentId) this.commentId = option.commentId; 
			
			this.loadEvaluateList(option); 
		}, 
		watch: {
			isVisible(){
				 if(!this.hasLogin) {
					//跳转至登录页 
					uni.navigateTo({
					    url: '/pages/public/login?to=/pages/evaluate/detail?goodsId='+this.goodsId+'&commentId='+this.commentId
							+'&orderId='+this.orderId
					})
				}
			}
		},
		methods: {
			getImage(imgurl) {
				return getImgUrl(imgurl);
			},
			 //新增用户回复评论
			async onConfirm() { 
				var param = {
					"content": this.commentContent,
					"commentId": this.commentId,
					"goodsId": this.goodsId
				}
				if(this.commentContent == ""){
					this.$api.msg("请输入评论内容");
					return;
				} 
				uni.showLoading({
					title: "正在提交..."
				});
				await addUserEvaluate(param).then(res => {
					if (res.code == 200) {
						this.loadEvaluateList();
						this.commentContent="";
					}
				}); 
				uni.hideLoading();
			},
			//查询评价商品列表信息
			loadEvaluateList() {
				var param = {};
				if(this.goodsId != '') param = Object.assign(param, {"goodsId": this.goodsId})
				if(this.commentId != '') param = Object.assign(param, {"commentId": this.commentId})
				if(this.orderId != '') param = Object.assign(param, {"orderId": this.orderId})
				//获取评论信息
				getEvaluateList(param).then(res => {
					if (res.code == 200 && res.data) {
						var data = {};
						//获取商品评论详细信息
						if(res.data.list && res.data.list.length > 0) {
							data = res.data.list[0];
						} else {
							this.$api.msg("抱歉！未查询到相关商品评价信息");
							return;
						}
						//评论ID
						this.commentId = data.id;
						
						//评论图片
						var picsList = [];
						var picsString = data.pics;
						if(picsString && picsString != '') {
							picsList = picsString.split(",");	
						}
						 data.imgList = picsList; 
						 
						 //处理是商家回复还是会员回复
						 var businessReplay = [];
						 var userReplay = [];
						 var commentReplay = data.commentReplayList;
						  commentReplay.forEach(commentReplay => {
							 var type = commentReplay.type;
							 //商家回复
							 if(type == 1){
								 businessReplay.push(commentReplay);
							 }  
							 if(type == 0){
								 userReplay.push(commentReplay);
							 }
						  });
						  //商家回复
						  data.businessReplay = businessReplay;
						  this.businessReplaySize = businessReplay.length;
						  //用户回复
						  data.userReplay = userReplay;
					      this.evaluateContent = data;
					}
				});
			},
			//跳转到详情页面
			imgDetail(){ 
				uni.navigateTo({
					url: '/pages/evaluate/ImgList?commentId=' + this.evaluateContent.id
				});
			},
			//用户点赞和取消点赞
			userLike(type) {
				var param = {
					"id": this.commentId
				}
				if(type==0){
					addGive(param).then(res => {
						if (res.code == 200) {
							uni.navigateTo({
								url: '/pages/evaluate/detail?goodsId='+this.goodsId+"&memberId="+this.commentId
							});
						}
					});
				}else{
					cancelGive(param).then(res => {
						if (res.code == 200) {
							uni.navigateTo({
								url: '/pages/evaluate/detail?goodsId='+this.goodsId+"&memberId="+this.commentId
							});
						}
					});
				}
				
			},
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
				word-wrap:break-word;
				word-spacing:normal;
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
		}
		
		.all-comment{
			background-color: #fff;
			margin-top: 20rpx;
			.all-title {
				height: 93rpx;
				line-height: 93rpx;
				padding-left: 31rpx;
				font-family: PingFang-SC-Medium;
				font-size: 32rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #313131;
				border-bottom: 1rpx solid #e5e5e5;
			}
			.all-content {
				padding: 40rpx 30rpx 32rpx;
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
					padding: 32rpx 0 32rpx 96rpx;
					width: 673rpx;
					font-size: 26rpx;
					color: #313131;
					word-wrap:break-word;word-spacing:normal;
				}
			}
		}
	}
	.comment-footer {
		//height: 95rpx;
		padding: 15rpx;
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		background-color: white;
		display: flex;
		
		.common-oper{
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
			margin: 0 auto;
				
			.item{
				margin: 0rpx 16rpx;
				font-family: PingFang-SC-Medium;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #666666;
				line-height: 72rpx;
				image {
					position: relative;
					bottom: -5rpx;
					margin-right: 10rpx;
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		
		input {
			height: 33px;
			border-radius: 9px;
			border: 0.5px solid #e5e5e5;
			padding: 2px 5px;
			background-color: #f8f8f8;
		}
		
		.bottom {
		    flex-direction: row;
		    align-items: center;
		    display: flex;
			position: absolute;
			bottom: 13px;
			right: 13px;
		    button {
		        align-self: flex-end;
		        font-size: 24rpx;
		        font-family: PingFangSC-Regular, PingFang SC;
		        font-weight: 400;
		        color: rgba(255, 255, 255, 1);
		        width: 120rpx;
		        height: 60rpx;
				line-height: 60rpx;
		        background: linear-gradient(133deg, rgba(255, 170, 0, 1) 0%, rgba(241, 0, 21, 1) 100%);
		        border-radius: 17px;
		    }
		    button::after {
		        border: 0;
		    }
		    .menu {
		        flex: 1;
		        flex-direction: row;
		        align-items: center;
		        display: flex;
		        .item {
		            margin-right: 10rpx;
		            flex-direction: column;
		            display: flex;
		            align-items: center;
		            justify-content: center;
		            image {
		                width: 40rpx;
		                height: 40rpx;
		            }
		            text {
		                margin: 10rpx 0 0;
		                font-size: 22rpx;
		                color: rgba(51, 51, 51, 1);
		            }
		        }
		    }
		}
	}
	.bottom {
		position: absolute;
		bottom: 26rpx;
		right: 26rpx;
	    button {
	        align-self: flex-end;
	        font-size: 24rpx;
	        font-family: PingFangSC-Regular, PingFang SC;
	        font-weight: 400;
	        color: rgba(255, 255, 255, 1);
	        height: 60rpx;
			line-height: 60rpx;
	        background: linear-gradient(133deg, rgba(255, 170, 0, 1) 0%, rgba(241, 0, 21, 1) 100%);
	        border-radius: 17px;
	    }
	    button::after {
	        border: 0;
	    }
	    .menu {
	        flex: 1;
	        flex-direction: row;
	        align-items: center;
	        display: flex;
	        .item {
	            margin-right: 10rpx;
	            flex-direction: column;
	            display: flex;
	            align-items: center;
	            justify-content: center;
	            image {
	                width: 40rpx;
	                height: 40rpx;
	            }
	            text {
	                margin: 10rpx 0 0;
	                font-size: 22rpx;
	                color: rgba(51, 51, 51, 1);
	            }
	        }
	    }
	}
</style>
