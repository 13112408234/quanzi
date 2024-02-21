<template>
	<view class="blog" @click="goDetail">
		<!-- 头部 头像，用户名 时间开始 -->
		<view class="sbian">
			<view class="zb">
				<view class="tx"><u-avatar :src="item.user_id[0].avatar_file ? item.user_id[0].avatar_file : '/static/images/panda.jpg' " shape="circle" size = "20"></u-avatar></view>
				<view class="yhm">{{item.user_id[0].nickname ? item.user_id[0].nickname : item.user_id[0].username}}</view>
				<view class="time">
					<uni-dateformat :date="item.publish_date" format="MM月dd hh:mm" :threshold="[60000,3600000*24*30]">
					</uni-dateformat>
				</view>
			</view>
			 <view class="yb">
				 <view class="iconfont icon-ellipsis"></view>
			 </view>
		</view>
		<!-- 头部 头像，用户名 时间结束 -->
		<!-- 中间 文章标题 文章描述 文章图片开始 -->
		 <view class="zhojian" >
			 <view class="biaoti"><h4>{{item.title}}</h4></view>
			 <view class="msu">{{item.description}}</view>
		     <view class="_image">
				 <view v-for="(img,index) in item.picurls" :key="img">
					 <image :src="img" @click.stop="djimg(index)"></image>
				 </view>
			</view>
		 </view>
		<!-- 中间 文章标题 文章描述 文章图片结束 -->
		<!-- 点赞评论收藏开始 -->
		<view class="xiamian">
			 <view>
				 <text class="iconfont icon-a-27-liulan"></text>
				 <text>{{item.view_count}}</text>
			 </view>
			 <view>
				 <text class="iconfont icon-a-5-xinxi"></text>
				 <text>{{item.comment_count?item.comment_count:'评论'}}</text>
			 </view>
			 <view>
				 <text class="iconfont icon-a-106-xihuan"></text>
				 <text>{{item.like_count?item.like_count:'点赞'}}</text>
			 </view>
		</view>
		<!-- 点赞评论收藏结束 -->
	</view>
</template>

<script>
	export default {
		name:"blog-item",
		props:{
			item:{
				type:Object
			}
		},
		data() {
			return {
			};
		},
		methods:{
			goDetail(e){
				console.log("列表被点击了")
				//把id传给详情页
				uni.navigateTo({
					url:'/pages/detail/detail?id='+this.item._id
				})
			},
			//在列表点击预览图片
			djimg(index,e){
				 console.log('img被点击');
				uni.previewImage({
					current:index,
					urls:this.item.picurls
				})
				
			}
		},
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
				   width: 31%;
				 image{
                    width: 100%; /* 设置图片宽度为容器宽度的100% */
                      height: auto; /* 高度自适应，保持原始宽高比例 */
                      aspect-ratio: 3 / 2; /* 设置图片的宽高比例为3:2 */
                      max-width: 100%; /* 设置图片的最大宽度为容器宽度 */
				 }
				   
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
