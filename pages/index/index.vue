<template>
	<view class="home">
		   <!-- 导航 -->
		   <u-tabs :list="navlist" @click="clickNav" 
		     :current = "current" 
		    :inactiveStyle="{color:'#888',transform: 'scale(1)'}"
		    :activeStyle="{ color: '#303133',fontWeight: 'bold',transform: 'scale(1.07)',  }"
		   ></u-tabs>
		   
		   
		   
		   <!-- 骨架屏 -->
		   <view class="loadingState">
			   <u-skeleton :loading="loadState" rows="3" avatar></u-skeleton>
		   </view>
		   
		   
		   
		   <!-- 主体 -->
	      <view class="content">
			   <view class="item" v-for="item in listData">
				   <blog-item></blog-item>
			   </view>
		  </view>
		  
		  <!-- 编辑图标 -->
		  <view class="edit">
			   <text class="iconfont icon-a-21-xiugai"></text>
		  </view>
		  
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//导航栏数据
				navlist: [
					{
						name: '最新'
					},
					{
						name: '热门'
					}
				],
				//导航栏指定第几个被激活
				current: 1,
				//控制骨架屏显示和隐藏
				loadState : true,
				//主体数据
				listData:[1,2,3]
			}
		},
		onLoad() {

		},
		methods: {
            clickNav(e){
				 console.log(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
    .home{
		.loadingState{
			padding: 20rpx;
		}
		.topnav{
			margin-bottom: 30rpx;
		}
		.content{
			.item{
				padding: 30rpx;
			}
		}
		.edit{
			width: 120rpx;
			height: 120rpx;
			background: #0199fe;
			border-radius: 50%;
			position: fixed;
			z-index: 100;
			bottom: 150rpx;
			right: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);
			.iconfont{
				font-size: 50rpx;
				color: #fff;
			}
		}
	}
</style>
