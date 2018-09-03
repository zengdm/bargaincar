import { userApi } from '../api/userApi.js';
import { saleApi } from '../api/saleApi.js';
var app = getApp();
// pages/next/next.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeTime: '获取验证码',
    //验证按钮的可点击状态
    buttonDisable: false,
    //验证码
    verifyCodeNum: '',
    //手机号
    mobile: '',
    //用户id
    uid:'',
    //活动id
    activity_id:'',
    //车系id
    cxid:'',
    imgs: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.idfa) {
      wx.setStorage({
        key: 'idfa',
        data: options.idfa,
      })
    }
    that.userApi = new userApi(that);
    that.saleApi = new saleApi(that);
  
    that.saleApi.wsactivity('cb_wsactivity');
  },

  //获取本期下期的回调函数
  cb_wsactivity:function(res,opt){
    var that = this;
    // console.log(res.data.current.preshow_img);
    if(res.code == 0){
      that.data.activity_id = res.data.next.id;
      that.data.cxid = res.data.next.cxid
      that.data.imgs.preshow_img = res.data.current.preshow_img
    }
    that.setData({
      imgs: that.data.imgs
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
//  填写手机号
  mobileInputEvent: function(e){
    var that = this;
    that.data.mobile = e.detail.value
    that.setData({
      mobile: that.data.mobile
    })
  },

  //填写真实姓名

  nameInputEvent: function (e) {
    var that = this;
    that.data.userName = e.detail.value;
    that.setData({
      userName: that.data.userName
    })
  },
  //填写验证码
  codeInputEvent: function (e) {
    var that = this;
    that.data.verifyCodeNum = e.detail.value;
    that.setData({
      verifyCodeNum: that.data.verifyCodeNum
    })
  },
  //点击验证
  getCode: function (phone) {
    var that = this;
    if (that.data.buttonDisable) return false;

    var mobile = that.data.mobile;
    if (mobile.trim().length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        image: '/pages/images/warning.png',
      })
      return false;
    }

    var regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!regMobile.test(mobile)) {
      that.setData({
        error: true
      })
      wx.showToast({
        title: '手机号码有误',
        image: '/pages/images/error.png',
      })
      return false;
    }

    var c = 59;
    // 获取验证码按钮变灰
    that.setData({
      buttonDisable: true,
      verifyCodeTime: c + 's'
    });

    var intervalId = setInterval(function () {
      c = c - 1;
      that.setData({
        verifyCodeTime: c + 's'
      })
      if (c == 0) {
        clearInterval(intervalId);
        that.setData({
          verifyCodeTime: '获取验证码',
          buttonDisable: false
        })
      }
    }, 1000)
    var args = {
      mobile: that.data.mobile
    }

    // 发起验证码
    that.userApi.verifyCode(args, 'cb_verifyCode');
  },

  cb_verifyCode: function (res, opt) {
    var that = this;
    if (res.code == 1005) {
      wx.showToast({
        title: '请勿频繁请求',
        image: '/pages/images/warning.png',
      })
    }
  },


  //跳转到电动邦小程序
  goDdb: function () {
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'wx08cd8cd9371fba0d',
      path: 'pages/model/serie/serie?pserid='+that.data.cxid,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'trial',
    })
  }, 

//点击我要报名
  bargain:function(e){
    var that = this;
    var args = {};
    if (!that.data.userName||that.data.userName.trim().length == 0) {
      wx.showToast({
        title: '请填写真实姓名',
        image: '/pages/images/warning.png'
      })
      return false
    }

    if (!that.data.mobile||that.data.mobile.trim().length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        image: '/pages/images/warning.png'
      })
      return false
    }

    if (!that.data.verifyCodeNum||that.data.verifyCodeNum.trim().length == 0) {
      wx.showToast({
        title: '请填写验证码',
        image: '/pages/images/warning.png'
      })
      return false
    };
    that.data.uid = wx.getStorageSync('userLogin').uid;
    args = {
      activity_id:that.data.activity_id,
      uid: that.data.uid,
      mobile: that.data.mobile,
      code: that.data.verifyCodeNum,
      name: that.data.userName,
    };
    if (wx.getStorageSync('idfa')) {
      args.idfa = wx.getStorageSync('idfa')
    }
    wx.showLoading({
      title: '提交中...',
    })
    that.saleApi.nextApply(args, 'cb_nextApply');
  },

  cb_nextApply:function(res,opt){
    var that = this;
    if (res.code == 0) {
      wx.hideLoading();
      that.setData({
        mobile: '',
        userName: '',
        verifyCodeNum: ''
      })
      wx.showToast({
        title: '报名成功',
        image: '/pages/images/success.png'
      })

    } else {
      wx.showToast({
        title: res.message,
        image: '/pages/images/warning.png'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var uid = wx.getStorageSync('userLogin').uid;
    if (!uid) {
      wx.hideTabBar();
      that.setData({
        userShow: true
      });

      //弹窗消失之后执行的方法
      app.ddbevent.on('callme', function (data) {
        wx.showTabBar()
      });
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
  // onShareAppMessage: function () {
  
  // }
})