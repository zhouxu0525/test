<!-- 详情展示页面 -->
<template>
	<view class="container u-skeleton">
		<view class="title_bar" v-if="scrollTop">
			<view class="status_bar"></view>
			<view class="barBox">
				<image @tap="hTapBack" src="../../static/top_black.png" mode="" class="black"></image>
				<view class="MD">
					<view ref='table' class="MD-table"  :class="{active: item.id == currentId}"
						@click="addActive(i,item.id)" v-for="(item,i) in table" :key="i">
						{{item.name}}
					</view>
				</view>
				<!-- <view class="right-img">
					<image src="../../static/top_share.png" mode=""></image>
					<image src="../../static/top_news.png" mode="">
						<u-badge type="error" class="badge" count="7"></u-badge> 
					</image>
				</view> -->
			</view>	
		</view>
		
		<!-- <scroll-view scroll-with-animation scroll-y class="content" :scroll-top="tabScrollTop"> -->
			<!-- 轮播图 -->
			<view class="carousel" id="shop">
				<u-swiper height="722" :list="imgList" class="u-skeleton-rect"></u-swiper>
				<view class="icon-img" v-if="!scrollTop">
					<image @tap="hTapBack" src="../../static/back.png" mode=""></image>
					<!-- <image src="../../static/share.png" mode=""></image>
					<image src="../../static/news.png" mode="">
						<u-badge type="error" class="icon-badge" count="7"></u-badge> 
					</image> -->
				</view>
			</view>
			<!-- 价格详细 -->
			<view class="introduce-section">
				<view class="price-box-a" :style="{'backgroundImage': getImage('/mall-res/bg.png')}" 
					v-if="selectSku && selectSku.priceSpike">
					<!-- 活动商品价格-->
					<view><image src="../../static/goodList/xsqj2.png" mode=""></image></view>
					<view class="price_3">
					<p class="price_1">￥{{selectSku.priceSpike}}</p>
					<p class="price_2"><del>￥{{selectSku.price}}</del></p>
					</view>
					<view class="price_right">
						<p>距离结束剩余</p>
					<u-count-down :timestamp="timestamp" :show-days="false"></u-count-down>
					</view>
				</view>
				<view class="price-box" v-else>
					<!-- 普通商品价格-->
					<text class="price-tip">¥</text>
					<text class="price u-skeleton-fillet">{{productInfo.price}}</text>
					<text class="m-price u-skeleton-fillet">¥{{productInfo.originalPrice}}</text>
					<!-- <text class="coupon-tip">7折</text> 
					<image src="../../static/collect.png" mode="" v-if="favorite" @click="toFavorite"/>
					<image src="../../static/nocollect.png" mode="" v-else @click="toFavorite"/>-->
				</view>
				<!--商品标题信息 -->
				<view class="shop-box u-skeleton-rect  view1">
					<view>{{productInfo.name}}</view>
					<view class="int">
						<image src="../../static/collect.png" mode="" v-if="favorite" @click="toFavorite"/>
						<image src="../../static/nocollect.png" mode="" v-else @click="toFavorite"/>
					</view>
				</view>
				<view class="bot-row">
					<text class="u-skeleton-fillet">销量: {{productInfo.sale}}</text>
					<text class="u-skeleton-fillet" v-if="flashProductRelation && flashProductRelation.surplusstock">库存: {{flashProductRelation.surplusstock}}</text>
					<text class="u-skeleton-fillet" v-else>库存: {{productInfo.stock}}</text>
					<text class="u-skeleton-fillet">收藏量: {{productInfo.collectionCount}}</text>
				</view>
			</view>
			<!-- 购买详细 -->
			<view class="c-list">
				<view class="c-row shop-type" @click="toggleSpec('buy')">
					<text class="tit u-skeleton-rect">购买类型</text>
					<view class="con u-skeleton-rect">
						<text v-if="specSelected.length > 0">已选：</text>
						<text class="selected-text" v-for="(sItem, sIndex) in specSelected" 
							:key="sIndex" v-if="sIndex <= 1">
							{{sItem.name}}；
						</text>
						<!-- 多于2个规格，则省略展示-->
						<text v-if="specSelected.length > 2">···</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
				
				<view class="c-row b-b " style="height: 70rpx;" @click="toggleOther('coupon')" v-if="true">
					<text class="tit">优惠券</text>
					<text class="con t-r red">领取优惠券</text>
					<text class="coupon red">领券</text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="c-row b-b" style="height: 70rpx;" v-if="false">
					<text class="tit">活动</text>
					<view class="con-list">
						<text>2件8折</text>
					</view>
				</view>
				<!-- 服务标签 -->
				<view class="c-row b-b" style="height: 72rpx;" @click="toggleOther('serviceTag')" v-if="tagList.length > 0">
					<text class="tit u-skeleton-rect">服务保障</text>
					<!-- <view class="bz-list con" v-for="(item, i) in tagList" :key="i" v-if="i <= 2">
						<image src="../../static/icon_sel1.png" mode=""></image>
						<text>{{item.title}}</text>
					</view> -->
					<view class="con-list u-skeleton-rect">
						<!--  v-for="(item, i) in tagList" :key="i" v-if="i <= 2"  -->
						<text v-if="tagList.length >= 3">{{tagList[0].title}} · {{tagList[1].title}} · {{tagList[2].title}}</text>
						<text v-else-if="tagList.length >= 2">{{tagList[0].title}} · {{tagList[1].title}}</text>
						<text v-else-if="tagList.length >= 1">{{tagList[0].title}}</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
				<view class="c-row b-b" style="height: 70rpx;" @click="toggleOther('parameter')" v-if="true && paramsList.length>0">
					<text class="tit u-skeleton-rect">参数</text>
					<view class="con-list u-skeleton-rect">
						<text v-if="paramsList.length >= 3">{{paramsList[0].name}} · {{paramsList[1].name}} · {{paramsList[2].name}}</text>
						<text v-else-if="paramsList.length >= 2">{{paramsList[0].name}} · {{paramsList[1].name}}</text>
						<text v-else-if="paramsList.length >= 1">{{paramsList[0].name}}</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
			</view>
			<!-- 店铺信息 -->
			<view class="shopDesc" v-if="shopInfo.shopName">
				<view class="shop_box" @click="toShopIndex">
					<image :src="getImage(shopInfo.shopLogo)" mode="" class="u-skeleton-fillet"/>
					<view class="shop-desc" >
						<text class="shopName u-skeleton-fillet">{{shopInfo.shopName}}</text>
						<view class="shop-desc-box">
							<text>关注人数</text>
							<text>{{shopInfo.followNumber}}</text>
							<text>商品数量</text>
							<text>{{shopInfo.shopGoodsNum}}件</text>
						</view>
					</view>
					<text class="yticon icon-you" style="height: 72rpx;"></text>
				</view>
				<view class="shop-btn u-skeleton-rect">
					<view @click="kefu">
						<image src="../../static/icon_kefu.png" mode=""></image>
						<text>联系客服</text>
					</view>
					<view @click="toShopIndex">
						<image src="../../static/icon_shop.png" mode=""></image>
						<text>进入店铺</text>
					</view>
				</view>
			</view>
			<!-- 评价 -->
			<!-- <view class="eva-section u-skeleton-rect" id="evaluate" ref="evaluate">
				<view class="e-header" v-if="productInfo.userEvaluateTotal > 0">
					<text class="tit">评价</text>
					<text>({{productInfo.userEvaluateTotal || '0'}})</text>
					<text class="tip" @click="seeEvaluateAll(productInfo.id)">查看全部</text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="e-header" v-else>
					<text class="tit">该商品还没有评价奥!</text>
				</view>
				<view class="eva-box" v-if="commentBean && commentBean.productId" @click="seeEvaluateAll(productInfo.id)">
					<view class="eva-name">
						<image class="portrait" :src="commentBean.memberIcon" mode="aspectFill"></image>
						<view class="name" v-if="commentBean.anonymousstatus==0">
							{{commentBean.memberNickName}}
						</view>
						<view class="name" v-if="commentBean.anonymousstatus==1">
							匿名用户
						</view>
					</view>
					<view class="eva-desc">
						<text class="con">{{commentBean.content}}</text>
					</view>
				</view>
			</view> -->
			<!-- 评价 -->
			<view class="eva-section u-skeleton-rect" id="evaluate" ref="evaluate">
				<view class="e-header" v-if="productInfo.userEvaluateTotal > 0">
					<text class="tit">评价</text>
					<text>({{productInfo.userEvaluateTotal || '0'}})</text>
					<text class="tip" @click="seeEvaluateAll(productInfo.id)">查看全部</text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="e-header" v-else>
					<text class="tit">该商品还没有评价奥!</text>
				</view>
				<view  v-if="commentBean && commentBean.productId" >
					  <view  class="evaluate-item">
					  	<view class="header" @click="seeEvaluateAll(productInfo.id)">
					  		<view class="headerImg"  >
					  			<image :src="getImage(commentBean.memberIcon)"   mode=""></image>
					  		</view>
					  		<view class="headerNews">
					  			<view v-if="commentBean.anonymousstatus==0">
					  				{{commentBean.memberNickName}}
					  			</view>
					  			<view v-if="commentBean.anonymousstatus==1">
					  				匿名用户
					  			</view> 
					  		</view>
					  	</view>
					  	<view class="title" @click="seeEvaluateAll(productInfo.id)">
					  		{{commentBean.content}} 
					  	</view>
					     <view class="imgList" v-if="commentBean.imgList.length > 0">
					  		<view class="img-item" v-for="(sItem,j) in  commentBean.imgList" :key="j">
					  			<image :src="getImage(sItem)" mode="aspectFit"   @click="imgDetail(commentBean)"  ></image>
					  		</view>
					  		<view class="img-item" v-for="(jItem,k) in ['1','2']" :key="k" style="height: 0;"></view>   
					  	</view>  
					  </view>
				</view>
			</view>
			<!-- 推荐 -->
			<view class="TJ" id="TJ" v-if="TJlist.length > 0">
				<view class="TJ_name">
					<text>为你推荐</text>
					<text @click="toShopIndex">查看更多</text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="TJ_swiper">
					<swiper class="swiper" :indicator-dots="true" indicator-color="#ddd" indicator-active-color="#ff0000" :autoplay="false"
					 :interval="10000" :duration="500">
						<swiper-item v-for="(item, index) in TJlist" :key="index">
							<view class="swiper-item">
								<view class="swiper-shop" v-for="(sitem, j) in item" :key="j" @click="toProductDetail(sitem.id)">
									<image :src="getImage(sitem.pic)" mode=""></image>
									<view class="swiper-shopName">
										{{sitem.name}}
									</view>
									<text class="price">¥{{sitem.price}}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="detail-desc" id="desc">
				<view class="d-header">
					<text>图文详情</text>
				</view>
				<!-- <rich-text :nodes="productInfo.detailHtml" class="rich-text"></rich-text> -->
				<jyf-parser :html="productInfo.detailHtml" ref="article"></jyf-parser>
			</view>
		<!-- </scroll-view> -->
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<image src="../../static/tabbar_home.png" class="iconimg" mode=""></image>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<image src="../../static/tab_shop.png" class="iconimg1" mode=""></image>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" @click="kefu">
				<image src="../../static/icon_kefu.png" class="iconimg2" mode=""></image>
				<text>客服</text>
			</view>

			<view class="action-btn-group">
				<view class=" action-btn join" @click="toggleSpec('car')">加入购物车</view>
				<view class=" action-btn buy" @click="buy">立即购买</view>
			</view>
		</view>

		<!-- 服务标签-模态层弹窗 -->
		<view class="popup spec" :class="serviceDialog" @touchmove.stop.prevent="stopPrevent" @click="toggleOther('serviceTag')">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content parameter" @click.stop="stopPrevent">
				<view class="title">商城保障</view>
				<view class="roll_1">
				<view class="guaList" v-for="(item,i) in tagList" :key="i">
					<view>
						<image src="@/static/coupon/icon_bz.png" mode=""></image>
						<view class="guaListTit">{{item.title}}</view>
					</view>
					<view class="guaDetail">{{item.content}}</view>
				</view>
				</view>
				<view class="complete" @click="toggleOther('serviceTag')">
					知道了
				</view>
			</view>
		</view>
		<!-- 选择优惠券-模态层弹窗 -->
		<view class="popup spec" :class="couponDialog" @touchmove.stop.prevent="stopPrevent" @click="toggleOther('coupon')">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content parameter" @click.stop="stopPrevent">
				<!-- 优惠券 -->
				<view class="title">选择优惠券</view>
				<view class="conment">
					<view class="conment_2">
						<view class="text_1">仅限购买本店XXXXXX部分产品使用满减券</view>
						<view class="text_2">2020.10.10-2020.12.31</view>
					</view>
					<view class="conment_3">
						<view class="money">￥200</view>
						<view class="money_1">满6000元立减</view>
						<view class="money_2">立即领取</view>
					</view>
				</view>
				
				<view class="conment">
					<view class="conment_2">
						<view class="text_1">仅限购买本店XXXXXX部分产品使用满减券</view>
						<view class="text_2">2020.10.10-2020.12.31</view>
					</view>
					<view class="conment_3">
						<view class="money">￥200</view>
						<view class="money_1">满6000元立减</view>
						<view class="money_2">立即领取</view>
					</view>
				</view>
				<!-- <view class="couList" v-for="(item,i) in couponList" :key="i">
					<view class="couListIcon">
						<image src="@/static/coupon/card_icon_nor.png" v-if="item.check"  @click="changeIcon(item.check,i)" mode=""></image>
						<image src="@/static/coupon/card_iocn_sel.png" v-else mode="" @click="changeIcon(item.check,i)"></image>
					</view>
					<view class="couListR">
						<view>{{item.name}}</view>
						<view>{{item.time}}</view>
					</view>
					
					<view class="couListL">
						<view>{{item.title}}</view>
						<view class="guaListTit">{{item.titleDetail}}</view>
					</view>
					
				</view> -->
				<view class="complete" @click="sucBtn">
					完成
				</view>
			</view>
		</view>
		<!--参数标签-模态弹窗-->
		<view class="popup spec" :class="parameDialog" @touchmove.stop.prevent="stopPrevent" @click="toggleOther('parameter')">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content parameter" @click.stop="stopPrevent">
				<view class="title">商品详细参数</view>
				<view class="roll_1">
				<view class="parList" v-for="(item,i) in paramsList" :key="i">
					<view>{{item.name}}</view>
					<view>{{item.inputList}}</view>
				</view>
			</view>
				<view class="complete" @click="toggleOther('parameter')">
					知道了
				</view>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specDialog" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec('')">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				
				<view class="a-t">
					<image v-if="isSelectedSku" :src="getImage(selectSku.pic)"></image>
					<image v-else :src="getImage(productInfo.pic)"></image>
					
					<view class="right" v-if="selectSku && selectSku.priceSpike">
						<text class="price-mo">¥</text>
						<text class="price">{{selectSku.priceSpike}}</text>
						<text class="stock">库存：{{selectSku.flashCount}}件</text>
					</view> 
					<view class="right" v-else-if="isSelectedSku">
						<text class="price-mo">¥</text>
						<text class="price">{{selectSku.price}}</text>
						<text class="stock">库存：{{selectSku.stock}}件</text>
					</view> 
					<view class="right" v-else>
						<text class="price-mo">¥</text>
						<text class="price">{{productInfo.price}}</text>
						<text class="stock" v-if="flashProductRelation && flashProductRelation.surplusstock">库存：{{flashProductRelation.surplusstock}}件</text>
						<text class="stock" v-else>库存：{{productInfo.stock}}件</text>
					</view> 
					
				</view>
				<view class="a-i">
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text class="listName">{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in item.list" :key="childIndex" class="tit"
						 :class="{selected: (item.selected == childItem)}" @click="selectSpec(index, childItem)">
							{{childItem}}
						</text>
					</view>
				</view>
				<view class="attr-number">
					<text>购买数量</text>    
					<u-number-box v-if="maxPurchaseQuantity==null" v-model="buyNumber" :min="1" @change="buyNumberChange" class="number-box"></u-number-box>
					<u-number-box v-else-if="maxPurchaseQuantity > 0" v-model="buyNumber" :min="1" :max="maxPurchaseQuantity" @change="buyNumberChange" class="number-box" ></u-number-box>
					<u-number-box v-else @change="buyNumberChange" v-model="buyNumber" class="number-box" :max="0" :disabled="true"></u-number-box>
				</view>
				</view>
				<view class="attr-btn">
					<view class="btn1" v-if="isSelectedSku" @click="goodsAction">确定</view>
					<view class="btn" v-else disabled>确定</view>
				</view>			
			</view>
		</view

		<!-- 返回顶部 -->



		<u-back-top :scroll-top="scrollTopH" :customStyle="{'backgroundColor': ''}">
			<solt><image :src="icon" style="width: 60px; height: 60px;"></image></solt>
		</u-back-top>

		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import  {productInfo_,shopInfo_,paramsList_,tagList_,goodsImageList_} from '@/util/skeletonJson.js'
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	import {mapGetters} from 'vuex';
	import share from '@/components/share';
	import * as productReq from '../../api/Product.js'
	import {getShopInfo} from '../../api/Shop.js'
	import {getImgUrl, navigateToBack} from '../../util/common.js'
	import {addCar} from '../../api/GoodsCar.js'
	
	export default {
		components: {
			share, jyfParser
		},
		data() {
			return {
				icon: '../../static/search/icon_top.png',
				loading: true,
				commentBean:{},		//商品评论信息
				productInfo: {},	//商品信息
				skuStockList: [], 	//商品SKU信息
				shopInfo: {},		//店铺信息
				serviceDialog: 'none',
				parameDialog:'none',
				couponDialog:'none',
				specDialog: 'none',
				specSelected: [],		//已选择规格列表
				actionType: 'buy',  //buy or car
				scrollTop:false,
				buyNumber: 1,		//购买数量
				tabScrollTop: 0,
				scrollBackTop: 0,	//返回顶部 滚动值
				scrollTopH: 0,		//页面已滚动高度
				currentId:"shop",
				favorite: false,  //是否已收藏
				shareList: [],
				paramsList:[{}],//商品参数
				imgList: goodsImageList_,  //商品大图列表
				skuMapping: {},	//sku映射关系对象
				selectSku: {},	//已选择sku信息
				specList: [], 	//商品规格列表
				flashId:null,	//活动ID
				flashPromotionProductId:null,//活动商品关联ID
				maxPurchaseQuantity:null,		//为活动时最大可购买数量
				flashProductRelation:{},//活动总库存
				tagList: [{}],
				TJlist: [[],[],[]], //商品推荐列表
				table: [{name:"商品",id:"shop"},{name:"评价",id:"evaluate"},{name:"推荐",id:"TJ"},{name:"详情",id:"desc"}],
				couponList:[
					{title:'￥20',titleDetail:'满200元立减',name:'满减券',time:'有效期：2021-06-30',check:true},
					{title:'7.5折',titleDetail:'满200元立减',name:'折扣卷',time:'有效期：2021-06-30',check:true}
				],
				timestamp: 86400,//秒
				backTop: {
					customStyle: {
						 backgroundColor: '#000000',
						 opacity: '0.5', 
						 filter: 'alpha(opacity=50)'
					}
				},
			};
			
		},
		async onLoad(options) {
			//初始化数据
			this.productInfo= productInfo_;
			this.shopInfo= shopInfo_;
			this.paramsList= paramsList_;
			this.tagList=tagList_;
			uni.showLoading({title: '正在加载'})
			let id = options.id;
			this.flashId = options.flashId;
			if(!this.flashId){
				//接收传值,id里面放的是标题，因为测试数据并没写id
				await productReq.getProductInfo(id).then(res => {
					if(res.code != 200) {
						//跳转至错误页
						this.$api.msg("获取商品店铺异常")
					} else {
						const that = this;
						this.productInfo = res.data.product;
						uni.setNavigationBarTitle({
							title: this.productInfo.name
						})
						if(this.productInfo.albumPics) {
							//商品图册
							var goodsImgs = []
							this.productInfo.albumPics.split(",").forEach(img => {
								goodsImgs.push({"image": that.getImage(img)})
							})
							this.imgList = goodsImgs;
						}
						//商品SKU信息
						this.skuStockList = res.data.skuStockList;
						//处理商品sku选择列表
						this.dealSkuSpecArray();
						//处理商品sku映射关系
						this.dealSkuMapping();
						//获取商品参数
						let paramsTemp = [];
						res.data.productAttributeList.forEach(item =>{
							if(item.type==1){
								res.data.productAttributeValueList.forEach(itemVlue =>{
									if(item.id==itemVlue.productAttributeId 
									&& itemVlue.value != undefined 
									&& itemVlue.value != ''){
										let temp = {"name":item.name,"inputList":itemVlue.value};
										paramsTemp.push(temp);
									}
								})
							}
						})
						this.paramsList = paramsTemp;
					}
				});
			}else{
				this.flashPromotionProductId = id;
				await productReq.getProductDetail({"id": id,"flashId": this.flashId}).then(res => {
					if(res.code != 200) {
						//跳转至错误页
						this.$api.msg("获取商品店铺异常")
					} else {
						const that = this;
						if(!res.data){
							this.$api.msg("此活动已停止")
						}else{
							this.productInfo = res.data.product;
							uni.setNavigationBarTitle({
								title: this.productInfo.name
							})
							if(this.productInfo.albumPics) {
								//商品图册
								var goodsImgs = []
								this.productInfo.albumPics.split(",").forEach(img => {
									goodsImgs.push({"image": that.getImage(img)})
								})
								this.imgList = goodsImgs;
							}
							//商品SKU信息
							this.skuStockList = res.data.skuStockListFlash;
							//处理商品sku选择列表
							this.dealSkuSpecArray();
							//处理商品sku映射关系
							this.dealSkuMapping();
							//获取商品参数
							let paramsTemp = [];
							res.data.productAttributeList.forEach(item =>{
								if(item.type==1){
									res.data.productAttributeValueList.forEach(itemVlue =>{
										if(item.id==itemVlue.productAttributeId 
										&& itemVlue.value != undefined 
										&& itemVlue.value != ''){
											let temp = {"name":item.name,"inputList":itemVlue.value};
											paramsTemp.push(temp);
										}
									})
								}
							})
							this.paramsList = paramsTemp;
							this.timestamp = res.data.flashTime;
							this.flashProductRelation = res.data.flashPromotionProductRelation;
						}
					}
				})
			}
			
			//获取店铺信息
			let shopNum = this.productInfo.shopNum;
			getShopInfo(shopNum).then(res => {
				if(res.code == 200) {
					this.shopInfo = res.data;
				} else {
					console.error("获取店铺信息异常", res);
				}
			});
			
			//服务标签
			productReq.getServiceTagByProduct({"productId": this.productInfo.id}).then(res => {
				if(res.code == 200) {
					this.tagList = res.data;
				}
			})
			
			//获取优选商品评论
			productReq.getComment(this.productInfo.id).then(res=>{
				if(res.code == 200 && res.data) {
					this.commentBean = res.data;
					//商品评价图片
					var picsList = [];
					var picsString = res.data.pics;
					if(res.data.pics && res.data.pics != '') {
						picsList = picsString.split(",");
					}
					this.commentBean.imgList = picsList; 
				}
			})
			//获取优选商品评论
			this.shopTJlist();
			// 获取用户是否已收藏该商品
			this.getIsCollect();
			
			uni.hideLoading()
			this.loading = false
			
			//计算tab对应区域
			let that = this;
			const query = uni.createSelectorQuery()
			that.table.forEach(item => {
				query.select('#' + item.id).boundingClientRect()
			})
			var topscroll = 0;
			query.exec(function(res){
				// #id节点的上边界坐标
				res.forEach(d => {
					that.table.forEach(t => {
						if(t.id == d.id) {
							t.top = d.top;
						}
					})
				})
			})
			
			this.shareList = await this.$api.json('shareList');
		},
		computed: {
			...mapGetters(['hasLogin']),
			//是否已选择正确的商品sku
			isSelectedSku: function() {
				if(this.specSelected.length < 1){
					return false;
				}
				return !(typeof(this.selectSku) == 'undefined' || 
							typeof(this.selectSku.skuCode) == 'undefined')
			}
		},
		watch: {
			specSelected (selectedArray) {
				var selectedKeyArray = [];
				selectedArray.forEach(selected => {
					selectedKeyArray.push(selected.name);
				})
				var selectedKey = selectedKeyArray.join("-")
				//已选择的sku
				var selectSkuObj;
				if(this.skuMapping[selectedKey]) {
					var skuId = this.skuMapping[selectedKey].skuId;
					this.skuStockList.forEach(sku => {
						if(sku.id == skuId) {
							selectSkuObj = sku;
							return;
						}
					})
				} 
				this.selectSku = selectSkuObj;
			}
		},
		// 滚动添加特殊类
		onPageScroll(e) {
			// 当前距离页面顶部的距离
			this.scrollTopH = e.scrollTop + 60;
			if(this.scrollTopH > 100){
				this.scrollTop = true
			}else{
				this.scrollTop = false
			}
			//确定已滚动到的选项卡
			let tabs = this.table.filter(item => item.top <= this.scrollTopH).reverse();
			if (tabs.length > 0) {
				this.currentId = tabs[0].id;
			}
		},
		methods: {
			//跳转到详情页面
			imgDetail(obj){ 
				uni.navigateTo({
					url: '/pages/evaluate/ImgList?goodsId='+obj.productId+'&commentId='+obj.id
				});
			},
			getImage(imgUrl) {
				return getImgUrl(imgUrl);
			},
			toProductDetail(id) {
				uni.navigateTo({
				    url: '/pages/product/product?id=' + id
				});
			},
			seeEvaluateAll(id){
				uni.navigateTo({
				    url: '/pages/evaluate/index?goodsId=' + id
				});
			},
			loadParams(){
				
			},
			// 优惠券是否选中
			changeIcon(e,i){
				this.couponList.forEach(item=>{
					item.check = true
				})
				this.couponList[i].check = !e
			},
			//生成商品sku选择列表
			dealSkuSpecArray() {
				let skuStockList = this.skuStockList;
				if(skuStockList.length == 0) {
					return;
				}
				//获取sku规格标题
				var skuSpecList = [];
				var sku = skuStockList[0];
				var spData = JSON.parse(sku.spData);
				spData.forEach(sp => {
					skuSpecList.push({"name": sp.key});
				})
				//遍历组装展示规格数据
				skuStockList.forEach(sku => {
					var spData = sku.spData;
					spData = JSON.parse(spData);
					spData.forEach(sp => {
						skuSpecList.forEach(sku_sp => {
							if(sku_sp.name == sp.key) {
								if(!sku_sp.list) sku_sp['list'] = [];
								//去除重复项
								if(sku_sp.list.indexOf(sp.value) == -1) {
									sku_sp.list.push(sp.value);
								}
							}
						})
					});
				});
				this.specList = skuSpecList;
			},
			dealSkuMapping() {
				var skuMapping = {};
				let tempSku = this.skuStockList[0];
				this.skuStockList.forEach(sku => {
					if(this.flashId && !this.selectSku){//如果为活动商品则初始化一个sku
						let tempSkuPrice = tempSku.price - tempSku.priceSpike;
						let tempPrice = sku.price - sku.priceSpike;
						if(tempSkuPrice < tempPrice){
							tempSku = sku;
						}	
					}
					var spData = JSON.parse(sku.spData);
					var key = "";
					spData.forEach(sp => {
						key += sp.value + "-"; 
					});
					key = key.substring(0, key.length - 1)
					skuMapping[key] = {"skuCode": sku.skuCode, "skuId": sku.id};
				})
				if(this.flashId){
					this.selectSku = tempSku;
				}
				this.skuMapping = skuMapping;
			},
			// 点击顶部tab栏，跳转目的位置
			addActive(i,id) {
				let topscroll = -1; 
				this.table.forEach(t => {
					if(t.id == id) {
						topscroll = t.top;
					}
				})
				if(topscroll == -1) return;
				uni.pageScrollTo({
					duration: 100,
					scrollTop: topscroll - 10
				})
			},
			//弹窗开关
			toggleSpec(type) {
				//操作类型：加入购物车 or 立即购买
				if(!this.checkLoginTo()) {
					return;
				}
				this.actionType = type;
				if (this.specDialog === 'show') {
					this.specDialog = 'hide';
					setTimeout(() => {
						this.specDialog = 'none';
					}, 250);
				} else if (this.specDialog === 'none') {
					this.specDialog = 'show';
					if(this.flashId){
						var param = {
							"promotionProductId": this.productInfo.id,
							"flashId": this.flashPromotionProductId};
						//获取当前用户可购买数量
						productReq.getFlashPromotionLimit(param).then(res=>{
							if(res.code == 200){
								this.maxPurchaseQuantity = res.data
								if(this.maxPurchaseQuantity==0){
									this.buyNumber = 0
								}else if(!this.maxPurchaseQuantity || this.maxPurchaseQuantity < 0){
									this.$api.msg("您购买此商品数量已达到上限")
								}
							}else{
								this.$api.msg("您购买此商品数量已达到上限")
							}
						})
					}
				}
			},
			//服务保障和商品参数 模态窗切换
			toggleOther(type) {
				if(type == 'spec') {
					if (this.specDialog === 'show') {
						this.specDialog = 'hide';
						setTimeout(() => {
							this.specDialog = 'none';
						}, 250);
					} else if (this.specDialog === 'none') {
						this.specDialog = 'show';
					}
				} else if(type == 'serviceTag') {
					if (this.serviceDialog === 'show') {
						this.serviceDialog = 'hide';
						setTimeout(() => {
							this.serviceDialog = 'none';
						}, 250);
					} else if (this.serviceDialog === 'none') {
						this.serviceDialog = 'show';
					}
				} else if(type == 'parameter') {
					if (this.parameDialog === 'show') {
						this.parameDialog = 'hide';
						setTimeout(() => {
							this.parameDialog = 'none';
						}, 250);
					} else if (this.parameDialog === 'none') {
						this.parameDialog = 'show';
					}
				} else if(type == 'coupon'){
					if (this.couponDialog === 'show') {
						this.couponDialog = 'hide';
						setTimeout(() => {
							this.couponDialog = 'none';
						}, 250);
					} else if (this.couponDialog === 'none') {
						this.couponDialog = 'show';
					}
				}
				
				
			},
			hTapBack() {
				navigateToBack();
			},
			//选择规格
			selectSpec(specIndex, childItem) {
				//当前已选定
				var list = this.specList[specIndex].selected = childItem;
				//存储已选择sku项目
				this.specSelected = [];
				this.specList.forEach( spec => {
					if(spec.list) {
						spec.list.forEach(s => {
							if (s === spec.selected) {
								this.specSelected.push({"name": s});
							}
						})
					}
				})
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//获取用户是否已收藏此商品
			getIsCollect() {
				if(this.hasLogin) {
					productReq.getProductCollection({"productId": this.productInfo.id}).then(res => {
						if(res.code == 200) {
							if(res.data) {
								this.favorite = true;
							}
						}
					})
				}
			},
			checkLoginTo() {
				if(!this.hasLogin) {
					//跳转至登录页
					var tourl = encodeURI('/pages/product/product?id=' + this.productInfo.id);
					uni.navigateTo({
					    url: '/pages/public/login?to=' + tourl
					});
				}
				return this.hasLogin;
			},
			//收藏
			toFavorite() {
				if(!this.checkLoginTo()) {
					return;
				}
				if(!this.favorite) {
					//添加商品收藏
					var param = {	
						"productId": this.productInfo.id,
						"productName": this.productInfo.name,
						"productPic": this.productInfo.pic,
						"productPrice": this.productInfo.price,
						"productSubTitle": this.productInfo.subTitle,
					};
					productReq.addProductCollection(param).then(res => {
						if(res.code != 200) {
							this.$api.msg("抱歉！商品收藏失败了")
						} else {
							this.favorite = true;
							this.$api.msg("收藏成功!");
						}
					})
				} else {
					//删除商品收藏
					productReq.deleteProductCollection({"ids": this.productInfo.id}).then(res => {
						if(res.code != 200) {
							this.$api.msg("抱歉！未能将此商品移除收藏")
						} else {
							this.favorite = false;
							this.$api.msg("取消成功!");
						}
					})
				}
			},
			goodsAction() {
				if(this.maxPurchaseQuantity != null && this.maxPurchaseQuantity<=0){
					this.$api.msg("您购买此商品数量已达到上限")
					return;
				}
				if(!this.checkLoginTo()) {
					return;
				}
				if(this.actionType == 'buy') {
					this.buy(); //立即购买
				} else if(this.actionType == 'car') {
					this.addGoodsCart();//加入购物车
				}
			},
			buy() {
				if(this.maxPurchaseQuantity != null && this.maxPurchaseQuantity<=0){
					this.$api.msg("您购买此商品数量已达到上限")
					return;
				}
				if(!this.isSelectedSku) {
					this.toggleSpec('buy');
					return;
				}
				var skuId = this.selectSku.id;
				var number = this.buyNumber;
				var flashId = this.flashPromotionProductId;
				let tempUrl =  `/pages/order/createOrder?skuId=` + skuId + "&buyNumber=" + number + "&sourceType=goods"
				if(flashId){
					tempUrl += "&flashId="+flashId
				}
				uni.navigateTo({
					url: tempUrl
				})
			},
			//加入购物车
			addGoodsCart() {
				if(!this.isSelectedSku) {
					this.toggleSpec('car');
					return;
				}
				let skuId = this.selectSku.id;
				let hdId = "-1";
				if(this.flashId){
					hdId = this.flashPromotionProductId;
				}
				//加入购物车
				addCar({"productSkuId": skuId, "quantity": this.buyNumber,"flashId":hdId}).then(res => {
					if(res.code == 200) {
						this.$api.msg("已成功加入购物车！")
						//关闭弹框
						if (this.specDialog === 'show') {
							this.specDialog = 'hide';
							setTimeout(() => {
								this.specDialog = 'none';
							}, 250);
						}
					} else {
						this.$api.msg("抱歉！未能成功加入购物车")
					}
				})
			},
			//店铺推荐商品
			shopTJlist() {
				var param = {'shopNum': this.productInfo.shopNum, 'pageNum': 1, 'pageSize': 9};
				productReq.getShopRecommendProductList(param).then(res => {
					if(res.code == 200) {
						var tjlist = [];
						var len = res.data.length;
						var page = parseInt(len / 3);
						//if(len % 3 != 0) page++;
						//每满3个商品，展示一组
						for(var i = 0; i < page; i++) {
							tjlist.push(res.data.slice((i*3), (i+1)*3))
						}
						this.TJlist = tjlist;
					} 
				});
			},
			kefu() {
				uni.makePhoneCall({
					phoneNumber: "'"+this.shopInfo.customerTel+"'", 
				});
			},
			toShopIndex() {
				var shopNum = this.shopInfo.shopNum;
				uni.navigateTo({
					url: `/pages/shop/index?shopNum=${shopNum}` 
				})
			},
			stopPrevent() {},
			buyNumberChange(type) {
				if(this.maxPurchaseQuantity 
					&& this.maxPurchaseQuantity!=null 
					&& this.maxPurchaseQuantity > 0){
						
					if(this.maxPurchaseQuantity >= type){
						this.buyNumber = this.maxPurchaseQuantity
					}    
				}
			}
		},

	}
</script>

<style lang='scss'>
	/* 自定义导航栏 */
	.status_bar {
		font-family: PingFang-SC-Medium;
		height: var(--status-bar-height);
		width: 100%;
	}	
	.title_bar {
		font-family: PingFang-SC-Medium;
		width: 100%;
		box-shadow: 0rpx 3rpx 20rpx 0rpx rgba(153, 153, 153, 0.12);
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	.barBox {
		display: flex;
		align-items: center;
		height: 44px;
		width: 100%;
		.black {
			width: 55rpx;
			height: 55rpx;
		}

		.MD {
			display: flex;
			flex: 1;
			justify-content: center;

			.MD-table {
				font-size: 22rpx;
				height: 25rpx;
				line-height: 32rpx;
				color: #313131;
				margin-right: 32rpx;
			}

			.active {
				font-size: 26rpx;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					bottom: -11rpx;
					left: 11rpx;
					width: 32rpx;
					height: 4rpx;
					background-color: #db2929;
					border-radius: 2rpx;
				}
			}
		}
		.right-img{
				display: flex;
				image{
					width: 55rpx;
					height: 55rpx;
					&:first-child{
						margin-right: 50rpx;
					}
					&:nth-child(2){
						position: relative;
						margin-right: 40rpx;
					}
					
				}
				.badge{
					position: absolute!important;
					top: 12rpx!important;
					right: 40rpx!important;
					font-size: 20rpx!important;
					width: 24rpx;
					height: 24rpx;
					border-radius: 24rpx;
					color: #fff;
					background-color: #db2929;
				}
			}
	}
	.content{
	height:1500rpx;
	}
	page {
		background: $page-color-base;
		padding-bottom: 160rpx;
	}

	.icon-you {
		font-size: $font-base + 2rpx;
		color: #888;
	}

	.container {
		font-family: DINPro-Medium;
		background-color: #f7f7f7;
	}
	 
	/* 轮播图上定位图标 */
	.carousel{
		position: relative;
		/deep/.u-indicator-item-round-active{
			background-color:#db2929 ;
		}
		.icon-img{
			position: absolute;
			top: 54rpx;
			display: flex;
			image{
				width: 56rpx;
				height: 57rpx;
				&:first-child{
					margin-left: 29rpx;
				}
				&:nth-child(2){
					margin-left: 496rpx;
				}
				&:nth-child(3){
					margin-left: 27rpx;
					margin-right: 30rpx;
				}
			}
			.icon-badge{
				position: absolute!important;
				top: 0!important;
				right: 24rpx!important;
				font-size: 20rpx!important;
				width: 24rpx;
				height: 24rpx;
				border-radius: 24rpx;
				color: #fff;
				background-color: #db2929;
			}
		}
	}
	
	// 评价列表
	.evaluate-item{  
		.header{
			display: flex;
			.headerImg{
				width: 88rpx;
				height: 88rpx;
				image {
					width: 88rpx;
					height: 88rpx;
					border-radius: 5rpx;
				}
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
			width: 673rpx;
			font-size: 26rpx;
			color: #313131;
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
			overflow:hidden;
			text-overflow:ellipsis;
			display:-webkit-box;
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2;
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
		.allComment{ 
			
			width: 673rpx;
			font-size: 30rpx;
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
			image {
				width: 218rpx;
				height: 218rpx;
				border-radius: 5rpx;
			}
		}
		.common-oper{
			display: flex;
			flex-wrap: wrap;
			width: 689rpx;
			justify-content: flex-end;
			.item{
				margin: 16rpx;
				font-family: PingFang-SC-Medium;
				font-size: 26rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #666666;
				line-height: 32rpx;
				image {
					position: relative;
					bottom: -5rpx;
					margin-right: 10rpx;
					width: 30rpx;
				}
			}
		}
	}
	
	/* 标题简介 */
	.introduce-section {
		background-color: #fff;
		margin-bottom: 20rpx;

		.title {
			font-size: 32rpx;
			color: $font-color-dark;
			height: 50rpx;
			line-height: 50rpx;
		}

		.price-box {
			display: flex;
			align-items: center;
			height: 85rpx;
			padding: 0 30rpx;
			position:relative;
			
			.price-tip,
			.price {
				min-width: 36rpx;
				height: 36rpx;
				font-size: 48rpx;
				font-weight: bold;
				font-stretch: normal;
				line-height: 48rpx;
				letter-spacing: -1rpx;
				color: #db2929;
				
			}

			.price-tip {
				height: 27rpx;
				font-size: 36rpx;
				/* margin: 0 12rpx 0 30rpx; */
			}

			.m-price {
				min-width: 72rpx;
				height: 18rpx;
				font-size: 24rpx;
				color: #999999;
				text-decoration: line-through;
				/* margin: 0 28rpx 0 31rpx; */
				margin-left: 40rpx;
			}

			.coupon-tip {
				align-items: center;
				width: 72rpx;
				height: 36rpx;
				background-color: #fbe9e9;
				border-radius: 10rpx;
				font-family: PingFang-SC-Medium;
				font-size: 24rpx;
				color: #db2929;
				text-align: center;
			}
			
			image { 
				width: 28rpx;
				height: 28rpx;
				position:absolute;
				right:30rpx;
			}
		}

		.price-box-a {
			display: flex;
			align-items: center;
			height: 90rpx;
			padding: 0 40rpx;
			position:relative;
			background-size: 100% 100%;
			margin-bottom: 20rpx;
			
			.price-tip,
			.price {
				min-width: 36rpx;
				height: 36rpx;
				font-size: 48rpx;
				font-weight: bold;
				font-stretch: normal;
				line-height: 48rpx;
				letter-spacing: -1rpx;
				color: #db2929;
				
			}

			.price-tip {
				height: 27rpx;
				font-size: 36rpx;
				/* margin: 0 12rpx 0 30rpx; */
			}

			.m-price {
				min-width: 72rpx;
				height: 18rpx;
				font-size: 24rpx;
				color: #999999;
				text-decoration: line-through;
				/* margin: 0 28rpx 0 31rpx; */
				margin-left: 40rpx;
			}

			.coupon-tip {
				align-items: center;
				width: 72rpx;
				height: 36rpx;
				background-color: #fbe9e9;
				border-radius: 10rpx;
				font-family: PingFang-SC-Medium;
				font-size: 24rpx;
				color: #db2929;
				text-align: center;
			}
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
		.price_1{
			color: #FFFFFF;
			font-weight: 700;
			font-size: 5vw;
		}
		.price_2{
			color: #FFFFFF;
			font-size: 2vw;
		}
		.price_3{
			padding: 0rpx 20rpx;
		}
		.price_right{
			text-align: center;
			color: #FFFFFF;
			font-size: 4vw;
			position:absolute;
			right:10rpx;
			display: n;
		}
		.view1{
			display: flex;
		}
		
		.int>image{
			width: 28rpx;
			height: 28rpx;
			
			position:absolute;
			right:30rpx;
			
			/* position:absolute;
			top: 500rpx; */
			
		}
		.shop-box {
			width: 686rpx;
			min-height: 62rpx;
			font-family: PingFang-SC-Medium;
			font-size: 28rpx;
			font-weight: bold;
			font-stretch: normal;
			line-height: 36rpx;
			letter-spacing: 0rpx;
			color: #313131;
			margin: 0 34rpx 0 30rpx;
		}

		.bot-row {
			height: 81rpx;
			width: 686rpx;
			margin: 0 34rpx 0 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			color: #999999;
			/* text{
				flex: 1;
			} */
		}
	}

	/* 商品参数 */
	.c-list {
		font-size: 26rpx;
		font-family: PingFang-SC-Medium;
		color: #999999;
		overflow: hidden;
		border: none;

		.shop-type {
			height: 80rpx;
			background-color: #ffffff;
			margin-bottom: 20rpx;
		}

		.c-row {
			display: flex;
			align-items: center;
			padding: 0 31rpx;
			position: relative;
			background-color: #fff;
		}

		.tit {
			width: 134rpx;
			color: #999999;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10rpx;
			}
		}

		.bz-list {
			/* margin-right: 31rpx; */

			image {
				width: 21rpx;
				height: 21rpx;
			}

			text {
				font-size: 24rpx;
				color: #999999;
				height: 23rpx;
				margin-left: 5rpx;
			}

		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: #313131;
		}

		.red {
			color: #db2929;
		}
	}

	.shopDesc {
		margin-top: 20rpx;
		width: 750rpx;
		height: 248rpx;
		background-color: #ffffff;
		padding: 0 31rpx;
		overflow: hidden;

		.shop_box {
			margin-top: 30rpx;
			display: flex;
			/* align-items: center; */
			height: 88rpx;

			image {
				width: 88rpx;
				height: 88rpx;
				border-radius: 5rpx;
			}

			.shop-desc {
				flex: 1;
				margin-left: 27rpx;

				.shopName {
					font-size: 28rpx;
					height: 27rpx;
					color: #313131;
					margin: 9rpx 0 10rpx 0;
				}

				.shop-desc-box {
					display: flex;
					font-size: 24rpx;
					color: #999999;

					text {
						&:nth-child(2) {
							margin: 0 100rpx 0 27rpx;
						}

						&:nth-child(3) {
							margin-right: 26rpx;
						}
					}
				}
			}
		}

		.shop-btn {
			width: 591rpx;
			height: 70rpx;
			display: flex;
			justify-content: space-between;
			margin: 40rpx 57rpx 20rpx 47rpx;

			view {
				width: 260rpx;
				height: 70rpx;
				border-radius: 35rpx;
				border: solid 1rpx #cccccc;
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					font-size: 24rpx;
					color: #333333;
					margin-left: 7rpx;
					font-weight: bold;
				}

				&:first-child {
					image {
						width: 36rpx;
						height: 36rpx;
					}
				}

				&:last-child {
					image {
						width: 34rpx;
						height: 32rpx;
					}
				}
			}
		}
	}
	
	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 0 31rpx;
		background: #fff;
		margin-top: 16rpx;

		.e-header {
			display: flex;
			align-items: center;
			height: 83rpx;
			font-size: 28rpx;

			.tit {
				color: #313131;
				margin-right: 4rpx;
			}

			.tip {
				flex: 1;
				text-align: right;
				color: #db2929;
			}

			.icon-you {
				margin-left: 10rpx;
			}
		}
	}

	.eva-box {
		.eva-name {
			height: 40rpx;
			display: flex;

			.portrait {
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				margin-right: 21rpx;
			}

			.name {
				font-size: 26rpx;
				color: #999999;
			}
		}

		.eva-desc {
			height: 125rpx;
			display: flex;
			align-items: center;

			text {
				font-size: 26rpx;
				color: #313131;
				line-height: 36rpx;
			}
		}

	}

	/* 推荐 */
	.TJ {
		width: 750rpx;
		height: 492rpx;
		background-color: #ffffff;
		padding: 0 24rpx;
		margin-top: 20rpx;
		.TJ_name {
			height: 76rpx;
			display: flex;
			align-items: center;

			text {
				&:first-child {
					height: 27rpx;
					font-size: 28rpx;
					color: #000000;
				}

				&:nth-child(2) {
					font-size: 24rpx;
					color: #999999;
					flex: 1;
					text-align: right;
				}
			}
		}

		.TJ_swiper {
			height: 396rpx;

			.swiper {
				height: 396rpx;
			}

			.swiper-item {
				display: flex;
				justify-content: space-between;

				.swiper-shop {
					height: 366rpx;
					width: 230rpx;

					image {
						width: 230rpx;
						height: 230rpx;
						vertical-align: bottom;
					}

					.swiper-shopName {
						width: 230rpx;
						/* height: 59rpx; */
						font-size: 24rpx;
						line-height: 36rpx;
						color: #666666;
						word-break: break-all;
						display: -webkit-box;
						/**对象作为伸缩盒子模型展示**/
						-webkit-box-orient: vertical;
						/**设置或检索伸缩盒子对象的子元素的排列方式**/
						-webkit-line-clamp: 2;
						/**显示的行数**/
						overflow: hidden;
						/**隐藏超出的内容**/
						margin: 5rpx 0 5rpx;
					}

					.price {
						height: 22rpx;
						font-size: 28rpx;
						color: #000000;
						font-weight: bold;
					}
				}
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16rpx;

		.d-header {
			display: flex;
			/* justify-content: center; */
			align-items: center;
			height: 83rpx;
			font-size: 28rpx;
			margin-left: 27rpx;
			color: #000000;
			position: relative;

			text {
				padding: 0 20rpx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 0 24rpx 130rpx;
		width: 750rpx;
		/* height: 1008rpx; */
		background-color: #ffffff;
		font-family: DINPro-Medium;
		
		.a-t {
			display: flex;
		
			image {
				width: 220rpx;
				height: 220rpx;
				flex-shrink: 0;
				margin-top: -80rpx;
				border-radius: 5rpx;
			}
			.right {
				width: 140rpx;
				display: flex;
				flex-wrap: wrap;
				margin-top: 67rpx;
				margin-left: 22rpx;
				
				.price-mo {
					width: 18rpx;
					height: 24rpx;
					font-size: 32rpx;
					line-height: 32rpx;
					color: #db2929;
					margin: 6rpx 11rpx 0 0;
				}

				.price {
					height: 30rpx;
					font-size: 40rpx;
					color: #db2929;
					line-height: 32rpx;
				}

				.stock {
					font-size: 24rpx;
					color: #999999;
					line-height: 32rpx;
					height: 23rpx;
					margin-top: 19rpx;
				}

				.selected-text {
					margin-right: 10rpx;
				}
			}
		}
		.a-i{
				overflow: scroll;
			}
		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #333333;
			margin-top: 60rpx;
			
			
			.listName {
				height: 27rpx;
				font-size: 28rpx;
				line-height: 32rpx;
			}
		}

		.item-list {

			display: flex;
			flex-wrap: wrap;
			/* justify-content: space-between; */
			margin-top: 24rpx;

			text {
				height: 66rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f5f5f5;
				border-radius: 10rpx;
				min-width: 60rpx;
				height: 60rpx;
				margin-right: 23rpx;
				margin-bottom: 24rpx;
				padding: 0 17rpx 0 21rpx;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}

		.attr-number {
			height: 146rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				font-size: 28rpx;
				height: 26rpx;
				color: #333333;
			}

			.number-box {
				height: 60rpx;
			}
		}

		.attr-btn {
			position: fixed;
			bottom: 0;
			left: 0;

			view {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 750rpx;
				height: 90rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #ffffff;
			}

			.btn {
				background-color: #bbbbbb;
			}

			.btn1 {
				background-color: #db2929;
			}
		}
	}
	/* 商品参数弹出层*/
	.parameter{
		.title{
			margin-top: 63rpx;
			text-align: center;
			color: #313131;
			font-size: 32rpx;
			font-weight: bold;
		}
		.parList{
			display: flex;
			
			view{
				margin-top: 60rpx;
				&:first-child{
					flex: 2;
					color: #999999;
					font-size: 28rpx;
					line-height: 48rpx;
					letter-spacing: 0rpx;
				}
				&:last-child{
					padding-left: 30rpx;
					flex: 10;
					font-size: 28rpx;
					line-height: 48rpx;
					color: #313131;
				}
			}
		}
		/*保障*/
		.guaList{
			margin-bottom: 99rpx;
			view{
				&:first-child{
					display: flex;
					image{
						width: 32rpx;
						height: 32rpx;
						margin-top: 4px;
					}
					.guaListTit{
						margin-left: 32rpx;
						font-size: 32rpx;
						font-weight: bold;
						letter-spacing: 0rpx;
						color: #313131;
					}
				}
				&:last-child{
					font-size: 26rpx;
					font-weight: bold;
					letter-spacing: 0rpx;
					color: #999999;
				}
			}
			.guaDetail{
				margin-top: 30rpx;
				padding-left: 64rpx;
			}
		}
		
		/*优惠券*/
	/* 	.couList{
			margin-top: 57rpx;
			background:url(../../static/coupon/card_bg_platform.png) no-repeat;
			background-size:100% 100% ;
			width: 696rpx;
			height: 208rpx;
			box-shadow: 0rpx 0rpx 32rpx 0rpx rgba(132, 132, 132, 0.1);
			display: flex;
			align-items: center;
			.couListL{
				width: 198rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				view{
					&:first-child{
						font-size: 32rpx;
						font-weight: bold;
						color: #db2929;
						margin-bottom: 22rpx;
					}
					&:last-child{
						font-size: 20rpx;
						color: #999999;
					}
				}
			}
			.couListR{
				
				width: 400rpx;
				margin-left: 40rpx ;
				display: flex;
				flex-direction: column;
				justify-content: center;
				view{
					&:first-child{
						font-size: 32rpx;
						color: #313131;
						margin-bottom: 16rpx;
					}
					&:last-child{
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
			.couListIcon{
				
				width: 32rpx;
				height: 32rpx;
				margin-left: 20rpx;
				image{
					width: 32rpx;
					height: 32rpx;
				}
			}
		} */
		
		// 新增优惠
		.conment {
			width: 690rpx;
			height: 224rpx;	
			margin: 0 auto;
			margin-top: 25rpx;
			background-image: url(../../static/coupon/card_bg_shop.png);
			background-size:100% 100%	;
			box-shadow: 0px 0px 32px 0px rgba(132, 132, 132, 0.1);
			display: flex;
			align-items: center;
		}
		.conment_2{
			padding: 30rpx;
		}
		.conment_3{
			margin-left: 110rpx;
			text-align: center;
			color: #ef6613;
		}
		.text_1{
			width: 350rpx;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: normal;
			line-height: 30rpx;
			color: #313131;
		}
		.text_2{
			
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: normal;	
			line-height: 70rpx;	
			color: #c1c1c1;
		}
		.money{
			font-family: PingFang-SC-Medium;
				font-size: 38rpx;
				font-weight: bold;
				font-stretch: normal;
				line-height: 26rpx;
		}
		.money_1{
			font-family: PingFang-SC-Medium;
				font-size: 20rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 60rpx;
		}
		.money_2{
			idth: 140rpx;
				height: 50rpx;
				background-image: linear-gradient(252deg, 
				#ff9d3d 0%, 
				#ef6613 100%);
				border-radius: 25rpx;
				font-family: PingFang-SC-Medium;
				font-size: 22rpx;  
				font-weight: normal;
				font-stretch: normal;
				line-height: 48rpx;
				letter-spacing: 0rpx;
				color: #ffffff;
		}
		.money_2{
			idth: 140rpx;
				height: 50rpx;
				background-image: linear-gradient(252deg, 
				#ff9d3d 0%, 
				#ef6613 100%);
				border-radius: 25rpx;
				font-family: PingFang-SC-Medium;
				font-size: 22rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 48rpx;
				letter-spacing: 0rpx;
				color: #ffffff;
		}	
		.complete{
			margin-top: 90rpx;
			width: 100%;
			height:90rpx;
			line-height: 90rpx;
			background-color: #db2929;
			border-radius: 45rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		/* left: 30rpx; */
		bottom: 0;
		z-index: 95;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		width: 750rpx;
		height: 108rpx;
		background-color: #ffffff;
		box-shadow: 0rpx -3rpx 20rpx 0rpx rgba(153, 153, 153, 0.08);

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 20rpx;
			color: #313131;
			width: 86rpx;
			height: 80rpx;

			text {
				margin-top: 11rpx;
			}

			.iconimg {
				width: 34rpx;
				height: 35rpx;
			}

			.iconimg1 {
				width: 36rpx;
				height: 36rpx;
			}

			.iconimg2 {
				width: 36rpx;
				height: 36rpx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76rpx;
			overflow: hidden;
			margin-left: 20rpx;

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 214rpx;
				height: 70rpx;
				border-radius: 35rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #ffffff;
			}

			.join {
				background-color: #e6a866;
				margin-right: 24rpx;
			}

			.buy {
				background-color: #db2929;
			}
		}
	}
	.roll_1{
			width: 100%;
			height: 25vh;
			overflow: scroll;
		}
</style>
