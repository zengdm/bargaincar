
/**
 * 微信统一接口类
 *
 * @author fuqiang
 */

import { baseapi } from "./baseapi";

function saleApi(page) {
  // 继承基类
  baseapi.call(this);
  // 引入页面page类对象
  this.init(page);
  // this.ckPromission();
}

// 属性方法
saleApi.prototype = {

  // 接口地址
  apiURL: {
    //用户参加活动的信息
    activeInfo: '/globals/wsuser/info',
    //用户报名参加活动
    activeAdd: '/globals/wsjoin/add',
    //分享入口点入判断用户是否集过能量
    isfinished: '/globals/wsuser/isfinished',
    // 能量排行榜
    rankLink: '/globals/wsjoin/top',
    //集能量
    addEnergy: '/globals/wsrecord/add',
    //保存用户意向车型
    saveCar: '/globals/wswish/add',
    //下期报名
    nextApply: '/globals/wsnjoin/add',
    //本期
    wsactivity: '/globals/wsactivity',
    list: '/globals/wsjoin/list',
    // 往期活动
    pastList: '/globals/wsactivity/list',
    joinedList: '/globals/wsuser/list',
    //分享数字
    recordShare: '/globals/wsrecord/record'
  },

  /**
   *  用户参加活动的信息
   */
  activeInfo: function (activity_id, uid, callback, args) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    args['activity_id'] = activity_id;
    args['uid'] = uid;
    that.postURLData(that.apiURL['activeInfo'], args, callback);
  },


  /**
   *  用户报名参加活动
   */
  activeAdd: function (args, callback) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['activeAdd'], args, callback);
  },

  /**
     *  分享入口点入判断用户是否集过能量
     */
  isfinished: function (args, callback) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['isfinished'], args, callback);
  },

  // 能量排行榜
  rankLink: function (args, callback) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['rankLink'], args, callback);
  },

  // 集能量
  addEnergy: function (activity_id,uid, join_id, callback, args) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    args['activity_id'] = activity_id;
    args['uid'] = uid;
    args['join_id'] = join_id;
    that.postURLData(that.apiURL['addEnergy'], args, callback);
  },

  //保存用户意向车型
  saveCar: function (args, callback) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['saveCar'], args, callback);
  },

  //保存用户意向车型
  nextApply: function (args, callback) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['nextApply'], args, callback);
  },


  //本期下期
  wsactivity: function (callback) {
    var that = this;
    that.postURLData(that.apiURL['wsactivity'], {}, callback);
  },
  //本期下期
  list: function (args,callback) {
    var that = this;
    that.postURLData(that.apiURL['list'], args, callback);
  },
  //往期活动
  pastList: function(args,callback){
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['pastList'], args, callback);
  },
  joinedList: function (args, callback) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    that.postURLData(that.apiURL['joinedList'], args, callback);
  },

  // 分享数字
  recordShare: function (activity_id, uid, join_id, callback, args) {
    var that = this;
    args = typeof (args) != 'object' ? {} : args;
    args['activity_id'] = activity_id;
    args['uid'] = uid;
    args['join_id'] = join_id;
    that.postURLData(that.apiURL['recordShare'], args, callback);
  },


}

// 声明类方法
module.exports.saleApi = saleApi;