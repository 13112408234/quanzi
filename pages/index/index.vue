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
			   <view class="item" v-for="item in essayDataList">
				   <blog-item :item="item"></blog-item>
			   </view>
		  </view>
		  
		  
		  <!-- 编辑图标 -->
		  <view class="edit">
			   <text class="iconfont icon-a-21-xiugai" @click="goEdit"></text>
		  </view>
		  
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				//导航栏数据
				navlist: [
					{
						name: '最新',
						type: 'publish_date'
					},
					{
						name: '热门',
						type: 'view_count'
					}
				],
				
				//导航栏指定第几个被激活
				current: 0,
				//控制骨架屏显示和隐藏
				loadState : true,
				//文章列表
				essayDataList:[]
			}
		},
		onLoad() {
            this.getDate()
		},
		methods: {
			//网络请求数据
			getDate(){
				//field可以指定返回哪一些字段
				 let artTemp = db.collection("quanzi_article")
				 .field("title,user_id,description,picurls,view_count,like_count,comment_count,publish_date").getTemp()
				 let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
				 //orderBy("publish_date desc")倒叙排列
				 db.collection(artTemp,userTemp).orderBy(this.navlist[this.current].type,"desc").get().then(res=>{
					  
					 this.essayDataList = res.result.data
					 for (let i = 0; i < this.essayDataList.length; i++) {
					 	this.essayDataList[i].picurls.splice(3)
					 }
					 //隐藏骨架屏
					 this.loadState = false
					 console.log(this.essayDataList)
				 })
			},
			//点击跳转编辑文章按钮
			goEdit(){
				uni.navigateTo({
					url:'/pages/edit/edit'
				})
			},
            clickNav(e){
				 console.log(e)
				 this.current = e.index
				 //清空文章列表
				this.essayDataList=[]
				//显示骨架屏
				this.loadState = true
				 //重新发送网络请求
				 this.getDate()
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
