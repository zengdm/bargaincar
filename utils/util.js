// import xapi from "xapi"
// // 获取App.js配置
// var app = getApp();

// export default function util(page) {
//     let root = page;
//     //   console.log(root);
//     Object.assign(root, {

//         formatTime: function (date) {
//             var year = date.getFullYear()
//             var month = date.getMonth() + 1
//             var day = date.getDate()

//             var hour = date.getHours()
//             var minute = date.getMinutes()
//             var second = date.getSeconds()


//             return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
//         },
//         //时间戳转换时间
//         // function getLocalTime(nS) {
//         //   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, '');
//         // }
//         // console.log(getLocalTime(1505897202))
//         formatNumber: function (n) {
//             n = n.toString()
//             return n[1] ? n : '0' + n
//         },
//         throttle: function (method, delay, duration) {
//             var timer = null, begin = new Date();

//             return function () {
//                 var context = this, args = arguments, current = new Date();
//                 clearTimeout(timer);

//                 if (current - begin >= duration) {
//                     method.apply(context, args);
//                     begin = current;
//                 } else {
//                     timer = setTimeout(function () {
//                         method.apply(context, args);
//                     }, delay);
//                 }
//             }
//         },
//         // 数组包含检测方法
//         contains: function (arr, obj) {
//             if (typeof (arr) != object) {
//                 return false;
//             }

//             var len = arr.length;
//             while (len--) {
//                 if (arr[len] === obj) {
//                     return true;
//                 }
//             }
//             return false;
//         },
//         /**
//          * 统一获取接口数据（带缓存）
//          * 
//          * 1、获取缓存
//          * 2、检查缓存有效性，有效直接回调页面方法，传回数据
//          * 3、无缓存
//          */
//         getCacheData: function (path, callback, args) {
//             var that = this;
//             // console.log('<!-----');
//             var data = {};
//             // 1. 获取缓存数据

//             var key = path + JSON.stringify(args);

//             if (!app.apiDebug) {
//                 wx.getStorage({
//                     key: key,
//                     success: function (data) {

//                         // 判断字段cachetime是否有效
//                         console.log(data);
//                         // console.log(data.data.cachetime);
//                         // console.log(data.data.cachetime == false);

//                         if (data.data.cachetime) {

//                             console.log('[data from cache]');
//                             // 回调方法，传回数据
//                             //data.fromcache = true;
//                             return page[callback](data);

//                         } else {
//                             that.getAjaxData(path, callback, args);
//                         }

//                     },
//                     fail: function (e) {
//                         that.getAjaxData(path, callback, args);
//                     }
//                 });
//             }
//             // console.log('----->');
//         },

//         getAjaxData: function (path, callback, args) {
//             // 1. 获取缓存数据

//             var key = path + JSON.stringify(args);
//             console.log('[data from ajax]');

//             // 异步请求数据
//             xapi.request({
//                 url: app.apiHost + path + '',
//                 data: args,
//                 method: 'GET'
//             }).then(function (res) {
//                 console.log(res);
//                 var data = {};

//                 //1) 存本地缓存(开启模式)
//                 if (res.data.code == 0) {
//                     data = res.data.data;
//                     console.log(data);

//                     if (!app.apiDebug) {
//                         // 增加缓存时间
//                         data['cachetime'] = '201709101234';
//                         wx.setStorage({
//                             key: key,
//                             data: data,
//                         });
//                     }
//                 }
//                 // 回调方法，传回数据
//                 return page[callback](data);
//             });
//         },
//     })
// }
// const formatTime = date => {
//     const year = date.getFullYear()
//     const month = date.getMonth() + 1
//     const day = date.getDate()
//     const hour = date.getHours()
//     const minute = date.getMinutes()
//     const second = date.getSeconds()
//     return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
// const formatNumber = n => {
//     n = n.toString()
//     return n[1] ? n : '0' + n
// }
// // 当前时间倒计时
// const downTimer = (timestamp, now) => {
//     // console.log("时间")
//     if (!now) {
//         now = Date.parse(new Date()) / 1000;
//     }

