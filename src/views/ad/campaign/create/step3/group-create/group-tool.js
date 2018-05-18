/**
 * 把数组中具有相同特性的条目合并到一个数组
 *
 * @param {*} arr
 * [
 *   ['性别', '男'],
 *   ['性别', '女'],
 *   ['年龄段', '19岁以下'],
 *   ['年龄段', '19-25岁']
 * ]
 * @param {Function} fn 判断两个条目是否相同的函数
 * @returns {Array}
 * [
 *   [
 *     [ "性别", "男" ],
 *     [ "性别", "女" ]
 *   ],
 *   [
 *     [ "年龄段", "19岁以下" ],
 *     [ "年龄段", "19-25岁"  ]
 *   ]
 * ]
 */
function array_cluster(arr, fn) {
  var result = [];
  var check = function(a, result) {
    var flag = false;
    result = result.map(item => {
      if ( fn(item[0], a) ) {
        item.push(a);
        flag = true;
      }
      return item;
    });
    return flag;
  }
  arr.forEach( item => {
    if(!check(item, result) ){
      result.push([item])
    }
  });
  return result;
}
/**
 * 把特定类型的数组转化为特定的字符串
 *
 * @param {Array} arr  如下所示的数组
 * [
 *   [
 *     [ "性别", "男" ],
 *     [ "性别", "女" ]
 *   ],
 *   [
 *     [ "年龄段", "19岁以下" ],
 *     [ "年龄段", "19-25岁"  ]
 *   ]
 * ]
 * @returns {String} 返回如下所示的字符串
 *  "性别=男|女,年龄段=19岁以下|19-25岁"
 */
function array_to_string(arr){
  var result = [];
  result = arr.map( item => {
    var key = item[0][0];
    var value = item.map( a => {
      return a[1]
    }).join('|');
    return key + '=' + value;
  });
  return result.join(',');
}

export {
  array_cluster,
  array_to_string
}
