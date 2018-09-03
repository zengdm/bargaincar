// pages/help/help.js

import util from "../../utils/util"
// import { prizeApi } from '../../../utils/api/prizeApi.js';
// import { userApi } from '../../../utils/api/userApi.js';
var app = getApp();//获取应用实例

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //活动状态：未开始:Istimestatus=1,进行中:Istimestatus=2,结束:Istimestatus=-1,
        Istimestatus: 0,
        endTime: '2018-6-15 18:48:00'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        var userInfo = wx.getStorageSync('userInfo');
        console.log(userInfo);
        console.log(options);
        /*** 限时答题答题start ***/
        that.cb_lastOne()


    },
    stamp: function (day) {
      var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
      return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
    },
    cb_lastOne: function (timestamp) {
      let that = this;
      var day, hour, min, sec, msSec = 9, interval, downTime= {};
      var blockTime = () => {
        var nowTime = new Date();
        var nowTimes = Date.parse(nowTime);
        var endTimes = that.stamp(that.data.endTime);
        var showTimes = endTimes - nowTimes;
        if (showTimes <= 0) {
          downTime = {
            hour: '00',
            minute: '00',
            second: '00',
            msSec: '0'
          }
          that.setData({
            downTime
          })
          clearInterval(interval);
          return;
        }
        // 获取天
        day = Math.floor(showTimes / 1000 / 60 / 60 / 24);
        if (day > 0) {
          downTime = {
            day
          }
        }else{
          hour = Math.floor(showTimes / 1000 / 60 / 60 % 24);
          min = Math.floor(showTimes / 1000 / 60 % 60);
          sec = Math.floor(showTimes / 1000 % 60);
          msSec -= 1;
          if (msSec < 0) {
            msSec = 9;
          }
          if (day < 10) day = "0" + day;
          if (hour < 10) hour = "0" + hour;
          if (min < 10) min = "0" + min;
          if (sec < 10) sec = "0" + sec;
          downTime = {
            hour,
            minute: min,
            second: sec,
            msSec
          }
        }
        
        that.setData({
          downTime
        })
      }
      interval = setInterval(function () {
        blockTime();
      }, 100);
     
      blockTime();

    },
    /**
 * 获取限时答题最新一条有奖问答
 */
    cb_lastOne1: function () {
        let that = this;
        //当前时间
        let now_time = app.time();
        //开始时间
        let timestamp = now_time + 13000
        //结束时间
        let end_time = timestamp + 100000
        // 测试
        // timestamp = now_time + 13;
        // end_time = timestamp + 10000;
        console.log(now_time + "+" + timestamp + "+" + end_time)

        if (now_time > end_time && end_time > 0) {
            //活动已结束（当前时间大于结束时间）
            //活动状态：未开始:Istimestatus=1,进行中:Istimestatus=2,结束:Istimestatus=-1,
            that.setData({
                Istimestatus: -1
            })
        } else {
            //活动未结束
            let downTime = util.downTimer(timestamp, app.time());
            console.log("倒计时", util.downTimer(timestamp, app.time()))
            // that.setData({
            //     Istimestatus: 1,
            //     downTime: downTime,
            // });
            clearInterval(that.data.prizeInterval)
            // ntime（开始时间-当前时间）
            if (downTime.ntime >= 0) {
                //活动
                //活动即将进行
                that.data.prizeInterval = setInterval(function () {
                    // 计算时间差
                    let downTime = util.downTimer(timestamp, app.time());
                    // console.log("倒计时1+", util.downTimer(timestamp, app.time()))
                    let Istimestatus = 1;
                    that.setData({
                        downTime: downTime,
                    });
                    that.setData({
                        downTime: downTime,
                        Istimestatus: Istimestatus
                    });

                }, 10)

            }

        }
    },
    /**
* 用户点击右上角分享
*/
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '电动邦发钱啦！快来拿奖金！',
            path: "/pages/prize/index/index?sourceid=sourceid",
            imageUrl: 'http://i1.dd-img.com/assets/image/1524553758-0ee55d43e3e69554-600w-480h.jpg',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            },
            complete: function (res) {
                //转发成功失败的回调函数
                if (res.errMsg == 'shareAppMessage:ok') {
                    that.prizeApi.isshare(that.data.rid, res.errMsg, 'cb_isshare');
                    that.onShow()
                }
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    gorank: function () {
        console.log('111')
        wx.switchTab({
            url: '../rank/rank'
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },


})