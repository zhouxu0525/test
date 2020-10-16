<template>
	<view>
		<view class="card">
			<view class="card_1" @click="navTo('修改头像')" hover-class="cell-hover" :hover-stay-time="50">
				<view class="card_2">头像</view>
				<view class="icon"><img src="../../static/tab-my-current.png"></view>
				<view class="card_3"><img src="../../static/箭头.png"></view>
			</view>

			<view class="card_1" @click="navTo('修改昵称')" hover-class="cell-hover" :hover-stay-time="50">
				<view class="card_2">昵称</view>
				<view class="icon">妖精不走了</view>
				<view class="card_3"><img src="../../static/箭头.png"></view>
			</view>

			<view class="card_1" @click="navTo('修改号码')" hover-class="cell-hover" :hover-stay-time="50">
				<view class="card_2">手机号码</view>
				<view class="icon">18129002819</view>
				<view class="card_3"><img src="../../static/箭头.png"></view>
			</view>

			<view class="card_1" @click="navTo('修改性别')" hover-class="cell-hover" :hover-stay-time="50">
				<view class="card_2">性别</view>

				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input" style="position: absolute;right: 80rpx;">{{array[index]}}</view>
					</picker>
				</view>
				<view  style="position: absolute;right: 40rpx;"><img src="../../static/箭头.png"></view>
			</view>
			<view class="card_1">
				<view class="card_2" style="width: 60%;">出生日期</view>
				<view class="uni-list-cell-db" style="display: flex;">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">

						<view class="uni-input">{{date}}</view>
					</picker>
					<view class="card_4"><img src="../../static/箭头.png"></view>
				</view>
			</view>

		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true,
			})
			return {
				array: ['男', '女',],
				index: 0,
				date: currentDate,
				time: '12:01'

			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		},

	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}


	.cell-hover {
		background: #fafafa;
	}

	.uni-input {
		text-align: right;
		width: 172%;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		color: #999999;

	}

	.icon {
		text-align: right;
		width: 20%;
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		font-weight: normal;
		color: #999999;

	}

	.icon>img {
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		right: 10%;
	}

	.card {
		width: 750rpx;
		height: 498rpx;
		background-color: #ffffff;
	}

	.card_1 {
		display: flex;
		padding-top: 10rpx;
		line-height: 80rpx;
	}

	.card_2 {
		width: 70%;
		padding: 0 29rpx;
		font-family: PingFang-SC-Medium;
		font-size: 28rpx;
		font-weight: bold;
		color: #313131;
	}

	.card_3 {
		line-height: 80rpx;
		padding: 0 20rpx;
	}

	.card_4 {
		line-height: 80rpx;
		margin-left: 110rpx;
	}
</style>
