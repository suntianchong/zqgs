/**
 * 封装时间转换  yyyy-MM-dd hh:mm:ss
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 各位数字加0
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 获取当前时间 格式 yyyy-MM-dd
 */
const getNowDay = date => {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  //  如果需要时分秒，就放开
  // var h = now.getHours();
  // var m = now.getMinutes();
  // var s = now.getSeconds();
  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
}

const getNowDayPlusYear = date => {
  var now = new Date();
  var year = now.getFullYear()+1;
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  //  如果需要时分秒，就放开
  // var h = now.getHours();
  // var m = now.getMinutes();
  // var s = now.getSeconds();
  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
}
/**
 * 获取当前时间 格式 yyyy-MM-dd 00:00:00
 */
const getNowTime = date => {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  //  如果需要时分秒，就放开
  // var h = now.getHours();
  // var m = now.getMinutes();
  // var s = now.getSeconds();
  var formatDate = year + '-' + month + '-' + day + " 00:00:00";
  return formatDate;
}
/**
 * 获取下一天时间   格式yyyy-MM-dd hh:mm:ss
 */
const getNextTime = date => {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate() + 1;
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  //  如果需要时分秒，就放开
  // var h = now.getHours();
  // var m = now.getMinutes();
  // var s = now.getSeconds();
  var formatDate = year + '-' + month + '-' + day + " 00:00:00";
  return formatDate;
}

const getFormatDate = date =>{
  var formatDate = "";
  var dateArray = [];
  dateArray = date.split("-");
  if (dateArray.length == 3){
    formatDate = dateArray[0] + "年" + dateArray[1] + "月" + dateArray[2] + "日";
  }
  return formatDate;
}

module.exports = {
  formatTime: formatTime,
  getNowTime: getNowTime,
  getNextTime: getNextTime,
  getNowDay: getNowDay,
  getNowDayPlusYear: getNowDayPlusYear,
  getFormatDate: getFormatDate
}
