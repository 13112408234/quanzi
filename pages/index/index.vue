<template>
	<view class="home">



		<!-- 骨架屏 -->
		<view class="loadingState" v-if="loadState">
			<u-skeleton :loading="loadState" rows="3" avatar></u-skeleton>
		</view>
		<swiper @change="swiperChange" style="height: 1200rpx; width: 100%;" item-id>

			<swiper-item style="height: 100%; border: 1xp solid red;">

				<z-paging ref="paging" refresher-only @onRefresh="onRefresh">
					<!-- 页面内容 -->
					<view slot="top">
						<!-- 导航 -->
						<u-tabs :list="navlist" @click="clickNav" :current="current"
							:inactiveStyle="{color:'#888',transform: 'scale(1)'}"
							:activeStyle="{ color: '#303133',fontWeight: 'bold',transform: 'scale(1.07)',  }"></u-tabs>
					</view>

					<!-- 主体 -->
					<view class="content">
						<view class="item" v-for="(item,index) in essayDataList">
							<blog-item :item="item" :index="index" @isLike-event="handIslikeEvent"></blog-item>
						</view>
					</view>

				</z-paging>
			</swiper-item>

			<swiper-item style="height: 100%; border: 1xp solid red;">
				<z-paging ref="paging" refresher-only @onRefresh="onRefresh">
					<!-- 页面内容 -->
					<!-- 主体 -->
					<view class="content">
						<view class="item" v-for="(item,index) in essayDataListTwo">
							<blog-item :item="item" :index="index" @isLike-event="handIslikeEvent"></blog-item>
						</view>
					</view>

				</z-paging>
			</swiper-item>
		</swiper>

<!-- 		<z-paging-swiper>
			<view slot="top"> -->
				<!-- 导航 -->
	<!-- 			<u-tabs :list="navlist" @click="clickNav" :current="current"
					:inactiveStyle="{color:'#888',transform: 'scale(1)'}"
					:activeStyle="{ color: '#303133',fontWeight: 'bold',transform: 'scale(1.07)',  }"></u-tabs>
			</view>
			<swiper>
				<swiper-item> -->
					<!-- 主体 -->
	<!-- 				<view class="content">
						<view class="item" v-for="(item,index) in essayDataList">
							<blog-item :item="item" :index="index" @isLike-event="handIslikeEvent"></blog-item>
						</view>
					</view>
				</swiper-item>
				<swiper-item> -->
					<!-- 主体 -->
	<!-- 				<view class="content">
						<view class="item" v-for="(item,index) in essayDataListTwo">
							<blog-item :item="item" :index="index" @isLike-event="handIslikeEvent"></blog-item>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</z-paging-swiper> -->






		<!-- 编辑图标 -->
		<view class="edit">
			<text class="iconfont icon-a-21-xiugai" @click="goEdit"></text>
		</view>

	</view>
</template>

