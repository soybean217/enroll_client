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
    this.$ajax.get("ajaxPub/signWechat")
      .then(function(response) {
        var rev = response.data
        console.log(rev)
        if (!rev.wechatUserInfo) {
          alert('please check session.wechatUserInfo')
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
