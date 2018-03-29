// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import './globalInfo'
import wx from 'weixin-js-sdk'

Vue.config.productionTip = false
Vue.prototype.$ajax = axios
router.beforeEach((to, from, next) => {
  if (global.ACTIVITYINFO.WECHATUSER) {
    next()
  } else {
    axios.get("ajaxPub/signWechat")
      .then(function(response) {
        var rev = response.data
        console.log(rev)
        if (!rev.wechatUserInfo) {
          axios({
              method: 'post',
              url: 'ajhrefRecord',
              data: {
                href: location.href,
              },
            })
            .then(function(response) {
              console.log(response.data)
              if (response.data.status = 'ok') {
                location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + rev.appId + '&redirect_uri=' + response.data.loginUrl + '&response_type=code&scope=snsapi_base&state=' + response.data.state + '#wechat_redirect'
              } else {
                alert('error when get state')
              }
            }).catch(function(error) {
              alert('error when get state')
              console.log(error);
            });
        }
        global.ACTIVITYINFO.WECHATUSER = rev.wechatUserInfo
        wx.config({
          debug: rev.debug,
          appId: rev.appId,
          timestamp: rev.timestamp,
          nonceStr: rev.nonceStr,
          signature: rev.signature,
          jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "onVoicePlayEnd", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
        })
        wx.ready(function() {
          wx.checkJsApi({
            jsApiList: ['chooseImage'],
            success: function(res) {
              next()
            }
          });
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
