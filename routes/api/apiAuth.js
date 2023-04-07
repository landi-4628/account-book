var express = require('express');
const userModel = require('../../models/userModel');
const md5 = require('md5');
const jwt = require('jsonwebtoken')

const { token } = require('morgan');


var router = express.Router();


router.post('/login', (req, res) => {
    userModel.find({ usename: req.body.usename, password: md5(req.body.password) }, (err, data) => {
        if (err) {
            res.json({
                code: '2001',
                msg: '数据读取失败',
                data: null
            })
            return
        }
        if (data.length === 0) {
            return res.json({
                code: '2002',
                msg: '账号或密码错误',
                data: null
            })
        }
        let token = jwt.sign({
            usename: req.body.usename,
            password: req.body.password
        }, 'landiIF', {
            expiresIn: 60 * 60 * 24 * 7
        })
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('success', { msg: '退出成功', url: '/login' })
    })
})

module.exports = router;
