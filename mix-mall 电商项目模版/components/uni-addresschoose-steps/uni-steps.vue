<template>
	<view class="uni-steps">
		<view class="stepsTitle">
			<text class="stepsTitle-text">请选择</text>
		</view>
		<view class="uni-steps__column">
			<view class="uni-steps__column-text-container">
				<view v-for="(item,index) in options" :key="index" class="uni-steps__column-text" v-if="index <= active">
					<text class="uni-steps__column-title" v-if="regionlist[index]" @click="regionRechange(index)">
						{{regionlist[index].name}}
					</text>
					<text class="uni-steps__column-title" v-else>
						请选择{{options[index]}}
					</text>
				</view>
			</view>
			<view class="uni-steps__column-container">
				<view class="uni-steps__column-line-item" v-for="(item,index) in options" :key="index" v-if="index <= active">
					<view class="uni-steps__column-line "
					 :style="{backgroundColor:index<=active&&index!==0?activeColor:index===0?'transparent':deactiveColor}"></view>
					<view class="uni-steps__column-check" v-if="index === active">
						<uni-icons :color="activeColor" type="checkbox-filled" size="20"></uni-icons>
					</view>
					<view class="uni-steps__column-circle" v-else :style="{backgroundColor:index<active?activeColor:deactiveColor}"></view>
					<view class="uni-steps__column-line uni-steps__column-line--after" 
					 :style="{backgroundColor:index<active&&index!==options.length-1?activeColor:index===options.length-1?'transparent':deactiveColor}"></view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" :style="{height: regionlistH + 'rpx'}" style="padding: 20rpx;" id="regionScroll">
			<uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
		</scroll-view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	import {getAllProvince,getAllCity} from '../../api/Address';
	export default {
		name: 'UniSteps',
		components: {
			uniIcons,
			uniIndexedList
		},
		props: {
			activeColor: {
				// 激活状态颜色
				type: String,
				default: 'red'
			},
			deactiveColor: {
				// 未激活状态颜色
				type: String,
				default: '#999999'
			},
			datavalue: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				active: 0, //当前步骤
				level: 4,
				regionlist: [],  //{"id": data.item.id, "name":data.item.name, "level": currentActive}
				regionlistH: 800,
				options: ['省份', '城市', '区县', '街道'],
				list:[],
				/* list: [{
					"letter": "A",
					"data": [
						{"id": "1", "name": "阿克苏机场"},
						{"id": "1", "name": "阿拉山口机场"},
						{"id": "1", "name": "阿勒泰机场"},
						{"id": "1", "name": "阿里昆莎机场"},
						{"id": "1", "name": "安庆天柱山机场"},
						{"id": "1", "name": "澳门国际机场"},
					]
				}, {
					"letter": "B",
					"data": [
						{"id": "1", "name": "保山机场"},
						{"id": "1", "name": "包头机场"},
						{"id": "1", "name": "北海福成机场"},
						{"id": "1", "name": "北京南苑机场"},
						{"id": "1", "name": "北京首都国际机场"},
					]
				}], */
			}
		},
		mounted() {
			if(this.datavalue.length > 0) {
				this.regionlist = this.datavalue;
				this.active = this.regionlist.length - 1;
			}
			//获取一级数据
			this.loadRegionList();
		},
		methods: {
			bindClick(data) {
				let currentActive = this.active;
				let regionData = {"id": data.item.id, "name":data.item.name, "level": currentActive};
				//点击数据添加至已选定集合
				if(currentActive <= this.level - 1) {
					this.regionlist[currentActive] = regionData
				} 
				//判断是否还需加载下级数据
				if(currentActive < this.level - 1) {
					this.active = this.active + 1;
				 	this.loadRegionList();
				}
				//若已选定数据集合长度已满足level限制，则表示已选择完成
				if(currentActive >= this.level - 1) {
					//地址选择完毕，推送数据至父组件
					this.$emit('dataChoose', this.regionlist)
				}
			},
			regionRechange(index) {
				console.info("regionRechange index", index)
				this.active = index;
				this.regionlist.splice(index);
				//请求下级地址数据
				this.loadRegionList();
			},
			//数据加载
			loadRegionList() { 
				//TODO 编辑地址回显
				if(this.active >= this.level) {
					return;
				}
				//获取一级数据
				if(this.active==0){
					 getAllProvince().then(res => {
					 	if(res.code == 200) { 
							this.list=res.data; 
					 	}
					 });
				 }else{
					 var param={
						 "regionCode":this.regionlist[this.active - 1].id
					 } 
					 getAllCity(param).then(res => {
					 	if(res.code == 200) { 
					 		 this.list=res.data; 
							 if(this.list.length == 0) {
								 //若没有下级地址，则直接向父级组件传递数据
								 this.$emit('dataChoose', this.regionlist)
							 }
					 	}
					 });
				 } 
			}
		},
		watch: {
			active(val, old) {
				if(val > old) {
					this.regionlistH = this.regionlistH - 43;
				} else {
					this.regionlistH = this.regionlistH + 43;
				}
			},
			regionlist(val) {
				// if(val.length >= this.level) {
				// 	this.$emit('dataChoose', val)
				// }
			}
		},
		
		
		
	}
</script>

<style lang="scss" scoped>
	
	.stepsTitle {
		width: 100%;
		height: 60rpx;
		text-align: center;
	}
	.stepsTitle-text {
		font-family: PingFang-SC-Medium;
		font-size: 14px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #232323;
	}
	.uni-steps {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__row {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__column {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row-reverse;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #e8e8e8;
	}

	.uni-steps__row-text-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-text-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
		margin-left: 40rpx;
	}

	.uni-steps__row-text {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
	}

	.uni-steps__column-text {
		padding-bottom: 40rpx;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__row-title {
		font-size: $uni-font-size-base;
		line-height: 16px;
		text-align: center;
	}

	.uni-steps__column-title {
		font-family: PingFang-SC-Medium;
		font-size: 18px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #454545;
	}

	.uni-steps__row-desc {
		font-size: 12px;
		line-height: 14px;
		text-align: center;
	}

	.uni-steps__column-desc {
		font-size: $uni-font-size-sm;
		text-align: left;
		line-height: 18px;
	}

	.uni-steps__row-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-container {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		width: 30px;
		flex-direction: column;
	}

	.uni-steps__row-line-item {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		height: 14px;
		line-height: 14px;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__column-line-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__row-line {
		flex: 1;
		height: 1px;
		background-color: $uni-text-color-grey;
	}

	.uni-steps__column-line {
		width: 1px;
		background-color: $uni-text-color-grey;
	}

	.uni-steps__row-line--after {
		transform: translateX(1px);
	}

	.uni-steps__column-line--after {
		flex: 1;
		transform: translate(0px, 1px);
	}

	.uni-steps__row-line--before {
		transform: translateX(-1px);
	}

	.uni-steps__column-line--before {
		height: 6px;
		transform: translate(0px, -1px);
	}

	.uni-steps__row-circle {
		width: 5px;
		height: 5px;
		border-radius: 100px;
		background-color: $uni-text-color-grey;
		margin: 0px 3px;
	}

	.uni-steps__column-circle {
		width: 12px;
		height: 12px;
		border-radius: 100px;
		background-color: $uni-text-color-grey;
		margin: 4px 0px 5px 0px;
	}

	.uni-steps__row-check {
		margin: 0px 6px;
	}

	.uni-steps__column-check {
		height: 14px;
		line-height: 14px;
		margin: 2px 0px;
	}
</style>
