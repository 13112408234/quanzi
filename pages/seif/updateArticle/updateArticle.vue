<template>
	<view class="edit">
       <edit-content  @edit-conter = "onSubmit"  :id="id"></edit-content>
	</view>
</template>
<script>
	import {
		getImigSrc,
		getProvince
	} from '@/utils/tool.js'
	// 关联数据库
	const db = uniCloud.database()
	export default {
		data() {
			return {
				id:''
			};
		},

		onLoad(e) {
			//接收传过来的文章id值
			this.id = e.id
		},
		methods: {
			//提交
			onSubmit(res) {
				//上传中出现等待loading，mask是用户界面无法操作
				uni.showLoading({
					title: "上传中请稍后",
					mask:true
				})
				console.log(res)
                db.collection("quanzi_article").where(`_id=="${this.id}" && user_id==$cloudEnv_uid`).update({
					title:res.title, //更新文章标题
					content:res.html, //更新文章内容
					description:res.text.slice(0, 100),
					publish_date:res.publish_date //更新时间
				}).then(res=>{
					
					uni.hideLoading()
					uni.showToast({
						title: "发布成功"
					})
					uni.reLaunch({
						url: "/pages/index/index"  //关闭所有页面，跳转到首页
					})
					console.log(res)
				})
			},

			getsumit_add() {
				db.collection('quanzi_article').add({
					...this.artObj
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: "发布成功"
					})
					setTimeout(() => {
						// 关闭所有页面，然后再打开某一个页面
						uni.reLaunch({
							url: "/pages/index/index"
						})
					}, 800)
				}).catch(err => {
					console.log(err)
				})
			},
		},
	}
</script>
<style lang="scss">
	.edit {
		padding: 30rpx;
		// 标题开始
		.title {
			input {
				height: 120rpx;
				font-size: 46rpx;
				border-bottom: 1px solid #e4e4e4;
				margin-bottom: 30rpx;
				color: #000;
			}
			.placeholderClass {
				color: #e0e0e0;
			}
		}
	}
</style>