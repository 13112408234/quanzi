<template>
	<view class="blog">
		<!-- 头部 头像，用户名 时间开始 -->
		<view class="sbian">
			<view class="zb">
				<view class="tx"><u-avatar :src="src" shape="circle" size = "20"></u-avatar></view>
				<view class="yhm">用户名</view>
				<view class="time">
					<uni-dateformat :date="Date.now()  - 3600000 * 24 * 7" format="MM月dd hh:mm" :threshold="[60000,3600000*24*30]">
					</uni-dateformat>
				</view>
			</view>
			 <view class="yb">
				 <view class="iconfont icon-ellipsis"></view>
			 </view>
		</view>
		<!-- 头部 头像，用户名 时间结束 -->
		<!-- 中间 文章标题 文章描述 文章图片开始 -->
		 <view class="zhojian">
			 <view class="biaoti"><h4>前端开发之vue基础篇</h4></view>
			 <view class="msu">v-if 是控制组件显示和隐藏，组件的生命周期也不同，为true时，会触发组件的创建和绑定生命周期，为false时会触发销毁的生命周期函数</view>
		     <view class="_image">
				 <view>
					 <u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="square" radius="10%" width="300rpx" height="225rpx">
					 </u--image>
				 </view>
				 <view>
				      <u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="square" radius="10%" width="300rpx" height="225rpx">
				 	  </u--image>
				 </view>
				 <view>
				      <u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="square" radius="10%" width="300rpx" height="225rpx">
				 	  </u--image>
				 </view>
			</view>
		 </view>
		<!-- 中间 文章标题 文章描述 文章图片结束 -->
		<!-- 点赞评论收藏开始 -->
		<view class="xiamian">
			 <view>
				 <text class="iconfont icon-a-27-liulan"></text>
				 <text>103</text>
			 </view>
			 <view>
				 <text class="iconfont icon-a-5-xinxi"></text>
				 <text>评论</text>
			 </view>
			 <view>
				 <text class="iconfont icon-a-106-xihuan"></text>
				 <text>1</text>
			 </view>
		</view>
		<!-- 点赞评论收藏结束 -->
	</view>
</template>

<script>
	export default {
		name:"blog-item",
		data() {
			return {
				src: 'https://cdn.uviewui.com/uview/album/1.jpg'
			};
		}
	}
</script>

<style lang="scss">
.blog{
	border-bottom: #F7F7F7 15rpx solid;
	
 .sbian {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .zb {
    display: flex;
    flex-direction: row;
    align-items: center;
	> view{
		margin-right: 15rpx;
	}
	.yhm{
		color: #403832;
		font-size: 25rpx
	}
	.time{
		color: #a9aaa4;
		font-size: 20rpx;
	}
  }

  .yb {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    > view {
      margin-left: auto;
	  font-size: 45rpx;
    }
  }

}
  // 中间 文章标题 文章描述 文章图片开始
  .zhojian{
	  margin: 20rpx 0;
	  .msu{
		  margin-top: 15rpx;
		  font-size: 25rpx;
		   //文字超过2行用省略号表示开始
		    overflow: hidden;
		     display: -webkit-box;
		     -webkit-line-clamp: 2;
		     -webkit-box-orient: vertical;
		     text-overflow: ellipsis;
			//文字超过2行用省略号表示结束
	  }
	  ._image{
		   display: flex;
		    flex-wrap: wrap;
			padding-top: 15rpx;
		   view{
			     display: flex;
			      flex-wrap: wrap;
			       margin: 0.5rpx;
				   
				   
		   }
	  }
  }
  //点赞评论收藏开始
  .xiamian{
	    display: flex;
	     justify-content: space-between;
		 margin-bottom: 20rpx;
	 view{
		  display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;
		text:nth-of-type(2) {
		  font-size: 20rpx;
		  margin-left: 5rpx;
		};
		text:nth-of-type(1){
			font-size: 40rpx;
		}
	 }
  }
  }
</style>
