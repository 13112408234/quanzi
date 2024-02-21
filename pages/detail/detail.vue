<template>
	<view class="detail_css">

		<!-- 数据请求时等待开始 -->
		<view v-if="loading">
			<!-- 骨架屏开始 -->
			<u-skeleton rows="12" loading></u-skeleton>
			<!-- 骨架屏结束 -->
		</view>
		<!-- 数据请求时等待结束 -->
		<view v-else>
			<!-- 标题开始 -->
			<view class="">
				<h1>{{data.title}}</h1>
			</view>
			<!-- 标题结束 -->
			<!-- 头像及用户信息开始 -->
			<view class="yh">
				<!-- 头像 -->
				<view class="tx"><u-avatar
						:src="data.user_id[0].avatar_file ? data.user_id[0].avatar_file : '/static/images/panda.jpg' "
						shape="circle" size="30"></u-avatar>
				</view>
				<!-- 用户信息 -->
				<view class="yhxx">
					<text
						class="name">{{data.user_id[0].nickname ? data.user_id[0].nickname : data.user_id[0].username}}</text>
					<view class="sf">
						<text><uni-dateformat :date="data.publish_date" format="yyyy年MM月dd hh:mm:ss">
							</uni-dateformat>
						</text>
						<text>·发布于{{data.province}}</text>
					</view>
				</view>
			</view>
			<!-- 头像及用户信息结束 -->
			<!-- 主体内容开始 -->
			<view class="content">
				<u-parse :content="data.content" :lazyLoad="true" loadingImg="/static/images/panda.jpg"
					:tagStyle="style" :selectable="true"></u-parse>
			</view>
			<!-- 主体内容结束 -->
		</view>


		<!-- 点赞部分开始 -->
		<view class="dz">
			<!-- 点赞按钮 -->
			
			<view class="dz_button" @click="clickLike" :class="like_jh?'active':''">
				<text class="iconfont icon-good-fill"></text>
				<text v-if="data.like_count">{{data.like_count}}</text>
			</view>
			<!-- 点赞过的头像 -->
			<view class="tx_list">
				<view class="tx"><u-avatar src="/static/images/panda.jpg " shape="circle" size="24"></u-avatar>
				</view>
				<view class="tx"><u-avatar src="/static/images/panda.jpg " shape="circle" size="24"></u-avatar>
				</view>
			</view>
			<!-- 多少人看过 -->
			<view class="browse">
				<text class="shul">{{data.view_count}}</text>
				<text>人看过</text>
			</view>
		</view>

		<!-- 点赞部分结束 -->

	</view>
</template>

