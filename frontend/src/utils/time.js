function getDatetimeShiftDay(days = 0, formatStr = "yyyy-MM-dd HH:mm:ss") {
  var today = new Date();
  var lastOrNextDate = today.getTime() + 1000 * 60 * 60 * 24 * days;
  today.setTime(lastOrNextDate);
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var hour = today.getHours(); //时
  var minute = today.getMinutes(); //分
  var second = today.getSeconds(); //秒

  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  let result = "";
  if (formatStr == "yyyy-MM-dd") {
    result = year + "-" + month + "-" + date;
  } else if (formatStr == "yyyy-MM-dd HH:mm:ss") {
    result =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second;
  } else if (formatStr == "yyyyMMdd") {
    result = year + month + date;
  } else if (formatStr == "yyyyMMddHHmmss") {
    result = year + month + date + hour + minute + second;
  } else {
    console.error(
      "时间格式不正确，请输入yyyy-MM-dd、yyyyMMdd、 yyyy-MM-dd HH:mm:ss、yyyyMMddHHmmss"
    );
  }
  return result;
}

//格式化日期  
function formatTimestamp(timestamp) {
    const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let theYear = date.getFullYear();
    let theMonth = date.getMonth() + 1;
    let theDay = date.getDate();
    let theHours = date.getHours();
    let theMinutes = date.getMinutes();
    let theSeconds = date.getSeconds();

    theMonth = theMonth < 10 ? "0" + theMonth : theMonth;
    theDay = theDay < 10 ? "0" + theDay : theDay;
    theHours = theHours < 10 ? "0" + theHours : theHours;
    theMinutes = theMinutes < 10 ? "0" + theMinutes : theMinutes;
    theSeconds = theSeconds < 10 ? "0" + theSeconds : theSeconds;

    return `${theYear}-${theMonth}-${theDay} ${theHours}:${theMinutes}:${theSeconds}`;
}

function getCurrentMonthFirst() {
  var date = new Date();
  date.setDate(1);
  var month = parseInt(date.getMonth() + 1);
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return date.getFullYear() + "-" + month + "-" + day;
}
function getCurrentMonthLastDay() {
  var date = new Date();
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var lastTime = new Date(nextMonthFirstDay - oneDay);
  var month = parseInt(lastTime.getMonth() + 1);
  var day = lastTime.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return date.getFullYear() + "-" + month + "-" + day;
}
function getTimeStamp_S() {
  var timestamp = new Date().getTime().toString();
  var timestamp_s = timestamp.substring(1, 10);
  return timestamp_s;
}
function getTimeStamp_MS() {
  var timestamp = new Date().getTime();
  return timestamp;
}
function getdate(TimeStamp) {
  var now = new Date(date),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return (
    y +
    "-" +
    (m < 10 ? "0" + m : m) +
    "-" +
    (d < 10 ? "0" + d : d) +
    " " +
    now.toTimeString().substr(0, 8)
  );
}

export {
  getDatetimeShiftDay,
  formatTimestamp,
  getCurrentMonthFirst,
  getCurrentMonthLastDay,
  getTimeStamp_S,
  getTimeStamp_MS,
  getdate,
};
