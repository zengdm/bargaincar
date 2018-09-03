// pages/inc/component/userInfo/userInfo.js
// pages/inc/login/login.js
import { userApi } from '../../api/userApi.js'
import { saleApi } from '../../api/saleApi.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: false,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: ''
  },
  attached: function () {
    var that = this;
    // console.log('进入自定义组件');
    wx.hideLoading();
    that.userApi = new userApi(that);
    that.saleApi = new saleApi(that);
  },

  /**
   * 组件的方法列表
   */
  methods: {

    cb_wsactivity: function (result, opt) {
      var that = this;
      if (result.code == 0) {
        that.data.activity_id = result.data.current.id;
        that.data.next_activity_id = result.data.next.id;

        wx.login({
          success: function (res) {
            // 查看是否授权
            wx.getSetting({
              success: function (resp) {
                // console.log('getSetting====', resp);
                if (resp.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                  wx.getUserInfo({
                    success: function (user) {
                      var userData = {};
                      userData['code'] = res.code;
                      userData['encryptedData'] = user.encryptedData;
                      userData['iv'] = user.iv;
                      userData['userInfo'] = that.data.userInfo;
                      // console.log('登录userData----------', userData);
                      wx.request({
                        // url: 'http://item.dd-img.com/globals/wsuser/getuser',
                        url: 'https://item.diandong.com/globals/wsuser/getuser', 
                        data: {
                          code: userData.code,
                          encryptedData: userData.encryptedData,
                          iv: userData.iv,
                          avatar: that.data.userInfo.avatarUrl,
                          nickname: that.data.userInfo.nickName,
                          // join_id: '1',
                          activity_id: that.data.activity_id,
                          next_activity_id: that.data.next_activity_id,
                        },
                        header: {
                          'content-type': 'application/json' // 默认值
                        },
                        method: 'POST',
                        success: function (res) {
                          wx.hideLoading();
                          // console.log('登录接口过来的参数--', res.data.data);
                          userData['uid'] = res.data.data.uid;
                          wx.setStorage({
                            key: 'userLogin',
                            data: userData,
                          });
                          // console.log(userData);
                          // that._callPage('accreditEvent', userData);

                          var pages = getCurrentPages()    //获取加载的页面
                          var currentPage = pages[pages.length - 1]    //获取当前页面的对象
                          var url = currentPage.route    //当前页面url

                          //如果当前页面为个人主页 则不继续跳转 避免进入死循环
                          if (url == 'pages/sale/sale' || url == 'pages/rank/rank' || url == 'pages/next/next' || url == 'pages/nextshow/nextshow' || url == 'pages/rankNow/rankNow' || url == 'pages/past/past' ) {
                            // console.log('event', '1')
                            getApp().ddbevent.emit('callme', res.data.data);
                            // console.log('event', '2')
                          } 

                        }
                      })
                    }
                  })
                }
              }
            })
          }
        });

      }

    },
    bindgetuserinfo: function (e) {
      var that = this;
      // console.log(e.detail.userInfo);
      if (e.detail.userInfo) {
        // console.log(e.detail.userInfo);
        wx.setStorage({
          key: 'userInfo',
          data: e.detail.userInfo,
        });

        that.data.userInfo = e.detail.userInfo;

        that.saleApi.wsactivity('cb_wsactivity');


        that.setData({
          show: false
        })

      } else {
        // console.log('用户点击了拒绝授权');
      }
    },

    // hideUser: function (e) {
    //   var that = this;
    //   that.setData({
    //     show: false
    //   })
    // },

    catchtouchmove: function () {

    }







  }
})
