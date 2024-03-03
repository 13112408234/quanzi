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
				<view class="tx"><u-avatar :src="UserAvatar(data)" shape="circle" size="30"></u-avatar>
				</view>
				<!-- 用户信息 -->
				<view class="yhxx">
					<text class="name">{{giveName(data)}}</text>
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
				<view class="tx" v-for="item in AvatarGroupsData"><u-avatar :src="UserAvatar(item)" shape="circle"
						size="24"></u-avatar>
				</view>
				<!-- <view class="tx"><u-avatar src="/static/images/panda.jpg " shape="circle" size="24"></u-avatar>
				</view> -->
			</view>
			<!-- 多少人看过 -->
			<view class="browse">
				<text class="shul">{{data.view_count}}</text>
				<text>人看过</text>
			</view>
		</view>

		<!-- 点赞部分结束 -->

		<!-- 评论 -->
		<view style="font-size: 34rpx; font-weight: 600; margin: 42rpx 0;">
			<text>评论</text>
			<text style="margin-left: 8rpx;">{{sumComment}}</text>
		</view>
		<view class="comment" v-if="CommentList.length " >
			<detail-comments v-for="(item,index) in CommentList" :key="index" :item="item" :index="index"
				@deletComment-event="handeDeletComment" @oneComment-event="handOneComment"
				@unfoldComment-event="handUnfoldComment" :UnfoldInfo="UnfoldInfo"
				@twoComment-event="handTwoComment"></detail-comments>

			<!-- 回复评论的输入评论框 -->
			<u-popup :show="showUnfold" mode="bottom" @close="UnfoldClick">

				<comment-frame :commentObj="commentObj" @comment-event="Pcomment" :OneComment="OneComment"
					:commentFrame="commentFrame"></comment-frame>
				<view>回复评论</view>
			</u-popup>
		</view>
		<!-- 空评论提示 -->
		<view v-if="!CommentList.length && noComment" style="padding-bottom: 150rpx;">

			<u-empty mode="comment" icon="https://cdn.uviewui.com/uview/empty/comment.png">
			</u-empty>
		</view>
		<!-- 评论输入框 -->
		<view class="">
			<comment-frame :commentObj="commentObj" @comment-event="Pcomment" :OneComment="OneComment"
				:commentFrame="commentFrame"></comment-frame>
		</view>
	</view>
</template>

