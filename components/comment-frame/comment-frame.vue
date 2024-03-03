<template>
	<view>
		<view class="commentFrame">
			<uni-easyinput ref="uipt" @confirm="goComment" suffixIcon="paperplane" v-model="replyContent"
				:placeholder="commentFrame.placeholder" @iconClick="goComment" :focus="commentFrame.focus">
			</uni-easyinput>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database() //链接数据库
	import {
		getImigSrc,
		getProvince
	} from '@/utils/tool.js'
	//引入utilsObj云对象
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true
	})
	import {giveName} from '@/utils/tool.js'
	export default {
		name: "comment-frame",
		props: {
			commentObj: {
				type: Object,
				default: {}
			},
			//点击一级评论的数据
			OneComment:{
				type:Object,
				default:{}
			},
			commentFrame:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				replyContent: ''
			};
		},
		computed:{
			
		},

		methods: {
			giveName,
			async goComment() {
				if(! this.replyContent) return
				let province = await getProvince()
				db.collection("quanzi-comment").add({
					"comment_content": this.replyContent,
					"province": province,
					...this.commentObj
				}).then(res => {
					uni.showToast({
						title:'评论成功',
						icon:'none'
					})
					this.$emit("comment-event", {
						_id: res.result.id,
						comment_content: this.replyContent,
						province: province,
						...this.commentObj,
						comment_date:Date.now()
					})
					this.replyContent = ''
					console.log(res);
					//评论数加一
					utilsObj.operation("quanzi_article","comment_count",this.commentObj.article_id,1)
					
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
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