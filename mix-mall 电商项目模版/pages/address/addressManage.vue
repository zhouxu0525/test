<template>
	<view class="content">
		<!-- #ifdef H5 -->
		<view class="title_bar" ref="header">
			<image src="@/static/shop/back_black.png"  mode="" @click="Back" class="black"></image>
			<view class="MD">
				{{title}}
			</view>
		</view>
		<!-- 标题栏和状态栏占位符 -->
		<view class="titleNview-placing"></view>
		<!-- #endif -->
		<view class="content-box">
			<view class="row b-b">
				<input class="input" type="text" v-model="addressData.name" placeholder="收货人" placeholder-class="placeholder" />
				<!-- <image src="@/static/adress/mail.png" class="mail" mode=""></image> -->
			</view>
			<view class="row b-b">
				<input class="input" type="number" v-model="addressData.mobile" placeholder="手机号码 " placeholder-class="placeholder" />
			</view>
			<view class="row b-b" @click="addresschoose = true">
				<input class="input" :disabled="true" v-model="addressData.addressName" placeholder="所在地区 " placeholder-class="placeholder" />
				<u-icon name="arrow-right" color="#999" size="12"></u-icon>
			</view>
			<view class="row b-b"> 
				<!-- <text class="tit">门牌号</text> -->
				<input class="input" type="text" v-model="addressData.area" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元、室等" placeholder-class="placeholder" />
			</view>
			
			<view class="row default-row">
				<text class="tit">设为默认</text>
				<switch :checked="addressData.defaule" color="#fa436a" @change="switchChange" />
			</view>
			
			<view class="row default-row" @click="deleteAddress" v-if="type === 'edit'">
				<text class="deleteAddress">删除收货地址</text>
			</view>
			
			<view class="complete" @click="confirm">
				完成
			</view>
		</view>
		<!-- 地址选择框弹出层 -->
		<view>
			<u-popup v-model="addresschoose" mode="bottom" >
				<scroll-view scroll-y="true" style="height: 1000rpx;">
					<view style="padding: 20rpx;">
						<uni-steps @dataChoose="dataChoose" :datavalue="chooseRegion"></uni-steps>
					</view>
				</scroll-view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import {gaddAddressInfo,addAddressInfo,editAddressInfo,deleteAddress} from '../../api/Address';
	import uniSteps from '@/components/uni-addresschoose-steps/uni-steps.vue'
	export default {
		components: {uniSteps},
		data() {
			return {
				addresschoose: false,
				chooseRegion: [],
				addressData: {
					id:'',
					name: '',
					mobile: '',
					addressName: '',
					address: '',
					area: '',
					default: false
				}, 
				addressId:[],
				title:''  ,
				dataInfoAddress:{},
				type:''
			}
		},
		filters: {
			addressInfo(skuinfo) {
			 if(typeof  skuinfo==='undefined'){
			 	return " "
			 }else{
				return   " "+skuinfo;
			 }
			}
		},
		onLoad(option){
			this.title= '新增收货地址';
			this.type=option.type;
			if(option.type==='edit'){
				this.title = '编辑收货地址' 
				var dataInfo=JSON.parse(option.data);
				this.dataInfoAddress=dataInfo;
				//手机号
				this.addressData.mobile =dataInfo.phoneNumber;
				//详细地址
				this.addressData.area =dataInfo.detailAddress;
				//名称
				this.addressData.name =dataInfo.name;
				//id
				this.addressData.id =dataInfo.id;
				//处理地址显示
				var  province='';
				 if(typeof dataInfo.province==='undefined'){
				 	province= " "
				 }else{
				 	province=" "+dataInfo.province;
				 }
				var  city='';
				 if(typeof dataInfo.city==='undefined'){
				 	city= " "
				 }else{
				 	city=" "+dataInfo.city;
				 }
				 var  region='';
				  if(typeof dataInfo.region==='undefined'){
				  	region= " "
				  }else{
				  	region=" "+dataInfo.region;
				  }
				  var  street='';
				   if(typeof dataInfo.street==='undefined'){
				   	street= " "
				   }else{
				   	street=" "+dataInfo.street;
				   }
				this.addressData.addressName=province +city+region+street;
				//封装地址数据
				var addressList=[];
				if(!(typeof dataInfo.province==='undefined')){
					var addressInfo={};
					addressInfo.id=dataInfo.provinceCode;
					addressInfo.name=dataInfo.province;
					addressInfo.level=0;
					addressList.push(addressInfo);
				}
				if(!(typeof dataInfo.city==='undefined')){
					var cityInfo={};
					cityInfo.id=dataInfo.cityCode;
					cityInfo.name=dataInfo.city;
					cityInfo.level=1;
					addressList.push(cityInfo);
				}
				if(!(typeof dataInfo.region==='undefined')){
					var regionInfo={};
					regionInfo.id=dataInfo.regionCode;
					regionInfo.name=dataInfo.region;
					regionInfo.level=2;
					addressList.push(regionInfo);
				}
				if(!(typeof dataInfo.street==='undefined')){
					var streetInfo={};
					streetInfo.id=dataInfo.streetCode;
					streetInfo.name=dataInfo.street;
					streetInfo.level=3;
					addressList.push(streetInfo);
				}
				this.chooseRegion=addressList;  
				this.addressData.defaultStatus=dataInfo.defaultStatus;
				
				 //处理默认按钮
				if(dataInfo.defaultStatus=='1'){
					this.addressData.defaule =true;
				}  
			}
			
			if(option.type==='add'){
				this.addressData.defaultStatus=0;
			}
			this.manageType = option.type;  
		},
		watch: {
			 
		},
		methods: {
			switchChange(e){ 
				this.addressData.default = e.detail;
				this.addressData.defaule = e.detail;
				if(e.detail.value){
					this.addressData.defaultStatus='1';
				}else{
					this.addressData.defaultStatus='0';
				} 
				
			},
			Back(){
				uni.navigateBack()
			},
			dataChoose(data) {
				//关闭弹窗
				this.addresschoose = false;
				this.chooseRegion = data;
				var  addressNameInfo=[];
				 for(var i=0;i<data.length;i++){
					 addressNameInfo.push(data[i].name);
					 this.addressId.push(data[i].id);
				 }   
				 this.addressData.addressName=addressNameInfo.join(" "); 
				 this.addressData.chooseRegion=data;
			},
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.addressData.addressName = data.name;
						this.addressData.address = data.name;
					}
				})
			},
			
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)){
					this.$api.msg('请输入正确的手机号码');
					return;
				} 
				if(!data.area){
					this.$api.msg('请填写门牌号信息');
					return;
				}  
				//编辑入参
				var param={
					"id":this.addressData.id ,
					"name":this.addressData.name, 
					"defaultStatus":this.addressData.defaultStatus, 
					"detailAddress":this.addressData.area,
					"phoneNumber":this.addressData.mobile,
					"chooseRegionList":this.chooseRegion
				} 
				if(this.manageType==='edit'){ 
					editAddressInfo(param).then(res => {
						if(res.code==200){
							this.navigateBack();
						}
					});
				}else{
					//添加入参
					var param1={
						"id":this.addressData.id ,
						"defaultStatus":this.addressData.defaultStatus,
						"detailAddress":this.addressData.area,
						"phoneNumber":data.mobile,
						"name":this.addressData.name,
						"memberId":this.addressData.memberId,
						"chooseRegionList":this.addressData.chooseRegion
					} 
					addAddressInfo(param1).then(res => {
						if(res.code==200){
							 this.navigateBack();
						}
					});
				} 
			},
			//删除操作
			deleteAddress(){
				//删除入参
				var param={
					"id":this.dataInfoAddress.id 
				}
				var that = this;
				this.$api.confirm({
					content: "确认要删除该收货地址吗",
					success: function() {
						//删除地址
						deleteAddress(param).then(res => {
							if(res.code==200){ 
								//跳转到收货地址列表
								that.navigateBack();
							}
						});
					}
				})
			},
			navigateBack() {
				if(this.$api.prePage()) {
					this.$api.prePage().loadData();
				}
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}
	/* #ifdef H5 */
	.title_bar {
		font-family: PingFang-SC-Medium;
		width: 100%;
		height: 44px;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		.black {
			width: 20rpx;
			height: 34rpx;
			margin-left: 30rpx;
		}
	
		.MD {
			margin-left: 216rpx;
			width: 219rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #232323;
		}
	
		.right-img {
			position: relative;
			margin-left: 180rpx;
			width: 56rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #db2929;
		}
	}
	.titleNview-placing {
		height: var(--status-bar-height);
		padding-top: 44px;
		box-sizing: content-box;
	}
	/* #endif */
	.content-box {
		margin-top: 22rpx;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30rpx;
		height: 110rpx;
		background: #fff;
		.mail{
			width: 33rpx;
			height: 35rpx;
		}
		.tit{
			flex-shrink: 0;
			width: 120rpx;
			font-size: 30rpx;
			color: $font-color-dark;
		}
		.deleteAddress{
			flex-shrink: 0;
			width: 250rpx;
			font-size: 30rpx;
			color:#DB2929; 
		}
		.input{
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36rpx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16rpx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.complete{
		width: 90%;
		height:90rpx;
		line-height: 90rpx;
		background-color: #db2929;
		border-radius: 45rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: bold;
		margin: 50rpx auto;
	}
</style>
