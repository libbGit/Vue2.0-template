import mathjs from 'mathjs'

/**深拷贝, 可用loadsh库替代 */
let deepClone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**图片放大预览 */
let previewImage = function (url) {
  this.$alert('<img src="' + url + '" style="max-width:90vw;max-height:85vh;"/>', {
    dangerouslyUseHTMLString: true,
    showConfirmButton: false,
    closeOnClickModal: true,
    showClose: true,
    center: true,
    customClass: 'el-message-preview-box',
    callback: () => { console.log("关闭预览") }
  });
}

/**文件下载 */
let downloadFile = function (sUrl) {
  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    alert('Your device does not support files downloading. Please try again in desktop browser.');
    return false;
  }

  //If in Chrome or Safari - download via virtual link click
  if (downloadFile.isChrome || downloadFile.isSafari) {
    //Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;
    link.target = "_blank";

    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  // Force file download (whether supported by server).
  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download';
  }

  window.open(sUrl, '_self');
  return true;
};
downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;


let toDecimal2 = function (x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};



let formatPrice = function (num) {
  return num && (num
    .toString().indexOf('.') !== -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
      return $1 + ",";
    }) : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
      return $1 + ",";
    }));

};

/**金额格式化
 * @param {*} number 数字
 * @param {*} places 小数后几位
 * @param {*} symbol 货币符号  $
 * @param {*} thousand 千分位符号   ,
 * @param {*} decimal 小数点符号   .
 */
let formatMoney = function (number, places, symbol, thousand, decimal) {
  // console.log('number',number)
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "¥";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


/**日期格式化
 * @param {*} fmt yyyy-MM-dd
 */
let formatDate = function (date, fmt) {
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**常用正则表达式 */
let constReg = {
  name: /^[\u4E00-\u9FA5A-Za-z0-9_]{1,30}$/,//数字，英文，中文、下划线 30个字符以内
  num: /^(0|([1-9][0-9]*))(\.[0-9]{1,2})?$/, //正整数、最多保留2位小数。
  num2: /^(0|-?([1-9][0-9]*))(\.[0-9]{1,2})?$/, //负整数,正整数、最多保留2位小数。
  positiveInt: /^[1-9]\d*$/,  //匹配正整数 

  //URL规则：
  //(1)、地址必须以http/https/ftp/ftps开头；
  //(2) 、地址不能包含双字节符号或非链接特殊字符
  url: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/,//

}

/**使用mathjs 重写toFixed方法 */
Number.prototype.toFixed = function (d) {
  return mathjs.format(this,  {notation: 'fixed', precision: d});
};

//作为插件必须定义公开的 install 方法
export default function install(Vue, options) {
  Vue.deepClone = Vue.prototype.$deepClone = deepClone;
  Vue.previewImage = Vue.prototype.$previewImage = previewImage;
  Vue.downloadFile = Vue.prototype.$downloadFile = downloadFile;
  Vue.toDecimal2 = Vue.prototype.$toDecimal2 = toDecimal2;
  Vue.formatPrice = Vue.prototype.$formatPrice = formatPrice;
  Vue.formatMoney = Vue.prototype.$formatMoney = formatMoney;
  Vue.formatDate = Vue.prototype.$formatDate = formatDate;
  Vue.constReg = Vue.prototype.$constReg = constReg;
}