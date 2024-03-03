<template>
	<view>
		<u-loading-icon timing-function="linear" text="加载中":show="loading"></u-loading-icon>
		<view class="bott"><u-divider v-if="!loading" text="我也是有底线的" ></u-divider></view>
	</view>
</template>

<script>
	export default {
		name:"loading",
		props:{
			loading:{
				// type:Boolean,
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
   .bott{
	  // position: absolute;
	  //  // left: 0;
	  //  bottom: 0;
   }
</style>