var express = require('express');
var router = express.Router();
const mongo = require("mongodb-curd")
let bataDataName = "lemon" //数据库
let icon = "icon" //icon图表
let users = "user" //用户登录
let mainbill = "bill" //总的图表
let minbill = "class" //样式.支出.收入图表
    /* GET home page. */
router.post('/api/user', function(req, res, next) { //用户名登陆的接口
    let obj = req.body
    mongo.find(bataDataName, users, { "name": obj.name, "pwd": obj.pwd }, function(result) {
        if (!result.length) {
            res.json({ code: 0, msg: "error" })
        } else {
            res.json({ code: 1, msg: "找到了", data: result })
        }
    })
});
router.post("/api/bill", function(req, res, next) { //查询账单
    let page = req.body.page //页数
    let pageSize = req.body.pageSize //条数
    mongo.find(bataDataName, mainbill, { "uid": req.body.uid }, function(result) {
        if (!result.length) {
            res.json({ code: 0, msg: "查询失败" })
        } else {
            res.json({ code: 1, msg: "查询成功", data: result })
        }
    }, {
        skip: (page - 1) * pageSize,
        limit: pageSize,
		sort:{
			// "money":-1
			"_id":-1
		}
    })
})
router.post("/api/refer", function(req, res, next) { //查询个人支出收入的账单
    mongo.find(bataDataName, mainbill, { "uid": req.body.uid,"income":req.body.income }, function(result) {
        if (!result.length) {
            res.json({ code: 0, msg: "查询失败" })
        } else {
            res.json({ code: 1, msg: "查询成功", data: result })
        }
    })
})
router.post("/api/delete", function(req, res, next) { //删除个人的账单
    mongo.remove(bataDataName, mainbill, { "_id": req.body.id }, function(result) {
		console.log(result)
        if (result.deletedCount === 0) {
            res.json({ code: 0, msg: "删除失败" })
        } else {
            res.json({ code: 1, msg: "删除成功", data: result })
        }
    })
})
router.post("/api/addation",function(req,res,next){//添加个人账单
	let obj = req.body
	mongo.insert(bataDataName,mainbill,{"uid":obj.uid,"icon":obj.icon,"type":obj.type,"timer":obj.timer,"money":obj.money,"income":obj.income},function(result){
		if(!result){
			res.json({code:0,msg:"添加失败"})
		}else{
			res.json({code:1,msg:"添加成功",data:result})
		}
	})
})
router.post("/api/increase",function(req,res,next){//添加icon
	mongo.find(bataDataName,icon,function(result){
		if(!result.length){
			res.json({code:0,msg:"查询失败"})
		}else{
			res.json({code:1,msg:"查询成功",data:result})
		}
	})
})
router.post("/api/edit", function(req, res, next) { //修改个人的账单
    let obj = req.body;
    mongo.update(bataDataName, mainbill, [{ "_id": obj.id }, obj], function(result) {
        if (!result) {
            res.json({ code: 0, msg: "修改失败" })
        } else {
            res.json({ code: 1, msg: "修改成功", data: result })
        }
    })
})
module.exports = router;