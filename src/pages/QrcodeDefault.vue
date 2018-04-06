<template>
  <div style="text-align:center">
    <br>请先关注，才能收到报名的通知消息
    <img :src="mpQrcode()">
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'PageQrcodeDefault',
  methods: {
    mpQrcode() {
      return global.ACTIVITYINFO.globalConfig.mpQrcode

    },
  },
  mounted() {},
}

</script>
<style>


</style>
