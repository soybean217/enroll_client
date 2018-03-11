<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'App',
  mounted() {},
  created() {
    console.log('App.vue created')
    var app = this
    console.log(location)
    app.$ajax.get("ajaxPub/signWechat")
      .then(function(response) {
        var rev = response.data
        console.log(rev)
        if (!rev.wechatUserInfo) {
          app.$ajax({
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
            success: function(res) {}
          });
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

</script>
<style>
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}

</style>
