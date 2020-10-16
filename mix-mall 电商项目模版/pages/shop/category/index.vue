<template>
	<view class="container">
		<!-- 折叠面板 -->
		<view class="collapse">
			<u-collapse>
				<u-collapse-item :open="item.open" @change="openItem" :title="item.name" 
					v-for="(item, index) in cateList" :key="item.id" >
						<view class="collapse-box">
							<view class="collapse-rows" v-for="(sitem, j) in item.children" :key="sitem.id"
								@click="navToList(sitem)">
								{{sitem.name}}
							</view>
						</view>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import * as shopReq from '../../../api/Shop.js'
	import {searchShopCateList} from '../../../api/ProductSearch.js'
	import {getImgUrl} from '../../../util/common.js'
	
	export default {
		components: {
		},
		data() {
			return {
				back:true,
				shopNum: '',
				shopInfo: {},
				value:null,
				shopBackground:'',
				cateList: [{
					head: "套装",
					open: true,
					disabled: true,
					list:["未用","未用","未用","未用"]
				}, {
					head: "上装",
					open: false,
					list:["未用","未用","未用","未用"]
				}, {
					head: "鞋",
					open: false,
					list:["未用","未用","未用","未用"]
				}],
			};
		},
		props: {
			"shopInfo": {
				default: {},
				type: Object
			},
		},
		async mounted() {
			this.shopNum = this.shopInfo.shopNum;
			//获取店铺分类信息
			this.getShopCateByEs();
		},
		methods: {
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			openItem(){
				//console.log(1);
			},
			getShopCate() {
				//searchShopCateList
				//获取店铺一二级分类
				shopReq.shopFirSecCate(this.shopNum).then(res => {
					if(res.code == 200) {
						var openFlag = false;
						if(res.data.length <= 2) {
							openFlag = true;
						}
						var i = 0;
						res.data.forEach(d => {
							if((!openFlag && i == 0) || openFlag) {
								d.open = true;
							}
							i++;
						})
						this.cateList = res.data;
					}
				})
			},
			//获取店铺二三级分类
			getShopCateByEs() {
				searchShopCateList({"shopNum": this.shopNum}).then(res => {
					if(res.code == 200) {
						var openFlag = false;
						if(res.data.length <= 2) {
							openFlag = true;
						}
						var i = 0;
						res.data.forEach(d => {
							if((!openFlag && i == 0) || openFlag) {
								d.open = true;
							}
							i++;
						})
						this.cateList = res.data;
					}
				})
			},
			navToList(cate) {
				let shopNum = this.shopNum;
				uni.navigateTo({
					url: `/pages/product/list?title=${cate.name}&cateId=${cate.id}&shopNum=${shopNum}`
				})
			}
		},
	}
</script>

<style lang="scss">
	
	.collapse{
		width: 690rpx;
		margin: 24rpx 30rpx 0;
		/deep/.u-collapse-item{
			width: 690rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			/deep/.u-collapse-title {
				margin-left: 31rpx;
			}
		}
		/deep/.u-collapse-head{
			margin-top: 24rpx;
		}
		.collapse-box{
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-content: space-around;
			padding: 27rpx;
			// overflow: hidden;
			.collapse-rows{
				width: 308rpx;
				height: 64rpx;
				background-color: #f3f3f3;
				border-radius: 2rpx;
				color: #313131;
				font-size: 24rpx;
				line-height: 64rpx;
				padding-left: 21rpx;
				margin-bottom:20rpx ;
				margin-right: 10rpx ;
			}
		}
	}
</style>
