// pages/rank/rank.js
import { saleApi } from '../api/saleApi.js';
var app = getApp(), args = {}, listArgs = {};
var imgHost = app.imgHost + '/data/';
var actvie_start_time, actvie_end_time;
var indexTop;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankdata: [],
    selfData: {},
    userInfo: {},
    userLogin: {},
    selfJoin: false,
    someJoin: true,
    imgs: {},
    lt:'<',
    gt: '>',
    activeId: '',
    ltClciked: false,
    arrow:{
      left: 'http://i1.dd-img.com/assets/image/1531127060-6d01b1f04f09982c-20w-28h.png',
      leftDisable:'http://i1.dd-img.com/assets/image/1531127229-d52f470389d6cfa8-20w-28h.png',
      right: 'http://i1.dd-img.com/assets/image/1531127266-c779e4e15f7f451b-20w-28h.png',
      rightDisable: 'http://i1.dd-img.com/assets/image/1531127287-790877bd2d065105-20w-28h.png'
    },
    endStatus:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    actvie_end_time = options.active_end_time
    var reg= new RegExp('-','g');

    that.data.active_start_time = options.active_start_time.substr(0,10)
    that.data.active_start_time = that.data.active_start_time.replace(reg,'.')
    that.data.active_end_time = options.active_end_time.substr(5,5)
    that.data.active_end_time = that.data.active_end_time.replace(reg, '.')
    if (options.idfa) {
      listArgs.idfa = options.idfa
      wx.setStorage({
        key: 'idfa',
        data: options.idfa,
      })
    }
    listArgs['activity_id'] =  options.activity_id
    that.data.activeId = options.activity_id
    that.saleApi = new saleApi(that);
    // that.data.activeId = wx.getStorageSync('activity_id');
    // if (!that.data.activeId){
    //   that.saleApi.wsactivity('cb_wsactivity');
    // }else{
    //   listArgs = {
    //     activity_id: that.data.activeId
    //   }
    // }
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
    }else{
      wx.showTabBar();
      //用户已授权
      that.selfRank();
      // args.uid = that.data.userLogin.uid;
      listArgs.uid = that.data.userLogin.uid;
      // that.saleApi.wsactivity('cb_wsactivity')
      // that.saleApi.list(listArgs,'cb_list')
      that.saleApi.rankLink(listArgs, 'rankdata');
    }
    that.setData({
      active_start_time: that.data.active_start_time,
      active_end_time: that.data.active_end_time
    })
    
  },

  accreditEvent: function (data) {
    var that = this;
    // console.log(data);
    // console.log('用户的uid--', data.uid);
    that.data.uid = data.uid;
    listArgs.uid = that.data.uid;
    // that.saleApi.list(listArgs,'cb_list')
    that.saleApi.rankLink(listArgs, 'rankdata');
  },
  // 点击上一期
  prevActive: function() {
    var that = this;
    if (!that.data.ltClciked){
      that.data.activeId -= 1
      that.data.ltClciked = true
      wx.showLoading({
        title: '加载中',
      })
    }
    that.setData({
      ltClciked: that.data.ltClciked
    })
    listArgs['activity_id'] = that.data.activeId
    // that.saleApi.list(listArgs, 'cb_list')
  },
  // 点击下一期
  currentActive:function() {
    var that = this;
   
    if (that.data.ltClciked) {
      that.data.activeId += 1
      that.data.ltClciked = false
      wx.showLoading({
        title: '加载中',
      })
    }

    that.setData({
      ltClciked: that.data.ltClciked
    })
    listArgs['activity_id'] = that.data.activeId
    // that.saleApi.list(listArgs, 'cb_list')
  },
  cb_list: function(res,opt) {
    // console.log(res)
    var that = this;
    if (res.code == 0) {
      wx.hideLoading();
      // if (!that.data.activeId){
      //   that.data.activeId = wx.getStorageSync('activity_id');
      // }
      var activeId = that.data.activeId -1
      var data = res.data[activeId]
      that.data.imgs.car_img = data.car_img
      var len = data.end_time
      var reg = new RegExp('-', 'g');
      data.end_time = len.replace(reg, '.').substr(0, len.length - 8);
      that.data.endTime = data.end_time
    } else {
      wx.showLoading({
        title: res.message,
        image: '/pages/images/warning.png',
      })
    }
    that.setData({
      imgs: that.data.imgs,
      endTime: that.data.endTime
    })
    that.saleApi.rankLink(listArgs, 'rankdata');
  },
  cb_wsactivity: function (res) {
    var that = this;
    if (res.code == 0) {
      that.data.activity_id = res.data.current.id;
      listArgs = {
        activity_id: that.data.activity_id
      }
      wx.setStorage({
        key: 'activity_id',
        data: res.data.current.id,
      })
      // that.saleApi.list(listArgs, 'cb_list')
      that.saleApi.rankLink(listArgs, 'rankdata');
    }else{
      wx.showLoading({
        title: res.message,
        image: '/pages/images/warning.png',
      })
    }
 
  },
  selfRank() {
    var that = this;
   
    that.data.userLogin = wx.getStorageSync('userLogin');
    that.setData({
      userInfo: that.data.userLogin.userInfo,
      userLogin: that.data.userLogin
    })
  },
  rankdata: function (res, opt) {
    // console.log(res)
    //加载能量榜列表
    var that = this;
    if (res.code == 0) {
      var reg = new RegExp('-', 'g');
      that.data.rankdata = res.data.list;
      that.data.selfData = res.data.self;
     
      var selfjoin = res.data.self.hasOwnProperty('total_value');
      // 如果自己没有报名
      if (!selfjoin){
        that.data.selfJoin = true;
      }else{
        indexTop = that.data.selfData.top
        that.data.selfJoin = false;
        var time = that.data.selfData.last_time;
        that.data.selfData.last_time = time.replace(reg, '.').substr(2);
        that.setData({
          indexTop: that.data.selfData.top
        })
      }
      // 如果没有人参加
      if (!res.data.list.length) {
        that.data.someJoin = false;
      }else{
        that.data.someJoin = true;
        that.data.rankdata.forEach(function (ele) {
          ele.cx_img = imgHost + ele.cx_img
          ele.last_time = ele.last_time.replace(reg, '.').substr(2);
        })
      }

    }else{
      wx.showLoading({
        title: res.message,
        image: '/pages/images/warning.png'
      })
    }
    that.data.imgs.car_img = that.data.rankdata[0].cx_img
    that.data.head_activity_id = that.data.rankdata[0].activity_id
    that.data.car_carname = that.data.rankdata[0].cx_name
    var blockTime = () => {
      // console.log(actvie_end_time)
      that.data.endTime = actvie_end_time
      var nowTime = new Date();
      var nowTimes = Date.parse(nowTime);
     
      var endTimes = that.stamp(that.data.endTime);
      var showTimes = endTimes - nowTimes;
      if (showTimes <= 0) {
        that.data.endStatus = '（已结束）'
      }
     
    }
    blockTime();
    that.setData({
      car_carname: that.data.car_carname,
      endStatus: that.data.endStatus,
      imgs: that.data.imgs,
      head_activity_id: that.data.head_activity_id,
      rankdata: that.data.rankdata,
      selfData: that.data.selfData,
      selfJoin: that.data.selfJoin,
      someJoin: that.data.someJoin
    })


  },

  stamp: function (day) {
    var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
    return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
  },
  joinBtn() {
    wx.switchTab({
      url: '../sale/sale'
    });
  },
  moreTap() {
    // var that = this;
    // if(!flag) return;
    // args.page += 1;
    // that.saleApi.rankLink(args, 'rankdata');
  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
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
    that.saleApi = new saleApi(that);
    var uid = wx.getStorageSync('userLogin').uid;
    if (!uid) {
      wx.hideTabBar()
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
      //用户已授权
      that.selfRank();
      // args.uid = that.data.userLogin.uid;
      listArgs.uid = that.data.userLogin.uid;
      // that.saleApi.list(listArgs,'cb_list')
      that.saleApi.rankLink(listArgs, 'rankdata');
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})