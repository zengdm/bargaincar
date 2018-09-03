// pages/past/past.js
import { userApi } from '../api/userApi.js';
import { saleApi } from '../api/saleApi.js';
var app = getApp();
var imgHost = app.imgHost + '/data/';
var args = {};
var joinedArgs = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinTotalNum :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.idfa) {
      args.idfa = options.idfa
      joinedArgs.idfa = options.idfa
      wx.setStorage({
        key: 'idfa',
        data: options.idfa,
      })
    }
    that.userApi = new userApi(that);
    that.saleApi = new saleApi(that);
    
    var uid = wx.getStorageSync('userLogin').uid;
    if (!uid) {
      wx.hideTabBar();
      //用户未授权
      that.setData({
        userShow: true
      })
      //弹窗消失之后执行的方法
      app.ddbevent.on('callme', function (data) {
        // console.log('未授权之后----')
        wx.showTabBar()
        that.accreditEvent(data);
      });
    } else {
      wx.showTabBar();
      //用户已授权
      args.uid = uid;
      joinedArgs.uid = uid;
      that.saleApi.pastList(args, 'cb_pastList');
      that.saleApi.joinedList(joinedArgs,'cb_joinedList');
    }
    
  },
  accreditEvent: function (data) {
    var that = this;
    that.data.uid = data.uid;
    // listArgs.uid = that.data.uid;
    // that.saleApi.list(listArgs, 'cb_list')
    args.uid = that.data.uid;
    joinedArgs.uid = that.data.uid;
    that.saleApi.pastList(args, 'cb_pastList');
    that.saleApi.joinedList(joinedArgs, 'cb_joinedList');
 
  },
  pastActive: function(e){
    var activity_id = e.currentTarget.dataset.activity_id;
    var active_start_time = e.currentTarget.dataset.active_start_time
    var active_end_time = e.currentTarget.dataset.active_end_time
    wx.navigateTo({
      url: '../rank/rank?activity_id=' + activity_id + '&active_start_time=' + active_start_time + '&active_end_time=' + active_end_time,
    })

  },
  cb_pastList: function(res,opt) {
    // console.log(res)
    var that = this;
    var pastActive = res.data.list;
    var reg = new RegExp('-', 'g');
    pastActive.forEach(function(ele) {

      var len = ele.start_time.length;
      ele.start_timestamp = ele.start_time
      ele.start_time = ele.start_time.replace(reg, '.').substr(0, 10);
      ele.end_timestamp = ele.end_time
      ele.end_time = ele.end_time.replace(reg, '.').substr(5,5);
      ele.cx_img = imgHost + ele.cx_img
    })
    
    that.setData({
      pastActive
    })
  },
  cb_joinedList: function (res) {
    console.log(res)
    var that = this;
    var pastJoined = res.data.list
    if (!res.data.hasOwnProperty('list')){
      that.setData({
        joinAsgin: true
      })
      return;
    }
    that.data.joinTotalNum = pastJoined.length;
    var reg = new RegExp('-', 'g');
    pastJoined.forEach(function (ele) {
      var len = ele.start_time.length;
      ele.start_timestamp = ele.start_time
      ele.start_time = ele.start_time.replace(reg, '.').substr(0, 10);
      ele.end_timestamp = ele.end_time
      ele.end_time = ele.end_time.replace(reg, '.').substr(5, 5);
      ele.cx_img = imgHost + ele.cx_img
    })
    that.setData({
      joinTotalNum: that.data.joinTotalNum,
      pastJoined
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.userApi = new userApi(that);
    that.saleApi = new saleApi(that);

    var uid = wx.getStorageSync('userLogin').uid;
    if (!uid) {
      wx.hideTabBar();
      //用户未授权
      that.setData({
        userShow: true
      })
      //弹窗消失之后执行的方法
      app.ddbevent.on('callme', function (data) {
        // console.log('未授权之后----')
        wx.showTabBar()
        that.accreditEvent(data);
      });
    } else {
      wx.showTabBar();
      //用户已授权
      args.uid = uid;
      joinedArgs.uid = uid;
      that.saleApi.pastList(args, 'cb_pastList');
      that.saleApi.joinedList(joinedArgs, 'cb_joinedList');
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})