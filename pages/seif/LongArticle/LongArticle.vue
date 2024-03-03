<template>
	<view class="LongArticle">
		<!-- 	{{Article_date}} -->
		<view class="articleList" v-for="(item,index) in Article_date" @click="artcleClick(index)">
			<view class="zb">
				<text>{{item.title}}</text>
				<view class="dateTime">
					<uni-dateformat :date="item.publish_date" format="yyyy年MM月dd hh:mm ">
					</uni-dateformat>
				</view>
			</view>
			<view class="yb">
				<text class="iconfont icon-a-10-you"></text>
			</view>
		</view>
		<!-- 下拉刷新的状态 -->
		<loading :loading="loading"></loading>
	</view>
</template>

<script>
	//链接数据库
	const db = uniCloud.database()
	export default {
		data() {
			return {
				//自己长文的数据
				Article_date: [],
				//分页
				pagesInfo: {
					//一次请求多少条数据
					limitData: 15,
					//从第几条开始请求
					skipCount: 0
				}, 
				loading: true
			}
		},
		onShow() {
			//  this.Article_date = []
			// this.LongArticle_date()
		},
		onLoad() {
			this.LongArticle_date()
		},
		onReachBottom() {
			console.log("到底部")
			this.LongArticle_date()
		},
		methods: {
			artcleClick(index){
				console.log(this.Article_date[index]._id)
				uni.navigateTo({
					url:'/pages/seif/updateArticle/updateArticle?id='+this.Article_date[index]._id
				})
			},
			//获取自己的长文
			LongArticle_date() {
				// if(!this.loading){return}
				db.collection("quanzi_article").where(`user_id==$cloudEnv_uid`).orderBy("publish_date", "desc").limit(this
					.pagesInfo.limitData).skip(this.pagesInfo.skipCount).get().then(
					res => {
						console.log(res)
						//2个数组的数据拼接在一起
						this.Article_date = this.Article_date.concat(res.result.data);
						//判断如果返回是空数据，则表示下拉刷新没有数据啦，提示没有更多
						if (res.result.data.length < this.pagesInfo.limitData) {
							this.loading = false
							return
						}
						
						// console.log(this.Article_date)

					})
				//过滤掉请求过的数据
				// this.skip += this.limit
				this.pagesInfo.skipCount += this.pagesInfo.limitData
			},
		}
	}
</script>

<style scoped lang="scss">
	.LongArticle {
		padding: 0 30rpx;

		.articleList {
			display: flex;
			justify-content: space-between;
			height: 160rpx;
			border-bottom: 1px solid #f1f1f1;
			font-size: 35rpx;

			.zb {
				margin: auto 0;
				white-space: nowrap;
				/* 不换行 */
				overflow: hidden;
				/* 隐藏超出部分 */
				text-overflow: ellipsis;
				/* 显示省略号 */
				width: 85%;

				text {
					// font-weight: 600;
				}

				.dateTime {
					margin-top: 10rpx;
					font-size: 25rpx;
					color: #4f5765;
				}
			}

			.yb {
				margin: auto 0;

				.iconfont {
					font-size: 25rpx;
					color: #4f5765;
				}
			}
		}
	}
</style>