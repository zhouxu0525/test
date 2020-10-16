<!-- 物流详情 -->
<template>
	<view class="logisticsDetails">
		<view class="orderDetails">
			<view class="orderDetailsItem">
				<view class="label">
					物流单号:
				</view>
				<view class="text">
					{{logistics.deliverySn}}
				</view>
				<view class="btn" @click="copy(logistics.deliverySn)">
					复制
				</view>
			</view>
			<view class="orderDetailsItem">
				<view class="label">
					快递公司:
				</view>
				<view class="text">
					{{logistics.deliveryCompany}}
				</view>
			</view>
		</view>
		<!-- 时间轴物流详情   -->
		<view class="TimeLine">
			<u-time-line>
				<u-time-line-item v-if="type==true" v-for="(item,i) in list" :key="i">
					<!-- <template v-slot:node v-if="i === 0"> -->
					<template v-if="i === 0">
						<view class="u-node">
							<image src="@/static/icon_sel.png" mode=""></image>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">待取件</view>
							<view class="u-order-desc">[自提柜]1，直走前方53.6米，左拐约10步，再右拐直走，见一红灯笼停下，叩门三下，喊“芝麻开门”即可。</view>
							<view class="u-order-time">2019-05-08 12:12</view>
						</view>
					</template>
				</u-time-line-item>
				<u-time-line-item v-if="logistics.positionList != null" v-for="(item,i) in logistics.positionList" :key="i">
					<!-- <template v-slot:node v-if="i === 0"> -->
					<template  v-if="i === 0">
						<view class="u-node">
							<image src="@/static/icon_sel.png" mode=""></image>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title" v-if="i === 0">{{item.status | formatContext}}</view>
							<view class="u-order-title" v-else-if="logistics.positionList[i].status != logistics.positionList[i-1].status">{{item.status | formatContext}}</view>
							<view class="u-order-title" v-else-if="logistics.positionList[i].status == logistics.positionList[i-1].status"></view>
							<view class="u-order-desc" >{{item.context}}</view>
							<view class="u-order-time">{{item.time}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
	</view>
</template>

<script>
	import * as logisticsRq from '../../api/Logistics.js'
	export default {
		data() {
			return {
				 list: [1, 2, 3, 4],
				 logistics:{},
				 type:false
			};
		},
		async onLoad(options) {
			uni.showLoading({title: '正在加载'})
			//接收传值
			logisticsRq.getOrderLogistics({"orderId":options.id}).then(res => {
				if(res.code != 200) {
					//跳转至错误页
					this.$api.msg("获取物流信息异常")
				} else {
					//console.log("=====>",JSON.stringify(res.data));
					this.logistics = res.data;
				}
			});
			uni.hideLoading()
		},
		filters:{
			formatContext(str){
				if(str==undefined||str==null||str==""){
					return str;
				}
				switch(str){
					case "在途":{
						return "运输中";
					}
					case "签收":{
						return "已签收";
					}
					case "揽收":{
						return "已揽收";
					}
					case "派件":{
						return "派件中";
					}
				}
				
			}
		},
		methods:{
			copy(value){
				uni.setClipboardData({ 
					data:value, 
					success:function(data){
						this.$api.msg("复制成功！")
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f8f8f8;
		font-family: PingFang-SC-Med
	}

	.orderDetails {
		height: 166rpx;
		width: 750rpx;
		padding: 20rpx 30rpx 27rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.orderDetailsItem {
			display: flex;

			.label {
				font-size: 24rpx;
				color: #313131;
			}

			.text {
				font-family: DINPro-Medium;
				font-size: 24rpx;
				font-weight: bold;
				color: #313131;
				margin-left: 30rpx;
			}

			.btn {
				width: 64rpx;
				height: 32rpx;
				border-radius: 16rpx;
				border: solid 1rpx #db2929;
				font-size: 20rpx;
				color: #db2929;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 44rpx;
			}
		}
	}

	.TimeLine {
		margin-top: 20rpx;
		width: 750rpx;
		background-color: #ffffff;
		padding: 36rpx 30rpx 50rpx;

		.u-node {
			width: 28rpx;
			height: 28rpx;

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}

		.u-order-title {
			font-size: 32rpx;
			color: #313131;
		}

		.u-order-desc {
			font-size: 24rpx;
			color: #232323;
			margin-top: 20rpx;
		}

		.u-order-time {
			font-size: 24rpx;
			color: #8d8d8d;
			margin-top: 17rpx;
		}
	}
</style>
