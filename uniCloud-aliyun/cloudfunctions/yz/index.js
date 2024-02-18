'use strict';
exports.main = async (event, context) => {
	// 云函数删除文件示例代码
	let result = await uniCloud.deleteFile({
	    fileList: [
	        "https://mp-dffe5a9f-999c-42eb-8328-7d1d98864d16.cdn.bspapp.com/cloudstorage/59f1417a-e4d7-476c-b1a9-3bf083a59a79.png" 
	    ]
	});
	//返回数据给客户端
	
	
	return result
};
