<template>
	<view class="seif">
		<!-- 上面开始 -->
		<view class="sm" @click="login">
<!-- 			<view class="img" style="background-image: url('../../static/images/user-default.jpg"></view> -->
			<image src="/static/images/user-default.jpg" alt="" class="img">
			
			<!-- 左边开始-->
			<view class="yh">
				<!-- 头像 -->
				<view class="tx"><u-avatar src='/static/images/user-default.jpg' shape="circle" size="60"></u-avatar>
				</view>
				<!-- 用户信息 -->
				<view class="yhxx">
					<text class="name">匿名</text>
					<view class="sf">
						<text>6分钟前注册</text>
					</view>
				</view>
			</view>
			<!-- 左边结束 -->
			<!-- 右边开始 -->
			<view class="yb">
				<text class="iconfont icon-a-10-you"></text>
			</view>
			<!-- 右边结束 -->
		</view>
		<!-- 上面结束 -->
		<!-- <button type="default" @click="login">登录</button> -->
		<view class="xm">
			<!-- <button @click="login">登录</button> -->
			<!-- 获取用户点赞和评论的数量开始 -->
			<view class="hzang">
				<view>
					<text>33</text>
					<text>获赞</text>
				</view>
				<view>
					<text>11</text>
					<text>评论</text>
				</view>
				<view>
					<text>5</text>
					<text>长文</text>
				</view>
			</view>
			<!-- 获取用户点赞和评论的数量结束 -->
<!-- 			<view class="jh"><text class="iconfont icon-add-select"></text></view> -->
			<!-- 用户评论点赞的各种详情信息开始 -->
			<view class="Information">
				<view class="wenz">
					<view class="cw">
						<text class="iconfont icon-a-24-bianji"></text>
						<text>我的长文</text>
					</view>
					<view><text class="iconfont icon-a-10-you"></text></view>
				</view>
				
				<view class="wenz">
					<view class="cw">
						<text class="iconfont icon-a-106-xihuan"></text>
						<text>我的点赞</text>
					</view>
					<view><text class="iconfont icon-a-10-you"></text></view>
				</view>
				<view class="wenz">
					<view class="cw">
						<text class="iconfont icon-a-21-xiugai"></text>
						<text>评论过的</text>
					</view>
					<view><text class="iconfont icon-a-10-you"></text></view>
				</view>
				<!-- 下划线 -->
				<view class="borderBut"></view>
				
				<view class="wenz">
					<view class="cw">
						<text class="iconfont icon-a-32-wenjian"></text>
						<text>关于</text>
					</view>
					<view><text class="iconfont icon-a-10-you"></text></view>
				</view>
				<view class="wenz">
					<view class="cw">
						<text class="iconfont icon-a-5-xinxi"></text>
						<text>意见反馈</text>
					</view>
					<view><text class="iconfont icon-a-10-you"></text></view>
				</view>
				<!-- 下划线 -->
				<view class="borderBut"></view>
				
				<view class="wenz">
					<view class="cw">
						<text class="iconfont icon-a-73-tuichu"></text>
						<text>退出登录</text>
					</view>
					<view><text class="iconfont icon-a-10-you"></text></view>
				</view>
				
			</view>
			<!-- 用户评论点赞的各种详情信息结束 -->
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			//登录
			login() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withpwd',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	*{
		padding: 0;
		margin: 0;
	}
	.uni-page-head{
		display: none;
	}
	.seif {
		// padding: 0 30rpx;
     
		// 最上面开始
		.sm {
			color: #f0fdff;
			 position: relative;
			//减去状态栏的空间
			//  padding-top: var(--status-bar-height);
			  display: flex;
			  justify-content: space-between;
			  height: 300rpx;
			  width: 100%;
			  overflow: hidden;
			 
			  // transform: scale(1.2);
			
			  .img{
				  position: absolute;
				  top: 0;
				  left: 0;
				  width: 100%;
				  height: 100%;
				   //图片放大2.5倍
                   transform: scale(2);
				   filter: blur(25px); /* 添加高斯模糊效果，可根据需要调整模糊程度 */
				   //半透明
				   opacity: 0.5;
			  }
			  
			// 左边开始
			.yh {
				left: 30rpx;
				position: relative;
				  z-index: 1; /* 确保文字等元素在背景图片上面 */
				display: flex;
				margin: 30rpx 0;

				.tx {
					margin: auto 0;
					/* 上下居中 */
				}

				.yhxx {
					margin: auto 0;
					margin-left: 11rpx;

					.name {
						font-size: 44rpx;
						font-weight: 600;
						// color: ;
					}

					.sf {
						font-size: 26rpx;
						opacity: 0.7;
						
						
					}
				}
			}
			// 左边结束
			//右边开始
			.yb{
				position: relative;
				  z-index: 2; /* 确保文字等元素在背景图片上面 */
				 margin: auto 0;
				background-color: transparent;
				width: 50rpx;
				// width: 100px;
				 height: 50rpx;
				 right: 30rpx;
			}
			//右边结束
		}
		
		// 下面开始  "C:\Program Files (x86)\Tencent\微信web开发者工具\微信开发者工具.exe"  "C:\Program Files (x86)\Tencent\微信web开发者工具\code\package.nw\node_modules\node-float-pigment-css"
		.xm{ 
			position: absolute;
			top: 290rpx;
			 left: 0;
			width: 100%;
			height: calc(100% - 280rpx);
			 background-color: #fff;
			z-index: 10;
			border-radius: 40rpx 40rpx 0 0;
			//用户点赞数量和评论数量开始
			.hzang{
				display: flex;
				flex: 1;
				height: 90rpx;
				font-size: 30rpx;
				padding: 0 30rpx;
				view{
					margin: auto 0;
					padding-left: 20rpx;
					color: #888;
					text:first-of-type{
						color: #333;
						font-weight: 600;
					}
				}
			}
			// 用户点赞数量和评论数量结束
			// 加号开始
			.jh{
				color: red;
			}
			// 加号结束
			
			.Information{
				padding: 0 30rpx;
				.wenz{
					margin: 26rpx 0;
					view:nth-of-type(2){
						.iconfont{
							font-size: 26rpx;
						}
					}
				}
				view{
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 36rpx;
					color: #7a7a7a;
					.cw{
						.iconfont{
							font-size: 38rpx;
							margin-right: 15rpx;
						}
					}
					
				}
			}
			
			
		}
		//下面结束
		
		.borderBut{
			border-bottom: 15rpx solid #f4f4f4;
		}
	}
</style>