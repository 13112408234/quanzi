<template>
	<view>
		<view class="comment-item">
			<view class="avatar">
				<u-avatar :src="UserAvatar(item)" size="26"></u-avatar>
			</view>
            
			<view class="wrap">
				<view @click="hfcomment" :style="`background-color: ${color};`" @touchstart="handleTouchStart"
					@touchend="handleTouchEnd">
					<view class="username">
						{{giveName(item)}}
						<text v-if="item.user_id[0]._id === AvatarUserId" class="zzStyle">作者</text>
<!-- 						<view>{{item.user_id[0]._id }}</view>
						<view>{{isUserName}}</view>
						<view>{{AvatarUserId }}</view> -->
					</view>
					<view class="comment-content">{{item.comment_content}}</view>
					<view class="info">
						<view>
							<uni-dateformat :date="item.comment_date" :threshold="[60000,3600000*24*30]">
							</uni-dateformat>
						</view>
						<view>{{item.province}}</view>
						<view class="reply-btn" style="margin-left: 25rpx;">回复 </view>
					</view>
				</view>
				<!-- 二级回复开始 -->
				<view v-for="(list,index) in item.twocmments" style="margin-top:15rpx;">
					<view class="comment-item" v-if="list.display" @click.stop="responses(index)"
						style="width: 100%; margin: 0; padding: 0;">
						<view class="wrap" style="padding: 2rpx;">
							<!-- 头像和名字开始 -->
							<view style="display: flex; align-items: center;">
								<view class="avatar">
									<u-avatar :src="UserAvatar(list)" size="16"></u-avatar>
								</view>
								<view v-if="list.comment_type == 1" class="username" style=" padding: 5rpx;">
									{{giveName(list)}}
									<text v-if="list.user_id[0]._id=== AvatarUserId" class="zzStyle">作者</text>
								</view>
								<view v-else class="username" style=" padding: 5rpx;">
									{{giveName(list)}}
									<text v-if="list.user_id[0]._id=== AvatarUserId" class="zzStyle">作者</text>
									<text style="color: #000; margin: 0 10rpx;">回复</text>
									{{giveName(list.twoUser_id)}}
									<text v-if="list.twoUser_id&&list.twoUser_id._id&&list.twoUser_id._id=== AvatarUserId" class="zzStyle">作者</text>
								</view>
							</view>
							<!-- 头像和名字结束 -->
							<view class="comment-content" style="margin-left: 35rpx;">{{list.comment_content}}</view>
							<view class="info" style="margin-left: 35rpx;">
								<view>
									<uni-dateformat :date="list.comment_date" :threshold="[60000,3600000*24*30]">
									</uni-dateformat>
								</view>
								<view>{{list.province}}</view>
								<view class="reply-btn" style="margin-left: 25rpx;">回复 </view>
							</view>
						</view>
					</view>

				</view>
				<!-- 展开回复 -->
				<view @click.stop="unfoldComment" v-if="item.showUnfold && item.twocmments.length"
					style="margin: 0; padding: 0;">
					<text style="color: #eaeaea;">—</text>
					<text style="color: #777777; font-size: 25rpx;">{{unfoldVlaue}}</text>
					<text class="iconfont icon-a-12-xia" style="font-size: 25rpx;"></text>
				</view>
				<!-- 二级回复结束 -->
			</view>
			<view><text class="iconfont icon-ellipsis" @click="iconClik"></text></view>
		</view>


		<view class="tchuan">
			<u-popup :show="show" mode="bottom" @close="CancelClick">
				<view class="list" v-if="shanchu" @click.stop="deletClik">
					<text class="iconfont icon-a-123-cuowu"></text>
					<text>删除</text>
				</view>
				<view class="list" v-else @click.stop="reportClick">
					<text class="iconfont icon-a-4-shezhi"></text>
					<text>举报</text>
				</view>
				<view class="qx" @click.stop="CancelClick">取消</view>
			</u-popup>
		</view>

	</view>
</template>

