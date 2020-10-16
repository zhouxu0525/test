<template>
	<view class="app">
		<view class="price-box">
			<text>{{orderInfo.orderSn}}</text>
			<text>支付金额</text>
			<text class="price">{{orderInfo.totalAmount}}</text>
		</view>

		<view class="pay-type-list" v-for="(item,index) in payChannelList" :key="index">
			<view class="type-item b-b" @click="changePayType(item.id)">
				<text class="icon yticon icon-weixinzhifu" v-if="item.code=='2222'"></text>
				<text class="icon yticon icon-alipay" v-if="item.code=='1111'"></text>
				<view class="con">
					<text class="tit">{{item.name}}</text>
					<text>{{item.text}}</text>
				</view>
				<label class="radio">
					<radio :value="toStr(item.id)" color="#fa436a" :checked='payType == item.id' />
					</radio>
				</label>
			</view>
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import {
		getPayOrderInfo,
		getPayChannelList,
		pay
	} from '../../api/Pay';

	export default {
		data() {
			return {
				payType: 0,
				appId: 0,
				orderInfo: {},
				payChannelList: {}
			};
		},
		computed: {

		},
		onLoad(options) {
			console.log(options.orderSn); //打印出上个页面传递的参数。
			this.getPayOrderInfo(options.orderSn);
		},

		methods: {
			//获取订单详情
			getPayOrderInfo(orderSn) {
				getPayOrderInfo(orderSn).then(res => {
					console.log(res)
					if ("SECCESS" == res.return_code) { //成功
						this.orderInfo = res.data;
						//获取支付方式
						getPayChannelList(res.data.appId).then(res => {
							console.log(res)
							if ("SECCESS" == res.return_code) {
								this.payChannelList = res.data;
							}
						});
					}
				});
			},
			//选择支付方式
			changePayType(id) {
				for (let i = 0; i < this.payChannelList.length; i++) {
					if (this.payChannelList[i].id === id) {
						this.payType = id;
						break;
					}

				}
			},
			//确认支付
			confirm: async function() {
				//获取支付方式
				console.log(this.payType)
				if (this.payType == 0) {
					this.$api.msg("请选择支付方式");
					return;
				}
				pay({
					"orderSn": this.orderInfo.orderSn,
					"channelId": this.payType
				}).then(res => {
					console.log(res)
					if ("SECCESS" == res.return_code) {
					    if("1111"==res.return_msg){
						var form = res.data;
						console.log(form)
						const div = document.createElement("divform");
						div.innerHTML = form;
						document.body.appendChild(div);
						// document.forms[0].acceptCharset = "GBK";
						//保持与支付宝默认编码格式一致，如果不一致将会出现：调试错误，请回到请求来源地，重新发起请求，错误代码 invalid-signature 错误原因: 验签出错，建议检查签名字符串或签名私钥与应用公钥是否匹配
						document.forms[0].submit();
                        }
					} else {
						this.$api.msg("支付失败");
					}
				});

				// uni.redirectTo({
				// 	url: '/pages/money/paySuccess'
				// })
			},
			toStr(value) {
				return value.toString();
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #909399;

		.price {
			font-size: 50rpx;
			color: #303133;
			margin-top: 12rpx;

			&:before {
				content: '￥';
				font-size: 40rpx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20rpx;
		background-color: #fff;
		padding-left: 60rpx;

		.type-item {
			height: 120rpx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60rpx;
			font-size: 30rpx;
			position: relative;
		}

		.icon {
			width: 100rpx;
			font-size: 52rpx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4rpx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 80rpx;
		margin: 80upx auto 30rpx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
