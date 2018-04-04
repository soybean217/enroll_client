global.ACTIVITYINFO = {};
global.CONFIG = {
  HEAD_ICON_REAL_RESOLUTION: '132',
  HEAD_ICON_DISPLAY_RESOLUTION: '50',
}
global.currentTabbar = 0
global.getUrlParam = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

global.formatDate = function(activityDateTime) {
  if (activityDateTime instanceof Date) {
    return activityDateTime.getFullYear() + '年' + (activityDateTime.getMonth() + 1) + '月' + activityDateTime.getDate() + '日' + activityDateTime.getHours() + '点' + activityDateTime.getMinutes() + '分'
  } else {
    tmpDate = new Date(activityDateTime)
    return tmpDate.getFullYear() + '年' + (tmpDate.getMonth() + 1) + '月' + tmpDate.getDate() + '日' + tmpDate.getHours() + '点' + tmpDate.getMinutes() + '分'
  }
}

global.formatDateToDay = function(activityDateTime) {
  if (activityDateTime instanceof Date) {
    return activityDateTime.getFullYear().toString().substr(2) + '年' + (activityDateTime.getMonth() + 1) + '月' + activityDateTime.getDate() + '日'
  } else {
    tmpDate = new Date(activityDateTime)
    return tmpDate.getFullYear().toString().substr(2) + '年' + (tmpDate.getMonth() + 1) + '月' + tmpDate.getDate() + '日'
  }
}
global.formatDateToDayAndWeek = function(activityDateTime) {
  if (activityDateTime instanceof Date) {
    return activityDateTime.getFullYear().toString() + '年' + (activityDateTime.getMonth() + 1) + '月' + activityDateTime.getDate() + '日' + xingqi(activityDateTime.getDay())
  } else {
    tmpDate = new Date(activityDateTime)
    return tmpDate.getFullYear().toString() + '年' + (tmpDate.getMonth() + 1) + '月' + tmpDate.getDate() + '日' + xingqi(tmpDate.getDay())
  }
}
global.formatTimeDuring = function(activity) {
  var activityBeginDate = new Date(activity.activityDateTime)
  var activityEndDate = new Date(activityBeginDate.getTime() + 1000 * 3600 * activity.spendHours)
  return activityBeginDate.getHours() + ':' + fillZeroForMinute(activityBeginDate.getMinutes()) + '-' + activityEndDate.getHours() + ':' + fillZeroForMinute(activityEndDate.getMinutes())
}

function fillZeroForMinute(input) {
  if (input.toString().length == 1) {
    return '0' + input
  } else {
    return input
  }
}

function xingqi(intDay) {
  var b
  switch (intDay) {
    case 0:
      b = "星期日";
      break;
    case 1:
      b = "星期一";
      break;
    case 2:
      b = "星期二";
      break;
    case 3:
      b = "星期三";
      break;
    case 4:
      b = "星期四";
      break;
    case 5:
      b = "星期五";
      break;
    case 6:
      b = "星期六";
      break;
    default:
      b = "系统错误，无法读取日期！";
  }
  return b
}

global.updateUrl = function(url, key) {
  var key = (key || 't') + '='; //默认是"t"
  var reg = new RegExp(key + '\\d+'); //正则：t=1472286066028
  var timestamp = +new Date();
  if (url.indexOf(key) > -1) { //有时间戳，直接更新
    return url.replace(reg, key + timestamp);
  } else { //没有时间戳，加上时间戳
    var urlArr = url.split('\?');
    if (url.indexOf('\?') > -1) {
      if (urlArr[1]) {
        if (urlArr[2]) {
          return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1] + '?' + urlArr[2];
        } else {
          return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1];
        }
      } else {
        return urlArr[0] + '?' + key + timestamp;
      }
    } else {
      if (url.indexOf('#') > -1) {
        return url.split('#')[0] + '?' + key + timestamp + location.hash;
      } else {
        return url + '?' + key + timestamp;
      }
    }
  }
}