//     if (timestamp.toString().length > 10) {
//         timestamp = Date.parse(new Date(timestamp)) / 1000;
//     } else {
//         timestamp = Math.floor(timestamp);
//     }
//     var day = 0;
//     var hour = 0;
//     var minute = 0;
//     var second = 0;
//     var ms = 0;
//     var ntime = Math.floor(timestamp - now);
//     // console.log("时间+++" + ntime)
//     if (ntime > 0) {
//         day = Math.floor(ntime / 86400);
//         hour = Math.floor(ntime % 86400 % 86400 / 3600);
//         minute = Math.floor(ntime % 86400 % 3600 / 60);
//         second = Math.floor(ntime % 86400 % 3600 % 60);
//         ms = Math.floor(ntime % 86400 % 3600 % 60 % 10000);
//     }
//         return { day: day, hour: hour < 10 ? '0' + hour : '' + hour, minute: minute < 10 ? '0' + minute : '' + minute, second: second < 10 ? '0' + second : '' + second, ms: ms, ntime: ntime };


// }
// module.exports = {
//     formatTime: formatTime,
//     downTimer: downTimer
// }


import xapi from "xapi"
// 获取App.js配置
var app = getApp();

export default function util(page) {
  let root = page;
  //   console.log(root);
  Object.assign(root, {

    formatTime: function (date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()

      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()


      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    },
    //时间戳转换时间
    // function getLocalTime(nS) {
    //   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, '');
    // }
    // console.log(getLocalTime(1505897202))


    formatNumber: function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },


    throttle: function (method, delay, duration) {
      var timer = null, begin = new Date();

      return function () {
        var context = this, args = arguments, current = new Date();
        clearTimeout(timer);

        if (current - begin >= duration) {
          method.apply(context, args);
          begin = current;
        } else {
          timer = setTimeout(function () {
            method.apply(context, args);
          }, delay);
        }
      }
    },

    // 数组包含检测方法
    contains: function (arr, obj) {
      if (typeof (arr) != object) {
        return false;
      }

      var len = arr.length;
      while (len--) {
        if (arr[len] === obj) {
          return true;
        }
      }
      return false;
    },


    /**
     * 统一获取接口数据（带缓存）
     * 
     * 1、获取缓存
     * 2、检查缓存有效性，有效直接回调页面方法，传回数据
     * 3、无缓存
     */


    getCacheData: function (path, callback, args) {
      var that = this;
      // console.log('<!-----');
      var data = {};
      // 1. 获取缓存数据

      var key = path + JSON.stringify(args);

      if (!app.apiDebug) {
        wx.getStorage({
          key: key,
          success: function (data) {

            // 判断字段cachetime是否有效
            // console.log(data);
            // console.log(data.data.cachetime);
            // console.log(data.data.cachetime == false);

            if (data.data.cachetime) {

              // console.log('[data from cache]');
              // 回调方法，传回数据
              //data.fromcache = true;
              return page[callback](data);

            } else {
              that.getAjaxData(path, callback, args);
            }

          },
          fail: function (e) {
            that.getAjaxData(path, callback, args);
          }
        });
      }
      // console.log('----->');
    },

    getAjaxData: function (path, callback, args) {
      // 1. 获取缓存数据

      var key = path + JSON.stringify(args);
      // console.log('[data from ajax]');

      // 异步请求数据
      xapi.request({
        url: app.apiHost + path + '',
        data: args,
        method: 'GET'
      }).then(function (res) {
        // console.log(res);
        var data = {};

        //1) 存本地缓存(开启模式)
        if (res.data.code == 0) {
          data = res.data.data;
          // console.log(data);

          if (!app.apiDebug) {
            // 增加缓存时间
            data['cachetime'] = '201709101234';
            wx.setStorage({
              key: key,
              data: data,
            });
          }
        }
        // 回调方法，传回数据
        return page[callback](data);
      });
    },


  })
}

