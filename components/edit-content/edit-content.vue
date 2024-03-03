<template>
	<view>
		<!-- 头部开始 -->
		 <view class="title">
			 <input type="text" placeholder="请输入完整标题" v-model="artObj.title" placeholder-class="placeholderClass">
		 </view>
		<!-- 编辑器的样式开始 -->
		<view class="tools" v-if="toolshow">
			<view class="item" @click="clickHead"><text class="iconfont icon-zitibiaoti"
					:class="dtysClass ? 'active': ''"></text></view>
			<view class="item" @click="clickBold"><text class="iconfont icon-zitijiacu"
					:class="jcClass ? 'active': ''"></text></view>
			<view class="item" @click="clickItalic"><text class="iconfont icon-zitixieti"
					:class="italicClass ? 'active': ''"></text></view>
			<view class="item" @click="clickDivider"><text class="iconfont icon-fengexian"></text></view>
			<view class="item" @click="clickInsertImage"><text class="iconfont icon-charutupian"></text></view>
			<view class="item" @click="editOk"><text class="iconfont icon-duigou_kuai"></text></view>
		</view>
		<!-- 编辑器的样式结束 -->
		<!-- 中间输入文章内容开始 -->
		<view class="content">
			<editor class="myEdit" placeholder="写点什么吧~~" @ready="onEditReady" @focus="onFocus"
				@statuschange="statuschange" :show-img-size="true" :show-img-toolbar="true">

			</editor>
		</view>
		<!-- 中间输入文章内容结束 -->

		<view class="btnGroup">
			<u-button type="primary" text="确定发布" :disabled="!artObj.title.length" @click="onSubmit"></u-button>
		</view>
	</view>

</template>

<script>
import { data } from '../../uni_modules/uview-ui/libs/mixin/mixin';
	const db = uniCloud.database()
	export default {
		name: "edit-content",
		props: {
			id: {
				type: String,
				default: undefined
			}
		},
		data() {
			return {
				toolshow: false,
				// 动态添加标题颜色
				dtysClass: false,
				//动态添加加粗的颜色
				jcClass: false,
				////动态添加斜体的颜色
				italicClass: false,
				//存标题和主体文字内容
				artObj: {
					//头部
					title: '',
					//主体文字
					content: '',
					//更新的时间
                    publish_date: Date.now()
				},

			};
		},

		// onLoad() {
		//           this.onEditReady()
		// },
		watch: {
			id: {
				handler: function(newVal, oldVal) {
					// console.log('watch已经触发');
					this.getArticle()

				},

				immediate: true
			}
		},

		methods: {

			// but(){
			// 	this.artObj.content = 'uniapp是世界最垃圾的框架'
			// },
			// 发送网络请求
			//获取需要修改的文章
			getArticle() {
				if (!this.id) return
				db.collection("quanzi_article").where(`_id=="${this.id}"`).get().then(res => {
					this.artObj.title = res?.result?.data[0]?.title ??''
					this.artObj.content = res?.result?.data[0]?.content ?? ''
					// this.$emit('edit-conter', this.artObj.title)
					// 初始化富文本对象开始
					this.onEditReady()
					// 初始化富文本对象结束
					// console.log(res)

				})
			},


			//提交
			onSubmit() {
				console.log(this.artObj.publish_date)
				this.editorCtx.getContents({
					success: async res => {
						this.artObj = {...this.artObj,...res}
						this.$emit('edit-conter', this.artObj)
					}
				})

			},

			//初始化
			onEditReady() {
				uni.createSelectorQuery().in(this).select('.myEdit').fields({
					size: true,
					context: true
				}, res => {
					// this.editorCtx 不需要在data上定义
					this.editorCtx = res.context
					this.editorCtx.setContents({
						html: this.artObj.content,
						success: res => {
							// console.log('富文本内容设置成功');
							// console.log(res.errMsg)
						},
						fail: (err) => {
							// console.error('富文本内容设置失败: ', err);
						}
					})
				}).exec()
			},


			//根据传入styleBole（样式高亮就是为true）editStyle（富文本当前添加什么样式）
			pdStyle(styleBole, editStyle) {
				if (styleBole) {
					this.editorCtx.format(editStyle, true)
				} else {
					this.editorCtx.format(editStyle, false)
				}
			},
			//添加分割线
			clickDivider() {
				this.editorCtx.insertDivider()
			},

			//添加标题
			clickHead() {
				this.dtysClass = !this.dtysClass

				this.editorCtx.format("header", this.dtysClass ? 'H2' : false)
			},
			//添加字体加粗
			clickBold() {

				this.jcClass = !this.jcClass
				console.log(this.jcClass)
				this.pdStyle(this.jcClass, 'bold')

			},
			//添加字体为斜体
			clickItalic() {
				this.italicClass = !this.italicClass
				this.pdStyle(this.italicClass, 'italic')
			},

			//添加图片
			clickInsertImage() {
				//打开本地相册
				uni.chooseImage({
					//成功选择图片之后
					success: async res => {
						//上传中出现等待loading，mask是用户界面无法操作
						uni.showLoading({
							title: "上传中请稍后",
							mask: true
						})
						// console.log(res)
						//将每一张图片循环出来
						for (let item of res.tempFiles) {
							//安卓图片取出文件名开始
							const str = item.path
							const lastSlashIndex = str.lastIndexOf('/');
							const newStr = str.substr(lastSlashIndex + 1);
							// console.log(newStr)
							//安卓图片取出文件名结束
							//网络请求进行上传，filePath是本地图片的路径
							//cloudPath：图片以什么名字保存到服务器上
							//await是为了当第一张图片上传完成，才去上传第二张
							// #ifdef H5
							let res = await uniCloud.uploadFile({
								filePath: item.path,
								cloudPath: item.name
							})
							// #endif
							//该代码仅在app中生效
							// #ifdef APP-PLUS
							let res = await uniCloud.uploadFile({
								filePath: item.path,
								cloudPath: newStr
							})
							// #endif


							//在编辑器上显示图片
							this.editorCtx.insertImage({
								src: res.fileID
							})
						}
						//上传成功取消loading
						uni.hideLoading()
					}
				})
			},

			//点击打勾确定
			editOk() {
				this.toolshow = false
			},
			//获取焦点
			onFocus() {
				this.toolshow = true
			},


			//通过Contxte 方法改变编辑器内的样式时触发
			statuschange(e) {
				console.log(e)
				var detail = e.detail
				this.dtysClass = e.detail.header ? true : false
				this.jcClass = e.detail.bold ? true : false
				this.italicClass = e.detail.italic ? true : false
			},
		}
	}
</script>

<style lang="scss">
	//修改编辑器内容的提示
	/deep/ .ql-editor::before {
		font-style: normal !important;
		color: #e0e0e0 !important;

	}

	// 中间输入文章内容开始
	.content {
		.myEdit {
			height: calc(100vh - 500rpx);
			margin-bottom: 30rpx;
		}
	}

	// <!-- 编辑器的样式开始 -->
	.tools {
		width: 100%;
		height: 100rpx;
		background: #fff;
		border-top: 1rpx solid #f4f4f4;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.iconfont {
			font-size: 36rpx;
			color: #333;

			&.active {
				color: #0199FE;
			}

		}
	}
	// 标题开始
	.title{
			  input{
				  height: 120rpx;
				  font-size: 46rpx;
				  border-bottom: 1px solid #e4e4e4;
				  margin-bottom: 30rpx;
				  color: #000;
			  }
			  .placeholderClass{
				  color: #e0e0e0;
			  }
	}
</style>