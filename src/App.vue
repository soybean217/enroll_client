<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
import $ from 'jquery'
console.log('App wx', wx)
export default {
  name: 'App',
  mounted() {
    $.ajax({
      url: "https://www.dushujielong.com/nodeDev/ajaxPub/signWechat",
      type: "get",
      contentType: "application/json",
      success: function(result) {
        var rev = JSON.parse(result);
        console.log('rev', rev)
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
              console.log('wx.checkJsApi', arguments)
            }
          });
        });
      },
      error: function(xhr, status) {
        alert(JSON.stringify(status));
      },
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
