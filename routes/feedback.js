'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var BusinessFeedback = AV.Object.extend('BusinessFeedback');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  var query = new AV.Query(BusinessFeedback);
  query.descending('createdAt');
  query.find().then(function(results) {
    console.log(results)
    res.render('feedback', {
      title: '意向代理商列表',
      feedbacks: results
    });
  }, function(err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('feedback', {
        title: '意向代理商列表',
        todos: []
      });
    } else {
      next(err);
    }
  }).catch(next);
});

module.exports = router;
