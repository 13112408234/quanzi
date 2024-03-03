<template>
	<view class="edit">
		<edit-content @edit-conter="onSubmit"></edit-content>
	</view>
</template>
<script>
	import {getImigSrc,getProvince} from '@/utils/tool.js'
	// 关联数据库
	const db = uniCloud.database()
	export default {
		data() {
			return {
				artObj: {
					//头部
					title: '',
					//主体文字
					content: '',
					//摘要
					description: '',
					//图片
					picurls: "",
					//省份
					province: ''
				}
			};
		},
		onLoad() {
		},
		methods: {
			async onSubmit(res) {
				//文章标题
				this.artObj.title = res.title
				//保存摘要信息
				this.artObj.description = res.text.slice(0, 100)
				this.artObj.content = res.html
				console.log("获取摘要")
				//获取所有的图片地址
				this.artObj.picurls = getImigSrc(res.html)
				console.log("获取图片")
				//获取省份
				//获取用户ip省份
				await getProvince().then(res => {
					console.log("用户ip省份")
					this.artObj.province = res
				})
				console.log("发起网络添加")
				await this.getsumit_add()
				console.log(this.artObj)
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
		padding: 0 30rpx;
	}
</style>