<script>
	const db = uniCloud.database()
	//引入utilsObj云对象
	const utilsObj = uniCloud.importObject("utilsObj",{
		customUI:true
	})
	export default {

		data() {
			return {
				artId: '',
				//uview富文本样式的处理
				style: {
					p: "line-height:1.7em;font-size:16px",
					img: "margin: 10rpx 0"

				},
				// 骨架屏
				loading: true,
				//详情页数据
				data: [],
				//当前用户是否点过赞
				like_jh: -1
			};
		},
		onLoad(e) {
			//判断是否有id传过来，没有的话不给跳转到详情页
			if (!e.id) {
				this.errFun()
				return
			}


			this.artId = e.id
			console.log(this.artId)
			//获取详情页的网络请求
			this.getDetailData()
			//阅读量+1
			this.readUpdate()
			//当前用户是否点过赞
			 this.likeArticle()
			
		},
		methods: {
			//点赞操作
			async clickLike() {
               //节流代码
               	  //获取到时间搓
               	  let timeDtata = Date.now();
               	  //第二次点击和第一次要间隔2秒
               	  if(timeDtata - this.likeTime < 2000){
               		     uni.showToast({
               		     	title:"操作太频繁，请稍后·····",
               		  		icon:'none'
               		     })
               		  return
               	  }
               	  this.likeTime = timeDtata  //记录上一次点击的时间
				  
				  //点赞发起网络请求
				  this.likeFun()
				  
			
                
			},
		
		
     //点赞发起网络请求
			likeFun(){
				//如果点过赞，则不执行添加记录操作
				if (this.like_jh  ) {	
					this.like_jh-=1
					//文章总点赞-1
					this.data.like_count-=1
						// 点赞数-1
						utilsObj.operation("quanzi_article", "like_count", this.artId, -1).then(res => {
							  //取消点赞 1代表已经点过赞，0代表没有				
							// 删除quanzi_like表记录过该用户点赞的记录
							db.collection("quanzi_like").where(`article_id =="${this.artId}" && user_id == $cloudEnv_uid`).remove()
						})
				  
				} else {
					//取消点赞 1代表已经点过赞，0代表没有
					this.like_jh+=1
					//文章总点赞-1
					this.data.like_count+=1
					//用户点赞
					db.collection("quanzi_like").add({
						article_id: this.artId
					}).then(res => {
						//文章点赞数+1
					   utilsObj.operation("quanzi_article", "like_count", this.artId, 1).then(res=>{
				
					   })
					   
					})
					
				} 
			},
	
			
			
			
			
			
			//查询当前用户是否点过赞的函数
		 likeArticle(){
	
			  db.collection("quanzi_like").where(`article_id =="${this.artId}" && user_id == $cloudEnv_uid`).count().then(res=>{
				   this.like_jh = res.result.total
			   }).catch(err=>{
				   consoe.log(err)
			   })
			  
			},
			

			//修改阅读量
			readUpdate() {
				utilsObj.operation("quanzi_article", "view_count", this.artId, 81).then(res => {
					console.log(res)
				})
			},


			// 分装错误的处理
			errFun() {
				//提示
				uni.showToast({
					title: "参数有吴",
					icon: "none"
				})
				//强制跳转到首页
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			},

			//获取详情页数据
			getDetailData() {
				const quanziTemp = db.collection("quanzi_article").getTemp()
				const usersTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
				db.collection(quanziTemp, usersTemp).where(`_id=="${this.artId}"`).get().then(res => {
					if (!res.result.data[0]) {
						console.log(res.result.data)
						console.log("获取详情错误")
						this.errFun()
						return
					}
					console.log(res)
					this.data = res.result.data[0]
					this.loading = false
					uni.setNavigationBarTitle({
						title:this.data.title
					})
				})
			},
		}
	}
</script>

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
	}

	.detail_css {
		padding: 30rpx;
		// 因为微信小程序和h5是不一样的,这样写,能显示100%的效果
		min-height: calc(100vh - var(--window - top));

		.yh {
			display: flex;
			margin: 30rpx 0;

			.tx {
				margin: auto 0;
				/* 上下居中 */
			}

			.yhxx {
				margin-left: 11rpx;

				.name {
					font-size: 21rpx;
					// color: ;
				}

				.sf {
					font-size: 18rpx;
					color: #b5b3b6;
				}
			}
		}

		// 点赞部分
		.dz {
			margin: 30rpx 0;
			

			.dz_button {
				&.active{
					 background-color: #0199FE !important;
				}
				display: flex;
				flex-direction: column;
				width: 220rpx;
				height: 100rpx;
				background-color: #e3e3e3;
				margin: 0 auto;
				border-radius: 48rpx;
				margin-bottom: 30rpx;

				text {
					flex: 1;
					display: flex;
					justify-content: center;
					/* 水平居中 */
					align-items: center;
					/* 垂直居中 */
					font-size: 25rpx;
					color: #fff;
					// border: 1px solid red;
				}

				.iconfont {
					margin-top: 5rpx;
					font-size: 50rpx;
				}
			}

			//头像
			.tx_list {
				display: flex;
				flex: 1;
				justify-content: center;

				.tx {
					margin: 0 5rpx;
				}
			}

			//浏览量
			.browse {
				display: flex;
				justify-content: center;
				margin-top: 40rpx;
				font-size: 25rpx;
				color: #b1b1b1;

				.shul {
					// color:  #5e75c8;
				}
			}

		}
	}
</style>