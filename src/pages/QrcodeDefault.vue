<template>
  <div style="text-align:center">
    <div>
      <br>请先关注，才能收到报名的通知消息</div>
    <img :src="mpQrcode()">
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'PageQrcodeDefault',
  methods: {
    mpQrcode() {
      return global.ACTIVITYINFO.globalConfig.thumbnailsDomain + global.ACTIVITYINFO.globalConfig.mpQrcode
    },
  },
  mounted() {},
}

</script>
<style>


</style>
