<template>
	<view class="home">
		   
		   
		   <!-- 骨架屏 -->
		   <view class="loadingState">
			   <u-skeleton :loading="loadState" rows="3" avatar></u-skeleton>
		   </view>
		   <!-- 主体 -->
	     <view class="content">
			  <view class="item" v-for="(item,index) in essayDataList">
				   <blog-item :item="item" :index="index"></blog-item>
			   </view>
		  </view>
		  <!-- 加载中 -->
		<loading :loading="loading"></loading>
	</view>
</template>

<script>
	const db = uniCloud.database()
	import {EventBus} from '@/main.js'
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
				essayDataList:[],
				//分页
				pagesInfo: {
					//一次请求多少条数据
					limitData: 5,
					//从第几条开始请求
					skipCount: 0
				}, 
				loading: true
			}
		},
		//重其他页面返回到该也米娜
		onShow() {
			 // this.getDate()
		},
		onLoad() {
            this.getDate()
			EventBus.$on('eventName', (likeState,likeCount,index) => {
			  // 处理接收到的事件和数据
			  this.essayDataList[index].likeState = likeState
			   this.essayDataList[index].like_count = likeCount
				this.essayDataList.splice(index,1)	
			})
		},
		onReachBottom() {
			console.log("到底部")
			this.getDate()
		},
		methods: {
			//网络请求数据
			getDate(){
				//field可以指定返回哪一些字段
				 let likeTemp = db.collection("quanzi_like").where(`user_id==$cloudEnv_uid`).getTemp()
				 let artTemp = db.collection("quanzi_article").field("title,_id,description,picurls,view_count,like_count,comment_count,publish_date").getTemp()
				  let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
				 //orderBy("publish_date desc")倒叙排列
				 db.collection(likeTemp,artTemp,userTemp).orderBy('publish_date',"desc").skip(this.pagesInfo.skipCount).limit(this.pagesInfo.limitData).get().then(res=>{
	          
					  for(let i = 0; i < res.result.data.length; i++){
						  // res.result.data[i]={...res.result.data[i].article_id[0]}
						 res.result.data[i] = { ...res.result.data[i], ...res.result.data[i].article_id[0] };
						 this.$set(res.result.data[i],'likeState',true) //每一个都添加点赞状态
					  }
					  
					   //2个数组的数据拼接在一起
					   this.essayDataList = this.essayDataList.concat(res.result.data);
					   
					  //  this.essayDataList = this.essayDataList[0]?.article_id[0]??{title:'555'}
					  console.log(this.essayDataList)
					 for (let i = 0; i < this.essayDataList.length; i++) {
					 	 if (this.essayDataList[i].picurls && Array.isArray(this.essayDataList[i].picurls)) {
					 	        this.essayDataList[i].picurls.splice(3);
					 	    }
					 }
					 // 下一页的请求设置
					 this.pagesInfo.skipCount += this.pagesInfo.limitData
					 //隐藏骨架屏
					 this.loadState = false
					 // console.log(this.essayDataList)
					 //判断如果返回是空数据，则表示下拉刷新没有数据啦，提示没有更多
					 if (res.result.data.length < this.pagesInfo.limitData) {
					 	this.loading = false
					 						//隐藏骨架屏
					 						this.loadState = false
					 	return
					 }
					 
				 })
			},
			//点击跳转编辑文章按钮
			goEdit(){
				uni.navigateTo({
					url:'/pages/detail/detail'
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

