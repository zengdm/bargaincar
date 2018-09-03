// pages/sale/sale.js

import { userApi } from '../api/userApi.js';
import { saleApi } from '../api/saleApi.js';
var app = getApp(), args = {}, interval;
var imgHost = app.imgHost + '/data/';
var canvasImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //授权弹窗（默认隐藏）
    userShow: false,
    //用户授权信息
    userInfo: '',
    //用户真实姓名
    userName: '',
    //验证码按钮起始状态
    verifyCodeTime: '获取验证码',
    //验证按钮的可点击状态
    buttonDisable: false,
    //验证码
    verifyCodeNum: '',
    //手机号
    mobile: '',
    //报名成功弹窗
    energySucc: false,
    //报名状态
    applySuss: false,
    //活动结束标识
    activityEnd: false,
    //是否通过分享打开的小程序
    shareOpen: false,
    //分享打开是否帮忙集过能量
    finished: false,
    uid: '',
    //接收分享带来的参数
    shareId: '',
    //活动状态：未开始:Istimestatus=1,进行中:Istimestatus=2,结束:Istimestatus=-1,
    Istimestatus: 0,
    endTime: '',
    //loading状态
    loadShow: true,
    //集能量值
    energyValue: 0,
    rankData: [],
    imgs: {},
    //车系id
    cxid: '207',
    //活动id
    activity_id: '',
    //分享id
    join_id: '',
    //个人总能量
    total_value: '100',
    // 点击集能量loading状态
    loadingBloon: false,
    //更新场景值
    onScene: false,
    //需要帮忙的名字
    helpName: '',
    //禁止onShow执行
    forbidShow: false,
    // 请选择意向车型
    selectCar: true,
    carimg: '',
    dreamCar: '',
    pic_joined: '',
    // 分享按钮
    shareBtnBtm: true,
    //默认车名
    car_model_name:'',
    // 默认车图
    default_img:'',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.idfa) {
      args.idfa = options.idfa
      wx.setStorage({
        key: 'idfa',
        data: options.idfa,
      })
    }

    clearInterval(interval)
    // console.log('onLoad中的options--', options.scene);
    // console.log('场景值--', app.scene);
    var that = this;
    that.userApi = new userApi(that);
    that.saleApi = new saleApi(that);
    that.data.uid = wx.getStorageSync('userLogin').uid;
    
    if (that.data.join_id && (app.scene == '1007' || app.scene == '1044' || app.scene == '1008')) {
      that.data.shareOpen = true;
    }

    //用户通过分享入口打开，安卓个人打开和群里打开的场景值都是1044，ios个人打开的场景值是1007
    // if (app.scene == '1007' || app.scene == '1044' || app.scene == '1008') {
    if (options.join_id) {
      // console.log('----分享打开-----');
      //接收分享带来的参数
      that.data.activity_id = options.activity_id,
        that.data.shareuid = options.shareuid,
        that.data.join_id = options.join_id;
      that.data.helpName = options.helpName;
      // that.data.shareUid = options.uid;
      //that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
      that.setData({
        helpName:that.data.helpName
      })

    }

    // wx.showLoading({
    //   title: '载入中...',
    // })
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function (options) {
    var that = this;

    
    // console.log('onShow------that.data.forbidShow------',that.data.forbidShow);
    if (that.data.forbidShow) {
      return false;
    }
    // console.log('onShow---onScene--', that.data.onScene);
    if (that.data.onScene) {
      app.scene = '1001';
    }

    if (that.data.join_id && (app.scene == '1007' || app.scene == '1044' || app.scene == '1008')) {
      that.data.shareOpen = true;
    }
    // console.log('用户的uid--',that.data.uid);
    // console.log('姓名--', wx.getStorageSync('userInfo').nickName, 'help', that.data.helpName);
    // console.log('onShow中的options---',options);
    // console.log('that.data.join_id----', that.data.join_id);
    // console.log('onShow-场景值--',app.scene);
    that.saleApi.wsactivity('cb_wsactivity');

    // console.log('====================', that.data)
    
    // ！！！！！！！
    // if (!that.data.shareOpen) {
    //   that.saleApi.activeInfo(that.data.activity_id, that.data.uid, 'cb_activeInfo');
    // } else {
    //   that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
    // }

    that.setData({
      selectCar:that.data.selectCar,
      cxid:that.data.cxid
    })
  },
  goDream: function () {
    wx.navigateTo({
      url: '../dreamCar/dreamCar'
    })
  },
  //点击特价车型tabBar
  onTabItemTap(item) {
    var that = this;
    // console.log(item.index)
    // console.log(item.pagePath)
    // console.log(item.text)
    app.scene = '1001';
    that.data.onScene = true;
    that.data.forbidShow = false;
  },
  cb_wsactivity: function (res) {
    var that = this;
    if (res.code == 0) {
      var cur = res.data.current;
      that.data.imgs.head_img = cur.head_img;
      that.data.imgs.price_img = cur.price_img;
      that.data.endTime = cur.end_time;
      that.data.car_model_name = cur.car_model_name;
      that.data.default_img = cur.default_img;
      // that.data.endTime = '2018-07-09 23:59:59'
      that.data.cxid = cur.cxid;
      that.data.activity_id = cur.id;
      wx.setStorage({
        key: 'activity_id',
        data: cur.id,
      })

      //测试分享
      // that.data.join_id = '1'
      // app.scene = 1007;
      //用户通过分享入口打开，安卓个人打开和群里打开的场景值都是1044，ios个人打开的场景值是1007
      // if (app.scene == '1007' || app.scene == '1044' || app.scene == '1008') {
      // console.log('that.data.shareUid---:', that.data.shareUid, 'that.data.uid---:', that.data.uid)
      // if (that.data.join_id && (app.scene == '1007' || app.scene == '1044' || app.scene == '1008') && (that.data.shareUid != that.data.uid)) {
      if (that.data.join_id && (app.scene == '1007' || app.scene == '1044' || app.scene == '1008')) {
        // console.log('----分享打开-----');
        // console.log('onShow-join_id--',that.data.join_id);
        //隐藏tabBar
        wx.hideTabBar();
        wx.setNavigationBarTitle({
          title: '帮忙收集能量'
        })
        //通过分享打开小程序
        that.data.shareOpen = true;
        that.data.uid = wx.getStorageSync('userLogin').uid;
        if (that.data.uid) {
          // console.log('用户已授权');
          //用户已授权
          var finishedArgs = {
            // activity_id: that.data.activity_id,
            uid: that.data.uid,
            join_id: that.data.join_id,
            cxid: that.data.cxid
          };

          that.saleApi.isfinished(finishedArgs, 'cb_isfinished');
          that.saleApi.recordShare(that.data.activity_id, that.data.uid, that.data.join_id, 'cb_recordShare');
        } else {
          // console.log('用户未授权');
          that.setData({
            userShow: true
          })
          //弹窗消失之后执行的方法
          app.ddbevent.on('callme', function (data) {
            that.onSQSuccess(data);
          });
        }

       
        that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
        

      } else {
        wx.showTabBar();
        //正常打开小程序
        that.data.shareOpen = false;

        // console.log('微信授权信息', wx.getStorageSync('userInfo'));
        that.data.userInfo = wx.getStorageSync('userInfo');
        if (!that.data.userInfo) {
          // console.log('未授权', that.data.userInfo);
          wx.hideTabBar();
          that.setData({
            userShow: true
          });

          //弹窗消失之后执行的方法
          app.ddbevent.on('callme', function (data) {
            // console.log('弹窗消失后--');
            that.accreditEvent(data)
          });
        } else {
          //已授权
          that.data.uid = wx.getStorageSync('userLogin').uid;
          // console.log('用户的uid--', that.data.uid);

          if (!that.data.shareOpen) {
            that.saleApi.activeInfo(that.data.activity_id, that.data.uid, 'cb_activeInfo');
          } else {
            that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
          }
        }
      }

    } else {
      wx.showToast({
        title: res.message,
        image: '/pages/images/warning.png'
      })
    }
    
    that.setData({
      imgs: that.data.imgs,
      shareOpen: that.data.shareOpen,
      // shareOpen: true,
      car_model_name: that.data.car_model_name,
        defaul_images: imgHost + that.data.default_img
    })
    that.cb_lastOne();
  },

  cb_recordShare:function(res){
    var that = this;
    var energyValue = res.data.value;
    energyValue = energyValue.split(".")[0]; 
    if(res.code == 0){
      that.setData({
        energyValue: energyValue
      })
    }
  },
  //跳转到电动邦小程序
  goDdb: function (e) {
    var that = this;
    var cxid = e.currentTarget.dataset.cxid;
    if (!cxid){
      cxid = 207;
    }
    console.log(cxid)
    that.data.cxid = cxid;
    wx.navigateToMiniProgram({
      appId: 'wx08cd8cd9371fba0d',
      path: 'pages/model/serie/serie?pserid=' + that.data.cxid,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'trial',
    });
  },

  //用户同意授权之后判断是否已经分享过（分享入口）
  onSQSuccess: function (data) {
    var that = this;
    that.data.uid = data.uid;
    var finishedArgs = {
      uid: data.uid,
      join_id: that.data.join_id,
      cxid: that.data.cxid
    };
    that.saleApi.isfinished(finishedArgs, 'cb_isfinished');
    that.saleApi.recordShare(that.data.activity_id, that.data.uid, that.data.join_id, 'cb_recordShare');
    wx.hideTabBar();
  },

  //用户同意授权之后请求接口 判断用户是否报名（小程序入口）
  accreditEvent: function (data) {
    var that = this;
    // console.log(data);
    // console.log('用户的uid--', data.uid);
    that.data.uid = data.uid;
    if (!that.data.shareOpen) {
      that.saleApi.activeInfo(that.data.activity_id, that.data.uid, 'cb_activeInfo');
    } else {
      that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
    }
    wx.showTabBar();
  },
  //用户参加活动信息回调函数
  cb_activeInfo: function (res, opt) {
   
    var that = this;
    if (res.code == 0) {
      wx.hideLoading();
      that.data.loadShow = false;

      //根据数据中有没有join字段来判断用户是否报名
      if (res.data.hasOwnProperty('join')) {
        
        // console.log('已报名===========');
        that.data.pic_joined = true;
        that.data.selectCar = false;
        that.data.applySuss = true;
        // console.log(res.data.join)
        that.data.join_id = res.data.join.id;
        that.data.cxid = res.data.join.cxid;
        that.data.carimg = imgHost + res.data.join.cx_img
        that.data.dreamCar = res.data.join.cx_name
        that.data.total_value = res.data.join.total_value;
        if (!res.data.record.list.length) return;
        that.data.rankData = res.data.record.list;
        var reg = new RegExp('-', 'g');
        res.data.record.list.forEach(function (ele) {
          ele.created_at = ele.created_at.replace(reg, '.').substr(2);
          ele.value = ele.value.substr(0, ele.value.length - 3);
        })
      } else {
        // console.log('未报名');
        that.data.applySuss = false;
      }

    }

    that.setData({
      carimg: that.data.carimg,
      dreamCar: that.data.dreamCar,
      pic_joined: that.data.pic_joined,
      selectCar: that.data.selectCar,
      rankData: that.data.rankData,
      applySuss: that.data.applySuss,
      loadShow: that.data.loadShow,
      total_value: that.data.total_value,
      cxid:that.data.cxid
    })
  },

  //分享入口点入判断用户是否集过能量回调函数
  cb_isfinished: function (res, opt) {
    var that = this;
    // console.log(res);
    if (res.code == 0) {
      wx.hideLoading();
      that.data.loadShow = false;
      that.isHelp(res.data.finished);
    }
    that.setData({
      loadShow: that.data.loadShow
    })
  },


  //是否帮过忙状态
  isHelp: function (finished) {
    var that = this;
    // console.log(finished);
    that.data.loadShow = false;
    if (finished) {
      //已经帮过忙了
      that.data.finished = true;
      that.data.shareBtnBtm = false
    } else {
      //还未帮忙
      that.data.finished = false;
    }
    that.setData({
      shareBtnBtm: that.data.shareBtnBtm,
      finished: that.data.finished,
      loadShow: that.data.loadShow
    })
  },
  stamp: function (day) {
    var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
    return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
  },
  cb_lastOne: function (timestamp) {
    let that = this;
    var day, hour, min, sec, msSec = 9, downTime = {};
    var blockTime = () => {
      var nowTime = new Date();
      var nowTimes = Date.parse(nowTime);
      var reg = new RegExp(':', 'g');
      var endTimes = that.stamp(that.data.endTime);
      var showTimes = endTimes - nowTimes;
      if (showTimes <= 0) {
        that.data.activityEnd = true;
        that.setData({
          Istimestatus: -1,
          activityEnd: that.data.activityEnd
        })

        clearInterval(interval);
        return;
      }else{
        that.data.activityEnd = false;
        that.setData({
          activityEnd: that.data.activityEnd
        })
      }
      // 获取天
      day = Math.floor(showTimes / 1000 / 60 / 60 / 24);
      if (day > 0) {
        downTime = {
          day
        }
      } else {
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

  //点击查看结果
  lookResult: function () {
    wx.switchTab({
      url: '../rankNow/rankNow'
    });
  },

  //填写手机号
  mobileInputEvent: function (e) {
    var that = this;
    that.data.mobile = e.detail.value;
  },

  //点击验证
  getCode: function (phone) {
    var that = this;
    if (that.data.buttonDisable) return false;

    var mobile = that.data.mobile;
    if (!mobile || mobile.trim().length == 0) {
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

  // 验证码回调方法
  cb_verifyCode: function (res, opt) {
    var that = this;
    if (res.code == 1005) {
      wx.showToast({
        title: '请勿频繁请求',
        image: '/pages/images/warning.png',
      })
    }
  },

  //填写验证码
  codeInputEvent: function (e) {
    var that = this;
    that.data.verifyCodeNum = e.detail.value;
  },

  //填写真实姓名
  nameInputEvent: function (e) {
    var that = this;
    that.data.userName = e.detail.value;
  },


  // applySubmit:function(e){
  //   console.log('apply click');
  //   console.log(e);
  //   console.log(e.detail.formId);
  // },

  //点击收集能量
  bargain: function (e) {
    var that = this;
    var args = {};
    var cxid = e.currentTarget.dataset.cxid;
    that.data.cxid = cxid;
    if (!cxid) {
      wx.showToast({
        title: '请选择意向车型',
        image: '/pages/images/warning.png'
      })
      return;
    }


    if (that.data.loadingBloon) {
      return false
    }
    if (!that.data.userName || that.data.userName.trim().length == 0) {
      wx.showToast({
        title: '请填写真实姓名',
        image: '/pages/images/warning.png'
      })
      return false
    }

    if (!that.data.mobile || that.data.mobile.trim().length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        image: '/pages/images/warning.png'
      })
      return false
    }

    if (!that.data.verifyCodeNum || that.data.verifyCodeNum.trim().length == 0) {
      wx.showToast({
        title: '请填写验证码',
        image: '/pages/images/warning.png'
      })
      return false
    };
    wx.showLoading({
      title: '加载中..',
    })
    that.data.loadingBloon = true;
    that.setData({
      loadingBloon: that.data.loadingBloon
    })

    args = {
      activity_id: that.data.activity_id,
      uid: that.data.uid,
      mobile: that.data.mobile,
      code: that.data.verifyCodeNum,
      name: that.data.userName,
      cxid:cxid,
      cx_name: that.data.car_model_name,
      cx_img: that.data.default_img
    };
    if (wx.getStorageSync('idfa')) {
      args.idfa = wx.getStorageSync('idfa')
    }
    that.saleApi.activeAdd(args, 'cb_activeAdd');

  },

  //开始集能量回调方法,返回用户信息
  cb_activeAdd: function (res, opt) {
    var that = this;
    // console.log(res);
    that.data.loadingBloon = false;
    that.setData({
      loadingBloon: that.data.loadingBloon
    })
    if (res.code == 0) {
      wx.hideLoading();
      that.data.pic_joined = true;
      that.data.energyValue = res.data.value;
      //报名成功弹窗显示
      that.data.energySucc = true;
      that.data.join_id = res.data.join.id;
      that.setData({
        pic_joined: that.data.pic_joined,
        energySucc: that.data.energySucc,
        energyValue: that.data.energyValue
      })
    } else {
      wx.showToast({
        title: res.message,
        image: '/pages/images/error.png',
      })
    }

  },

  //点击‘朕知道了’
  onKnow: function (e) {
    var that = this;
    // console.log('onKnow  click');

    //报名状态更新为已报名
    that.data.applySuss = true;
    //关闭报名成功弹窗
    that.data.energySucc = false;

    //分享入口点击我知道了
    that.data.finished = true;
    if (that.data.finished){
      that.data.shareBtnBtm = false
    }
    that.setData({
      shareBtnBtm: that.data.shareBtnBtm,
      applySuss: that.data.applySuss,
      energySucc: that.data.energySucc,
      finished: that.data.finished,
      shareBtnBtm: that.data.shareBtnBtm
    })

    if (!that.data.shareOpen) {
      that.saleApi.activeInfo(that.data.activity_id, that.data.uid, 'cb_activeInfo');
    } else {
      that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
    }
  },

  //从分享入口点击开始集能量
  helpEnergy: function (e) {
    var that = this;
    // console.log(that.data.uid);
    // join_id
    that.saleApi.addEnergy(that.data.activity_id, that.data.uid, that.data.join_id, 'cb_addEnergy');
  },


  //从分享入口点击返回首页
  homeBack: function (e) {
    var that = this;
    app.scene = '1001';
    that.data.join_id = '';
    wx.redirectTo({
      url: '../prop/prop'
    })
  },

  //集能量回调函数
  cb_addEnergy: function (res, opt) {
    var that = this;
    // console.log(res);
    // console.log('参数--',opt);
    if (res.code == 0) {
      that.data.energyValue = res.data.value;
      //报名成功弹窗显示
      // that.data.energySucc = true;
      that.data.finished = true;
      if (that.data.finished) {
        that.data.shareBtnBtm = false
      }
      that.setData({
        // energySucc: that.data.energySucc,
        energyValue: that.data.energyValue,
        finished: that.data.finished,
        shareBtnBtm: that.data.shareBtnBtm
      })
    } else {
      wx.showToast({
        title: res.message,
        image: '/pages/images/warning.png',
      })
    }
  },

  //选择愿望车型
  dreamCar: function () {
    wx.navigateTo({
      url: '../dreamCar/dreamCar'
    })
  },

  //跳转至活动规则页面
  goRule: function () {
    wx.navigateTo({
      url: '../active/active'
    })
  },

  goExpect: function () {
    app.expect = 'true';
    wx.navigateTo({
      url: '../expect/expect'
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    if (!that.data.shareOpen) {
      that.saleApi.activeInfo(that.data.activity_id, that.data.uid, 'cb_activeInfo');
    } else {
      that.saleApi.activeInfo(that.data.activity_id, that.data.shareuid, 'cb_activeInfo');
    }
  },

  onPart: function () {
    wx.redirectTo({
      url: '../prop/prop'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    // console.log('join_id--找人帮忙--',that.data.join_id);
    that.data.forbidShow = true;
    // console.log(that.data.activity_id)
    // console.log(that.data.forbidShow);
    var userName = wx.getStorageSync('userInfo').nickName;
    var cxid = that.data.cxid
    // console.log(that.data.uid);
    if (res.from === 'button') {
      // 来自页面内转发按钮.
      // console.log('helpName --', that.data.helpName, 'app.scene--', app.scene);
      if ((that.data.helpName != '') && (app.scene == '1007' || app.scene == '1044' || app.scene == '1008') && that.data.shareOpen) {
        // console.log('----分享打开-----shareButton', '--helpName', that.data.helpName);
        //接收分享带来的参数
        userName = that.data.helpName;
        cxid = that.data.cxid
      }
      //
      var paramuid = 0;
      if (that.data.shareOpen){
        paramuid = that.data.shareuid;
      } else {
        paramuid = that.data.uid;
      }
      return {
        title: '帮' + userName + '收集绿色能量，抢20000元邦补贴！',
        // path: '/pages/sale/sale?join_id=' + that.data.join_id + '&helpName=' + userName + '&uid=' + that.data.uid,
        path: '/pages/sale/sale?join_id=' + that.data.join_id + '&helpName=' + userName + '&shareuid=' + paramuid + '&activity_id=' + that.data.activity_id
      }
    } else {
      return {
        title: '电动邦购车补贴助您轻松购车',
        // path: '/pages/sale/sale?join_id=' + that.data.join_id + '&uid=' + that.data.uid,
        // path: '/pages/sale/sale?join_id=' + that.data.join_id,
        path: 'pages/prop/prop'
      }
    }

  }
})