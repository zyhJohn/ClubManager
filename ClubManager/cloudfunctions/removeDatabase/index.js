// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
//c传入参数：表名称，要修改的记录id号，要修改的数据（json格式）
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection(event.name).doc(event.id).remove()
}