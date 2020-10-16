<!-- 魔改后的数字加减 -->
<template>
	<view class="uni-numbox">
		<view @click="_calcValue('minus')" class="uni-numbox__minus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }">-</text>
		</view>
		<view class="uni-numbox__value">
			{{inputValue}}
		</view>
	<!-- 	<input :disabled="disabled" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="inputValue" /> -->
		<view @click="_calcValue('plus')" class="uni-numbox__plus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }">+</text>
		</view>
	</view>
</template>
<script>
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: 0
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", newVal);
				}
			}
		},
		created() {
			this.inputValue = +this.value;
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;
				if (type === "minus") {
					value -= step;
					if (value < this.min) {
						return;
					}
					if (value > this.max) {
						value = this.max
					}
				} else if (type === "plus") {
					value += step;
					if (value > this.max) {
						return;
					}
					if (value < this.min) {
						value = this.min
					}
				}

				this.inputValue = String(value / scale);
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}
		}
	};
</script>
<style lang="scss" scoped>
	$box-height: 35px;
	/* #ifdef APP-NVUE */
	$box-line-height: 35px;
	/* #endif */
	$box-line-height: 26px;
	$box-width: 35px;

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 159rpx;
		height: 42rpx;
		border-radius: 5rpx;
		border: solid 2rpx #f0f0f0;
	}

	.uni-numbox__value {
		background-color: $uni-bg-color;
		width: 71rpx;
		height: 38rpx;
		line-height: 38rpx;
		text-align: center;
		font-size: 24rpx;
		color: #666666;
		// border-width: 1rpx;
		// border-style: solid;
		// border-color: #f0f0f0;
		// border-left-width: 0;
		// border-right-width: 0;
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 44rpx;
		height: 42rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #ededed;
		font-family: PingFangSC-Regular;
		font-size: 29.2rpx;
		// width: $box-width;
		// height: $box-height;
		// // line-height: $box-line-height;
		// // text-align: center;
		// font-size: 20px;
		// color: $uni-text-color;
		// background-color: $uni-bg-color-grey;
		// border-width: 1rpx;
		// border-style: solid;
		// border-color: $uni-border-color;
		// border-top-left-radius: $uni-border-radius-base;
		// border-bottom-left-radius: $uni-border-radius-base;
		// border-right-width: 0;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 44rpx;
		height: 42rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #ededed;
		font-family: PingFangSC-Regular;
		font-size: 29.2rpx;
	}

	.uni-numbox--text {
		// font-size: 40rpx;
		color: $uni-text-color;
	}

	.uni-numbox--disabled {
		color: $uni-text-color-disable;
	}
</style>
