var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
	sendBusnissFeedback('15158898469', {phoneNum: '15158898469', userName: '悦瑞英', company: '典丰科技', city: '杭州'}).then(function (ok) {
	  console.log(ok)
	}, function (err) {
	  console.error(err)
	})
  	return 'Hello world!';
});

AV.Cloud.afterSave('BusinessFeedback', function(request) {
	var username request.object.get('userName')
	var phoneNum request.object.get('phoneNum')
	var company request.object.get('company')
	var city request.object.get('city')
	console.log(username,phoneNum,company,city)
});


const crypto = require('crypto')
const rp = require('request-promise')
const accountSid = "8a216da857511049015774861894153f"
const authToken = "e1de26cde6e24dd28dfedcd81467d1f0"
const appId = "8a216da85da6adf7015de9addca8199f"

const sms206141 = "206988"

var url = "https://app.cloopen.com:8883/2013-12-26/Accounts/{accountSid}/SMS/TemplateSMS?sig={SigParameter}"

function sign(timestamp) {
  return md5(accountSid + authToken + timestamp).toUpperCase()
}

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex')
}

function getTimestamp() {
  var date = new Date()

  var month = (date.getMonth() + 1)

  if (month < 10) {
    month = "0" + month
  }

  var _date = date.getDate()

  if (_date < 10) {
    _date = "0" + _date
  }

  var hours = date.getHours()

  if (hours < 10) {
    hours = "0" + hours
  }

  var minutes = date.getMinutes()

  if (minutes < 10) {
    minutes = "0" + minutes
  }

  var seconds = date.getSeconds()

  if (seconds < 10) {
    seconds = "0" + seconds
  }

  return date.getFullYear() + "" + month + "" + _date + "" + hours + "" + minutes + "" + seconds
}


var sms206141PayloadTpl = `
<?xml version='1.0' encoding='utf-8'?> 
<TemplateSMS>
  <to>{toPhone}</to>
  <appId>{appId}</appId> 
  <templateId>{templateId}</templateId>
  <datas>
    <data>{phoneNum}</data>
    <data>{userName}</data>
    <data>{company}</data>
    <data>{city}</data>
    <data>{url}</data>
  </datas>
</TemplateSMS>
`
//     <data>{city}</data>
function sendBusnissFeedback (toPhone, data) {
  var timestamp = getTimestamp()
  return rp({
    method: 'POST',
    uri: url.replace('{accountSid}', accountSid).replace('{SigParameter}', sign(timestamp)),
    headers: {
      'Authorization': new Buffer(accountSid + ':' + timestamp).toString("base64"),
      'Content-Type': 'application/xml;charset=utf-8',
      'Accept': 'application/json'
    },
    body: sms206141PayloadTpl
          .replace('{toPhone}', toPhone)
          .replace('{appId}', appId)
          .replace('{templateId}', sms206141)
          .replace('{phoneNum}', data.phoneNum || '未知')
          .replace('{userName}', data.userName || '未知')
          .replace('{company}', data.company || '未知')
          .replace('{city}', data.city || '未知')
          .replace('{url}', 'http://yingtaohuoappot.leanapp.cn/feedbacks')
  })
}

