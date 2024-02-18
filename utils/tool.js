//获取数据中img标签中src属性值，也就是图片地址
export function getImigSrc(richtext) {

	// 使用正则表达式匹配所有img标签中的src属性
	const imgSrcRegex = /<img.*?src="(.*?)"/g;
	const imgSrcArray = [];
	let match;

	while ((match = imgSrcRegex.exec(richtext)) !== null) {
		imgSrcArray.push(match[1]);
	}

	return imgSrcArray;

}


//获取用户ip地址省份网络分装
export function getProvince() {
	return new Promise((resolve, reject) => {
		//获取本地是否存储ip省份
		let historyProvince = uni.getStorageSync("historyProvince")
		if (historyProvince) {
			
			//如果缓存的数据超过1个小时，则重新发送网络请求，1000代表1秒
			//1000*60代表1分钟，1000*60*60代表1小时
			if((Date.now() - historyProvince.time) > 1000*60*60){
				console.log("本地数据过期，重新发起请求")
				 getIp().then(res =>{
				 	resolve(res)
				 }).catch(err =>{
				 	reject(err)
				 })
			}else{
				console.log("获取本地缓存数据")
				 resolve(historyProvince.province)
			}
          
		} else {
		    getIp().then(res =>{
				resolve(res)
			}).catch(err =>{
				reject(err)
			})
		}

	})

}


//获取所在地的ip省市
function getIp () {
	return new Promise((resolve,reject)=>{
		 uni.request({
		 	url: 'https://restapi.amap.com/v3/ip?key=f933d229d45d16fb9f6c5e9aa83f7527',
		 	success: res => {
		 		console.log("这是网络请求")
		 		resolve(res.data.province)
		 		let obj = {
		 			province: res.data.province,
		 			time: Date.now()
		 		}
		 		//存储到本地
		 		uni.setStorageSync("historyProvince", obj)
		 	},
		 	fail: err => {
		 		reject(err)
		 	}
		 })
	})
}
