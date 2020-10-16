<template>

	<view>
		<!-- 标题 -->
		<view class="navigation">
			<view class="left-btn" @tap="hTapBackIcon">
				<image class="arrow-icon" src="../../static/common/back_icon.png" mode="widthFix"></image>
			</view>
			<view class="title">
				问题反馈
			</view>
		</view>
		<view style="height: 95rpx;"></view>
		<!-- 内容区 -->
		<view class="operation">
			<view class="debugging">
				<view class="operation_1">
					<view style="font-size: 30rpx;padding: 42rpx 0;">请描述您遇到的问题</view>
				</view>

			</view>
			<textarea class="comment" v-model="content" maxlength="500" placeholder="请填写三字以上的反馈">

			</textarea>
			<view style="position:absolute;top:37vh;margin-top:-50rpx;margin-left:-25rpx;">
				<robby-image-upload v-model="fileList" @delete="deleteImage" @add="addImage" :limit="5"></robby-image-upload>
				<!-- <u-upload :action="action" :file-list="fileList"></u-upload> -->
			</view>
			<text style="color:#C0C4CC; position: absolute;top: 43vh; right: 70rpx;font-size: 26rpx;">{{content.length}}/500</text>
		</view>
		<view class="complete" @click="sucBtn">
			提交
		</view>
	</view>
</template>

<script>
	import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue'
	import {addFeedback} from '../../api/User.js'
	import {fileUpload} from '../../util/request.js'
	export default {
		data() {
			return {
				action: '',
				fileList: [],
				/* { url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',} */
				value: 1,
				content: "",
				imageUrls:[],
			}
		},
		methods: {
			hTapBackIcon() {
				uni.navigateBack()
			},
			//循环上传图片
			async uploadImages() {
				this.imageUrls = [];
				const that = this; 
				this.fileList.forEach(img => {
					fileUpload(img).then(res => {
						res = JSON.parse(res);
						if (res.code === 200){
							that.imageUrls.push(res.data);
						}
					});
				})
			},
			//点击保存
			async sucBtn() {
				uni.showLoading({title: '正在提交'})
				await this.uploadImages();
				var timeout = 3, i = 0, bool = true;
				const that = this; 
				setInterval(function () {
					if(bool && (that.imageUrls.length == that.imgList.length)) {
						that.doSub();
						bool = false;  //停止业务循环
					}
				}, 1000)
			},
			//提交请求
			doSub() {
				var param = {
					"albumPics": this.imageUrls.join(","),
					"content": this.content
				}
				//提交数据
				addFeedback(param).then(res => {
					if (res.code == 200) { 
						//成功之后跳转
						uni.redirectTo({
							url: '/pages/set/set'
						})
					}
					uni.hideLoading()
				});
			},
			deleteImage(e) {
			},
			addImage(e) {
			},

		}


	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
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
	}

	.left-btn {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0 30rpx;
		height: 100%;
		z-index: 100;
	}

	.arrow-icon {
		width: 20rpx;
		height: 34rpx;
	}

	.title {
		font-family: PingFang-SC-Medium;
		height: 100%;
		font-size: 36rpx;
		font-weight: bold;
		color: #232323;
	}

	/* 内容区 */


	.operation {
		width: 100%;
		height: 43vh;
		background-color: #FFFFFF;

		padding: 10rpx 20rpx;

	}

	.debugging {
		display: flex;
	}

	.operation_1 {
		color: #313131;

	}

	.operation_2 {
		position: absolute;
		right: 40rpx;

	}

	.comment {
		width: 690rpx;
		height: 400rpx;
		border-radius: 20rpx;
		background-color: #F8F8F8;
		overflow-y: scroll;
		padding: 20rpx 20rpx;
		font-size: 24rpx;
		
	}

	/deep/.u-list-item {
		width: 120rpx !important;
		height: 120rpx !important;
		font-size: 2vw;
	}

	/deep/.u-add-tips {
		margin-top: 24rpx !important;
		line-height: 20rpx !important;
	}
	
	.complete {
		margin-top: 90rpx;
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #db2929;
		border-radius: 45rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
