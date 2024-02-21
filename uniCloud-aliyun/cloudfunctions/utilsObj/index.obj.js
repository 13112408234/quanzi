const { table } = require("console");

const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function () { // 通用预处理器

	},
    
	/**
	 * @description: 自定义增减 
	 * @param {*} table  数据表
	 * @param {*} attr   属性
	 * @param {*} id     
	 * @param {*} num    1自增   -1自减
	 * @return
	 */
	  async operation(table,attr,id,num){
		let obj = {}
		obj[attr]=dbCmd.inc(num);
		return await db.collection(table).doc(id).update(obj)
	}
	
}
