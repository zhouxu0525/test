<template>
	<view>
<!-- 		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view> -->
		<view v-if="(loaded || datalist.itemIndex < 15) && datalist.items && datalist.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in datalist.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
					<view class="uni-indexed-list__item-border" >
						<view  class="uni-indexed-list__title">
							<text v-if="datalist.items && datalist.items.length > 0 && index == 0" class="uni-indexed-list__text">
								{{ datalist.key }}
							</text>
						</view>
						<view v-if="showSelect" style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
						</view>
						<text class="uni-indexed-list__item-content" :id="item.id">{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			datalist() {
				/*if(this.selectId != '' && this.list.items && this.list.items.length > 0) {
					let items = this.list.items;
					let index = -1, selectItem;
					for(var i = 0; i < items.length; i++) {
						console.info(items[i].id, this.selectId)
						if(items[i].id == this.selectId) {
							index = i;
							selectItem = items;
							break;
						}
					}
					console.info("index", index)
					if(index != -1) {
						index++;
						let scropx = index * 50;
						
						uni.pageScrollTo({
						    scrollTop: scropx,
						});
					}
				}*/
				return this.list;
			}
		},
		methods: {
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: $uni-bg-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		// border-top-style: solid;
		// border-top-width: 1px;
		// border-top-color: $uni-border-color;
	}

	.uni-indexed-list__item {
		font-size: $uni-font-size-lg;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: $uni-spacing-row-lg;
		padding-left: 0;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
		font-family: PingFang-SC-Medium;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #454545;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #f7f7f7;
	}

	.uni-indexed-list__title {
		text-align: center;
		width: 35px;
	}
	.uni-indexed-list__text {
		line-height: 24px;
		width: 15px;
		height: 18px;
		font-family: PingFang-SC-Medium;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #868686;
	}
</style>
