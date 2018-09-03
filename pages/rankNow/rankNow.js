// pages/rank/rank.js
import { saleApi } from '../api/saleApi.js';
var app = getApp(), args = {}, listArgs = {};
var app = getApp();
var imgHost = app.imgHost + '/data/';

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
    lt: '<',
    gt: '>',
    activeId: '',
    ltClciked: false,
    arrow: {
      left: 'http://i1.dd-img.com/assets/image/1531127060-6d01b1f04f09982c-20w-28h.png',
      leftDisable: 'http://i1.dd-img.com/assets/image/1531127229-d52f470389d6cfa8-20w-28h.png',
      right: 'http://i1.dd-img.com/assets/image/1531127266-c779e4e15f7f451b-20w-28h.png',
      rightDisable: 'http://i1.dd-img.com/assets/image/1531127287-790877bd2d065105-20w-28h.png'
    },
    indexTop: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.idfa) {
      listArgs.idfa = options.idfa
      wx.setStorage({
        key: 'idfa',
        data: options.idfa,
      })
    }
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
      that.selfRank();
      // args.uid = that.data.userLogin.uid;
      listArgs.uid = that.data.userLogin.uid;
      // that.saleApi.wsactivity('cb_wsactivity')
      // that.saleApi.list(listArgs, 'cb_list')
      that.saleApi.rankLink(listArgs, 'rankdata');
    }


  },

  accreditEvent: function (data) {
    var that = this;
    that.data.uid = data.uid;
    listArgs.uid = that.data.uid;
    // that.saleApi.list(listArgs, 'cb_list')
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
    } else {
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
      if (!selfjoin) {
        that.data.selfJoin = true;
      } else {
        that.data.indexTop = that.data.selfData.top
        that.data.selfJoin = false;
        var time = that.data.selfData.last_time;
        that.data.selfData.last_time = time.replace(reg, '.').substr(2);
      }
      // 如果没有人参加
      if (!res.data.list.length) {
        that.data.someJoin = false;
      } else {
        that.data.someJoin = true;
        that.data.rankdata.forEach(function (ele) {
          ele.last_time = ele.last_time.replace(reg, '.').substr(2);
          ele.cx_img = imgHost + ele.cx_img
        })
      }

    } else {
      wx.showLoading({
        title: res.message,
        image: '/pages/images/warning.png'
      })
    }
    that.setData({
      indexTop: that.data.indexTop,
      rankdata: that.data.rankdata,
      selfData: that.data.selfData,
      selfJoin: that.data.selfJoin,
      someJoin: that.data.someJoin
    })

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
      // that.saleApi.list(listArgs, 'cb_list')
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