<script>
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	//获取逻辑运算符对象
	const dbCmd = db.command
	//引入utilsObj云对象
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	})
	import {
		EventBus
	} from '@/main.js'
	export default {

		data() {
			return {
				//导航栏数据
				navlist: [{
						name: '最新',
						type: 'publish_date'
					},
					{
						name: '热门',
						type: 'view_count'
					},

				],
				list: [1, 2, 3, 4, 55, 6, 8, 7, 8],
				//导航栏指定第几个被激活
				current: 0,
				//控制骨架屏显示和隐藏
				loadState: true,
				//文章列表最新
				essayDataList: [],
				//文章列表热门
				essayDataListTwo: [],
				//下拉刷新的状态
				refresher: true
			}
		},
		onLoad() {
			this.getDate()
			// db.collection("quanzi_like").remove()
			EventBus.$on('eventName', (likeState, likeCount, index) => {
				// 处理接收到的事件和数据
				this.essayDataList[index].likeState = likeState
				this.essayDataList[index].like_count = likeCount

			})

		},
		methods: {
			// 下拉刷新被触发
			onRefresh() {
				this.getDate()
				// 告知z-paging下拉刷新结束，这样才可以开始下一次的下拉刷新

			},
			//页面左右滑动会触发改函数
			swiperChange(e) {
				console.log(e.detail.current);
				this.current = e.detail.current //左右滑动来改变导航
				if (this.essayDataList.length == 0 || this.essayDataListTwo.length == 0) this.getDate()
			},
			//点赞
			handIslikeEvent(index) {
				//节流代码
				//获取到时间搓
				let timeDtata = Date.now();
				//第二次点击和第一次要间隔2秒
				if (timeDtata - this.likeTime < 500) {
					uni.showToast({
						title: "操作太频繁，请稍后·····",
						icon: 'none'
					})
					return
				}
				this.likeTime = timeDtata //记录上一次点击的时间
				const article = this.essayDataList[index] //获取当前点击文章数据
				article.likeState = !article.likeState
				console.log(article)
				//点赞
				if (article.likeState) {
					article.like_count++
					//文章点赞数+1
					utilsObj.operation("quanzi_article", "like_count", article._id, 1).then(res => {
						//取消点赞 1代表已经点过赞，0代表没有				
						db.collection("quanzi_like").add({
							article_id: article._id,
							user_id: uniCloud.getCurrentUserInfo().uid
						})
					})
					return
				}

				article.like_count--
				utilsObj.operation("quanzi_article", "like_count", article._id, -1).then(res => {
					db.collection("quanzi_like").where(`article_id =="${article._id}" && user_id == $cloudEnv_uid`)
						.remove()
				})

			},

			//网络请求数据 essayDataListTwo
			getDate() {
				//开启骨架屏
				if (this.essayDataList.length === 0 && this.current === 0) this.loadState = true
				if (this.essayDataListTwo.length === 0 && this.current === 1) this.loadState = true
				//field可以指定返回哪一些字段
				let artTemp = db.collection("quanzi_article")
					.field("title,user_id,description,picurls,view_count,like_count,comment_count,publish_date").getTemp()
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
				//orderBy("publish_date desc")倒叙排列
				db.collection(artTemp, userTemp).orderBy(this.navlist[this.current].type, "desc").get().then(async res => {
					//关闭下拉刷新
					this.$refs.paging.complete();
					if (this.current == 0) this.essayDataList = res.result.data
					if (this.current == 1) this.essayDataListTwo = res.result.data
					//只显示3张图片
					for (let i = 0; i < this.essayDataList.length; i++) {
						this.essayDataList[i].picurls.splice(3)
					}
					//隐藏骨架屏
					this.loadState = false
					//如果没有登录则return
					if (!store.hasLogin) return
					// 存储文章id  
					let idArr = []
					// 点赞按钮初始化状态
					var likeState = {
						likeState: false
					};
					this.essayDataList.forEach((item, index) => {
						//给每一篇文章添加点赞按钮的初始化状态
						// this.essayDataList[i] = {...this.essayDataList[i],...likeState}
						this.$set(this.essayDataList[index], 'likeState', false)

						idArr.push(item._id)
					})
					console.log(this.essayDataList)
					// console.log(idArr)
					//发起网络请求当前文章是否被有该用户的点赞
					let likeRes = await db.collection("quanzi_like").where({
						article_id: dbCmd.in(idArr),
						user_id: uniCloud.getCurrentUserInfo().uid
					}).get()
					// console.log(likeRes)
					likeRes.result.data.forEach(item => {
						let findindex = this.essayDataList.findIndex(find => {
							return item.article_id == find._id
						})
						//修改已经点赞用户状态为true
						//this.essayDataList[findindex].likeState = true
						// this.$set(this.essayDataList[findindex],'likeState',true)
						this.essayDataList[findindex].likeState = true

					})
					console.log(this.essayDataList)
				})
			},
			//点击跳转编辑文章按钮
			goEdit() {
				uni.navigateTo({
					url: '/pages/edit/edit'
				})

			},
			clickNav(e) {
				console.log(e)
				this.current = e.index
				//清空文章列表
				this.essayDataList = []
				//显示骨架屏
				this.loadState = true
				//重新发送网络请求
				this.getDate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.z-paging-content-fixed {
		top: 0 !important;
	}

	.home {
		.loadingState {
			padding: 20rpx;
		}

		.topnav {
			margin-bottom: 30rpx;
		}

		.content {
			.item {
				padding: 30rpx;
			}
		}

		.edit {
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

			.iconfont {
				font-size: 50rpx;
				color: #fff;
			}
		}
	}
</style>