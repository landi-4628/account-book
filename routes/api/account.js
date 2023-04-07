var express = require('express');
const jwt = require('jsonwebtoken')

var router = express.Router();

//导入 moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');


let checkTokenMiddleWare = (req, res, next) => {
  // 获取请求头里的token
  let token = req.get('token')
  if (!token) {
    return res.json({
      code: '2003',
      msg: 'token缺失',
      data: null
    })
  }
  jwt.verify(token, 'landiIF', (err, data) => {
    if (err) {
      return res.json({
        code: '2004',
        msg: '校验失败',
        data: null
      })
    }
    // 储存用户信息
    req.user=data
  })
  next()
}
//测试
// console.log(moment('2023-02-24').toDate())
//格式化日期对象
// console.log(moment(new Date()).format('YYYY-MM-DD'));

//记账本的列表
router.get('/account',checkTokenMiddleWare, function (req, res, next) {
  //获取所有的账单信息
  // let accounts = db.get('accounts').value();
  //读取集合信息
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.json({
        code: "1001",
        msg: "读取失败",
        data: null

      })
      return;
    }
    //响应成功的提示
    res.json({
      code: '0000',
      msg: '读取成功',
      data: data
    })
  })
});


//新增记录
router.post('/account',checkTokenMiddleWare, (req, res) => {
  //插入数据库
  AccountModel.create({
    ...req.body,
    //修改 time 属性的值
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if (err) {
      res.json({
        code: '1002',
        msg: '插入失败',
        data: null
      })
      return
    }
    //成功提醒
    res.json({
      code: '0000',
      msg: '添加成功',
      data: data
    })
  })
});

//删除记录
router.delete('/account/:id',checkTokenMiddleWare, (req, res) => {
  //获取 params 的 id 参数
  let id = req.params.id;
  //删除
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.json({
        code: '1003',
        msg: '删除失败',
        data: null
      })
      return;
    }
    //提醒
    res.json({
      code: '0000',
      msg: '删除成功',
      data: data
    })
  })
});


// 获取单条数据
router.get('/account/:id',checkTokenMiddleWare, (req, res) => {
  let { id } = req.params
  console.log(id);
  AccountModel.findById(id, (err, data) => {
    if (err) {
      res.json({
        code: "1004",
        msg: "获取失败",
        data: null
      })
      return
    }
    res.json({
      code: '0000',
      msg: '添加成功',
      data: data
    })
  })
})

// 更新列表信息
router.patch('/account/:id',checkTokenMiddleWare, (req, res) => {
  let { id } = req.params
  AccountModel.updateOne({ _id: id }, req.body, (err, data) => {
    if (err) {
      res.json({
        code: "1005",
        msg: "更新失败",
        data: null
      })
      return
    }
    AccountModel.findById(id, (err, data) => {
      res.json({
        code: '0000',
        msg: '更新成功',
        data: data
      })
    })

  })
})


module.exports = router;