<script>
	import {
		giveName,
		UserAvatar
	} from '@/utils/tool.js'
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	//导入事件总线
	import {
		EventBus
	} from '@/main.js'
	const db = uniCloud.database()
	//引入utilsObj云对象
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	})
	//获取逻辑运算符对象
	const dbCmd = db.command
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
				like_jh: 0,
				index: 0,
				// 头像组
				AvatarGroupsData: [],
				//当前用户的头像
				cuUserAvatar: {},
				//评论参数
				commentObj: {
					//0代表文章评论，1代表回复评论
					comment_type: 0,
					//文章的id
					article_id: null
				},
				// 接收一二级评论的数据
				CommentList: [],
				//接收二级评论
				TwoCommentList:[],
				// 总评论数
				sumComment:0,
				noComment: false,
				//接收点击一级评论的数据
				OneComment: {},
				// 展开评论
				UnfoldInfo: {
					// 展开评论的条数
					tolar: 0,
					//隐藏展开评论
					UnfoldBoole: true,
					//文章的用户id
					AvatarUserId:'',
					//用户评论的数据
					CommentList:this.CommentList
			
				},
				// 回复评论框
				showUnfold: false,
				//给comment-frame组件的props属性
				commentFrame: {
					placeholder: '评论点什么把~',
					focus: false,
				},
				// 回复评论自动弹出键盘
				// 二级评论user_id
				twoUser_id: []
			};
		},
		onLoad(e) {
			//判断是否有id传过来，没有的话不给跳转到详情页
			if (!e.id) {
				this.errFun()
				return
			}


			this.index = e.index
			this.artId = e.id
			this.commentObj.comment_type = 0
			this.commentObj.article_id = this.artId
			// console.log(this.artId)
			//获取详情页的网络请求
			this.getDetailData()
			//阅读量+1
			this.readUpdate()
			//当前用户是否点过赞
			this.likeArticle()
			//获取头像组
			this.AvatarGroups()
			//获取当前用户的头像
			this.user(),
				//获取评论的网络请求
				this.getComment()
			// 显示回复评论的条数
			// let twocmmentsTmp = this.CommentList[index]?.twocmments ?? []
			// if (twocmmentsTmp.length) this.UnfoldInfo.tolar = twocmmentsTmp.length //回复评论的条数
		},
		computed: {
			hasLogin() {
				return store.hasLogin
			}
		},
		methods: {
			giveName,
			UserAvatar,
			//回复二级评论
			handTwoComment(e) {
				this.showUnfold = !this.showUnfold //弹出弹窗
				this.commentFrame.focus = true //弹出键盘
				let {
					index,
					item
				} = e //解构
				let twocmments = item.twocmments[index] //取出二级评论
				console.log(item);
				this.commentObj.comment_type = 2 //2级评论
				let name = giveName(twocmments) //取出二级用户的名字
				this.commentFrame.placeholder = '回复 ' + name + ' :' //输入框改变
				this.commentObj.reply_comment_id = item._id //一级评论的id
				let twoId = item?.twocmments[index] //取出二级评论的id
				this.commentObj.two_comment = twoId._id
				this.commentObj.two_comment_id = twoId?.user_id[0]?._id ?? '' //取出回复二级评论的id
				this.twoUser_id = twoId?.user_id[0] ?? ''
				console.log(this.commentObj);
			},
			//监听点击遮罩层
			UnfoldClick() {
				this.showUnfold = false
				// 遮罩层关闭,就是没有点击回复评论,那就是回复文章
				this.commentObj.comment_type = 0
				this.commentFrame.placeholder = '评论点什么把~'
				//收起键盘
				this.commentFrame.focus = false
			},
			//点击回复评论
			//         UnfoClick(){
			//         	this.showUnfold = true

			//         },
			// 点击展开评论
			handUnfoldComment(index) {
				let twocmmentsTmp = this.CommentList[index]?.twocmments ?? []
				// if (twocmmentsTmp.length) this.UnfoldInfo.tolar = twocmmentsTmp.length //回复评论的条数
				for (let i = 0; i < twocmmentsTmp.length; i++) {
					if (i + 1 >= twocmmentsTmp.length) this.CommentList[index].showUnfold = false //如果没有更多评论，就隐藏更多评论的提示组件
					let display = twocmmentsTmp[i]?.display ?? ''
					if (!display) {

						// this.CommentList[index].twocmments[i].display = true
						if (this.CommentList[index].twocmments[i]) this.$set(this.CommentList[index].twocmments[i],
							'display', true);
						if (this.CommentList[index].twocmments[i + 1]) this.$set(this.CommentList[index].twocmments[i + 1],
							'display', true);
						if (this.CommentList[index].twocmments[i + 2]) this.$set(this.CommentList[index].twocmments[i + 2],
							'display', true);
						break;
					}
				}

			},
			//接收点击一级评论的数据
			handOneComment(event) {
				this.OneComment = event
				this.showUnfold = !this.showUnfold //弹出弹窗
				this.commentFrame.focus = true //弹出键盘
				let name = giveName(this.OneComment) //用户名字
				this.commentFrame.placeholder = '回复 ' + name + ' :' //输入框改变
				this.commentObj.comment_type = 1 //一级
				this.commentObj.reply_comment_id = this.OneComment._id //回复一级评论的id
				this.commentObj.two_comment = '' //二级回复为空
				console.log(this.commentObj.reply_comment_id);
			},
			//删除评论
			handeDeletComment(e) {
				this.CommentList.splice(e.index, 1)
				console.log(e);
				db.collection("quanzi-comment").where(`_id=="${e.id}" || reply_comment_id=="${e.id}"`).remove().then(
					res => {
						//评论数-1
						console.log(res)
						utilsObj.operation("quanzi_article", "comment_count", this.commentObj.article_id, -1)
					})
			},
			// 评论成功的回调
			Pcomment(e) {
				this.UnfoldClick()

				if (e.comment_type == 0) {
					console.log(e)
					this.CommentList.unshift({
						// ...this.commentObj,
						...e,
						twocmments:[],
						user_id: [store.userInfo]
					})
					console.log(this.CommentList);
				}
				if (e.comment_type == 1 || e.comment_type == 2) {
					console.log(e)
					console.log("这个是二级评论");
					this.CommentList.forEach((item, i) => {
						if (item._id === e.reply_comment_id) this.CommentList[i].twocmments.unshift({
							...e,
							user_id: [store.userInfo],
							display: true,
							twoUser_id: this.twoUser_id
						})
					})
				}

			},
			//评论网络请求
			getComment() {
				let commentTemp = db.collection("quanzi-comment").where(`article_id=="${this.artId}"`).getTemp()
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
				db.collection(commentTemp, userTemp).orderBy("comment_date", "desc").get().then(res => {
					if (res.result.data.length == 0) this.noComment = true
					console.log(res.result.data);
					let twocomment = [] //存临时二级评论
					let CommentListTmp = [] //存临时一级评论
					//区分出一二级评论
					res.result.data.forEach((item, i) => {
						if (item.comment_type == 0) CommentListTmp.push(item)
						if (item.comment_type == 1 || item.comment_type == 2) twocomment.push(item)
						// if (item.comment_type == 2) {
						// 	let twoUser =  db.collection("uni-id-users").where(
						// 		`_id=="${item.two_comment_id}"`).field(
						// 		"_id,username,nickname,avatar_file").get()
						// 		item.twoUser_id = twoUser?.result?.data[0]?.avatar_file??''
						// 		twocomment.push(item)
						// 	console.log(item);
						// }

					})
					console.log(CommentListTmp)
                    this.TwoCommentList = twocomment  //把二级评论存全局
					 this.sumComment = twocomment.length + CommentListTmp.length
					CommentListTmp.forEach((item, i) => {
						this.$set(CommentListTmp[i], 'twocmments', [])
						CommentListTmp[i].showUnfold = true //添加showUnfold属性来判断是否展开二级评论
						twocomment.forEach((list, j) => {
							if (item._id == list.reply_comment_id) CommentListTmp[i].twocmments
								.push(list)

						})
						if (CommentListTmp[i].twocmments && CommentListTmp[i].twocmments.length > 0) {
							this.$set(CommentListTmp[i].twocmments[0], 'display', true);
						}
					})
					this.CommentList = CommentListTmp
					this.CommentList.forEach((item, i) => {
						this.CommentList[i].twocmments.forEach((list, j) => {
							if (this.CommentList[i].twocmments[j].comment_type == 2) {
								db.collection("uni-id-users").where(
									`_id=="${list.two_comment_id}"`).field(
									"_id,username,nickname,avatar_file").get().then(res => {
									this.$set(this.CommentList[i].twocmments[j],
										"twoUser_id", res.result.data[0])
									console.log(this.CommentList[i].twocmments[j])
								})
								// 	item.twoUser_id = twoUser?.result?.data[0]?.avatar_file??''
								// 	twocomment.push(item)
								// console.log(item);
							}
						})
					})
					// console.log(this.CommentList);
				})
			},


			//获取当前用户的头像
			user() {
				db.collection("uni-id-users").where(`_id==$cloudEnv_uid`).field("avatar_file").get().then(res => {
					// console.log(res.result.data[0])
					this.cuUserAvatar = res.result.data[0]
					console.log(this.cuUserAvatar)
				})
			},


			// 获取该文章点赞所有用户头像
			AvatarGroups() {

				let likeTemp = db.collection("quanzi_like").where(`article_id=="${this.artId}"`).getTemp()
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file").getTemp()
				db.collection(likeTemp, userTemp).orderBy("publish_date", "desc").limit(3).get().then(res => {
					res.result.data = res.result.data.reverse()
					this.AvatarGroupsData = res.result.data
					console.log(this.AvatarGroupsData)

				})

			},



			//点赞操作
			async clickLike() {
				//假如用户没有登录
				if (!this.hasLogin) {
					await uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withpwd',
					});
					return
				}

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

				//点赞发起网络请求
				this.likeFun()
				EventBus.$emit('eventName', this.like_jh, this.data.like_count, this.index)

			},

			//点赞发起网络请求
			likeFun() {

				console.log(this.AvatarGroupsData)
				console.log('当前id为' + this.cuUserAvatar._id)


				//如果点过赞，则不执行添加记录操作
				if (this.like_jh) {
					if (this.data.like_count <= 0) {
						return
					}

					this.like_jh -= 1
					//文章总点赞-1
					this.data.like_count -= 1
					//移除当前取消点赞的用户头像
					this.AvatarGroupsData.forEach((item, i) => {
						const {
							user_id
						} = item
						if (user_id) {
							if (item.user_id[0]._id == this.cuUserAvatar._id) {
								this.AvatarGroupsData.splice(i, 1)
								console.log(i)
								console.log(item._id)
								console.log(this.cuUserAvatar._id)
								console.log("匹配到")
							} // 移除当前头像
						} else {
							if (item._id == this.cuUserAvatar._id) this.AvatarGroupsData.splice(i, 1)

						}
					})


					// 点赞数-1
					utilsObj.operation("quanzi_article", "like_count", this.artId, -1).then(res => {
						//取消点赞 1代表已经点过赞，0代表没有				
						// 删除quanzi_like表记录过该用户点赞的记录
						db.collection("quanzi_like").where(
							`article_id =="${this.artId}" && user_id == $cloudEnv_uid`).remove().then(res => {
							//刷新头像组
							// this.AvatarGroups()
						})
					})

				} else {


					//取消点赞 1代表已经点过赞，0代表没有
					this.like_jh += 1
					//文章总点赞-1
					this.data.like_count += 1
					// 添加当前头像
					this.AvatarGroupsData.push(this.cuUserAvatar)
					//用户点赞
					db.collection("quanzi_like").add({
						article_id: this.artId,
						user_id: uniCloud.getCurrentUserInfo().uid
					}).then(res => {
						//文章点赞数+1
						utilsObj.operation("quanzi_article", "like_count", this.artId, 1).then(res => {
							// //刷新头像组
							// this.AvatarGroups()
						})

					})

				}
			},






			//查询当前用户是否点过赞的函数
			likeArticle() {
				//用户没有登录，就不用拿当前用户的数据，这样可以避免点击详情就跳转登录页面
				if (!this.hasLogin) {

					return
				}
				db.collection("quanzi_like").where(`article_id =="${this.artId}" && user_id == $cloudEnv_uid`).count()
					.then(res => {
						this.like_jh = res.result.total
					}).catch(err => {
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
				// uni.showToast({
				// 	title: "参数有吴",
				// 	icon: "none"
				// })
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
					this.UnfoldInfo.AvatarUserId = res?.result?.data[0]?.user_id[0]  //把文章id传给评论子组件
					
					console.log(this.UnfoldInfo.AvatarUserId)
					uni.setNavigationBarTitle({
						title: this.data.title
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
		.comment {
			padding-bottom: 120rpx;
			border-top: 15rpx solid #f4f5f7;
		}

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
				&.active {
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