<script>
	import {
		giveName,
		UserAvatar
	} from '../../utils/tool.js'
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'

	export default {
		name: "comment-item",
		props: {
			item: {
				type: Object,
				default: {}
			},
			index: {
				type: Number,
				default: null
			},
			// 展开评论参数
			UnfoldInfo: {
				type: Object,
				default: {}
			},

		},
		data() {
			return {
				show: false,
				// 展开评论的value
				unfoldVlaue: '展开' + this.item.twocmments.length + '条回复',

				replyContent: '',
				color: '#fff',
				// isUserData: this.UnfoldInfo?.CommentList??'', //当前一级评论的数据
				isUserName:this.item.user_id[0]._id, //获取当前评论的id
				// itemdata:this.item,
				isTwoUserName: this.item?.twocmments ?? '', //当前二级评论的数据
				AvatarUserId: this.UnfoldInfo?.AvatarUserId._id ?? '' //当前文章id
			};
		},
		computed: {
			userInfo() {
				return store.userInfo
			},

			//如果是当前用户发的评论，就显示删除，否则显示举报
			shanchu() {
				let id = this.item?.user_id[0]?._id ?? ''
				return id === this.userInfo._id
			},
			isUserTitleBool(){
				return this.isUserName === this.AvatarUserId
			}
		},
		methods: {
			giveName,
			UserAvatar,

			//  二级评论手按住view,颜色改变
			handTwoCommentStart() {
				this.color = '#f0f0f0'; // 改变视图的背景颜色
			},
			// 一级评论手离开view
			handleTouchEnd() {
				this.color = '#fff'; // 改变视图的背景颜色
			},
			//  一级评论手按住view,颜色改变
			handleTouchStart() {
				this.color = '#f0f0f0'; // 改变视图的背景颜色
			},
			//展开评论
			unfoldComment() {
				this.unfoldVlaue = '展开更多回复'
				this.$emit("unfoldComment-event", this.index)
			},
			//点击二级回复
			responses(index) {
				this.$emit("twoComment-event", {
					item: this.item,
					index,
				})
			},
			//点击评论回复
			hfcomment() {

				this.$emit("oneComment-event", this.item)
			},
			//点击评论左侧按钮
			iconClik() {
				this.show = !this.show
			},
			//取消
			CancelClick() {
				this.show = !this.show
			},
			//用户点击删除评论
			deletClik() {
				this.$emit("deletComment-event", {
					index: this.index,
					id: this.item._id
				})
				this.show = false
			},
			//举报
			reportClick() {
				uni.showToast({
					title: '举报成功'
				})
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.zzStyle{
		padding: 5rpx 10rpx;
		 background-color: #0199fe; 
		 font-size: 16rpx; 
		 color: #fff; border-radius: 5rpx;
		 margin-left: 5rpx;
	}
	.comment-item {
		border-bottom: 1px solid #f1f1f1;
		padding: 15rpx 0;
		display: flex;

		.wrap {
			flex: 1;
			padding-left: 20rpx;
			padding-bottom: 20rpx;

			.username {
				font-size: 26rpx;
				color: #aeaeae;
				padding: 10rpx 0;
			}

			.comment-content {
				font-size: 28rpx;
				color: #111;
				line-height: 1.8em;
			}

			.info {
				font-size: 26rpx;
				color: #aeaeae;
				display: flex;
				padding: 10rpx 0;
				align-items: center;

				view {
					margin-right: 15rpx;
				}

				.reply-btn {
					// padding: 6rpx 18rpx;
					// background: #e4e4e4;
					// border-radius: 30rpx;
					color: #7b7b7b;
					font-weight: 600;
				}
			}
		}
	}

	.tchuan {
		padding: 0 30rpx;

		.qx {
			// width: 100%;
			height: 80rpx;
			border-top: 5px solid #f6f7f9;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;

		}

		.list {
			height: 75rpx;
			border-top: 1px solid #f6f7f9;
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			font-size: 26rpx;

			.iconfont {
				color: #ec6f99;
				margin-right: 30rpx;
				font-size: 38rpx;
			}
		}
	}

	.commentFrame {
		width: 100%;
		background: #fff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
	}
</style>