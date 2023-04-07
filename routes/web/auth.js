var express = require('express');
const userModel = require('../../models/userModel');
const md5 = require('md5');

var router = express.Router();

router.get('/reg', (req, res) => {
    res.render('reg')
})

router.post('/reg', (req, res) => {
    // console.log(...req.body);
    userModel.create({
        ...req.body,
        password: md5(req.body.password)
    }, (err, data) => {
        if (err) {
            res.status(500).send('注册失败~~');
            return
        }
        //成功提醒
        res.render('success', { msg: '注册成功哦~~~', url: '/login' });
    })
    // res.send('测试')

})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    userModel.find({ usename: req.body.usename, password: md5(req.body.password) }, (err, data) => {
        if (err) {
            res.status(500).send('登录失败，请稍后在试')
            return
        }
        if (data.length === 0) {
            return res.render('success', { msg: '登录失败', url: '/login' })
        }
        req.session.usename = req.body.usename
        res.render('success', { msg: '登录成功', url: '/account' })
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.render('success', { msg: '退出成功', url: '/login' })
    })
})

module.exports = router;
