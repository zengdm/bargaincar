import { userApi } from '../api/userApi.js';
import { saleApi } from '../api/saleApi.js';
// pages/next/next.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gt: '>',
    verifyCodeTime: '获取验证码',
    //验证按钮的可点击状态
    buttonDisable: false,
    //验证码
    verifyCodeNum: '',
    //手机号
    mobile: '',
    //意向车型
    dreamCar: '请选择',
    //意向车型颜色
    carColor: false,
    //意向车型ppid
    ppid: '',
    //意向车型cxid
    cxid: '',
    uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.idfa) {
      wx.setStorage({
        key: 'idfa',
        data: options.idfa,
      })
    }
    var that = this;
    that.userApi = new userApi(that);
    that.saleApi = new saleApi(that);
    that.saleApi.wsactivity('cb_wsactivity');
    
  },

  //获取本期下期的回调函数
  cb_wsactivity: function (res, opt) {
    var that = this;
    if (res.code == 0) {
      that.data.activity_id = res.data.current.id;
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //  填写手机号
  mobileInputEvent: function (e) {
    var that = this;
    that.data.mobile = e.detail.value
  },

  //填写真实姓名FuyalI

  nameInputEvent: function (e) {
    var that = this;
    that.data.userName = e.detail.value;
  },
  //填写验证码
  codeInputEvent: function (e) {
    var that = this;
    that.data.verifyCodeNum = e.detail.value;
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

  cb_verifyCode:function(res,opt){
    var that = this;
    if (res.code == 1005) {
      wx.showToast({
        title: '请勿频繁请求',
        image: '/pages/images/warning.png',
      })
    }
  },

  goDream: function () {
    wx.navigateTo({
      url: '../dreamCar/dreamCar'
    })
  },

  //点击提交
  bargain: function (e) {
    var that = this;
    var args = {};
    if (wx.getStorageSync('idfa')) {
      args.idfa = wx.getStorageSync('idfa')
    }
    if (!that.data.ppid) {
      wx.showToast({
        title: '请选择意向车型',
        image: '/pages/images/warning.png'
      })
      return false
    }
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

    wx.showLoading({
      title: '提交中...',
    })

    that.data.uid = wx.getStorageSync('userLogin').uid;

    args = {
      activity_id:that.data.activity_id,
      uid: that.data.uid,
      mobile: that.data.mobile,
      code: that.data.verifyCodeNum,
      name: that.data.userName,
      ppid: that.data.ppid,
      cxid: that.data.cxid
    };
    that.saleApi.saveCar(args, 'cb_saveCar');
  },

  //保存用户意向车型回调函数
  cb_saveCar: function (res, opt) {
      // console.log(res);
      if(res.code == 0){
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          image: '/pages/images/success.png'
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/sale/sale'
          })
        }, 500)
       
      }else{
        wx.showToast({
          title: res.message,
          image: '/pages/images/warning.png'
        })
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;

    if (that.data.dreamCar != '请选择') {
      that.data.carColor = true;
    } else {
      that.data.carColor = false;
    }
    that.setData({
      carColor: that.data.carColor
    });

    var uid = wx.getStorageSync('userLogin').uid;
    if (!uid) {
      that.setData({
        userShow: true
      })
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