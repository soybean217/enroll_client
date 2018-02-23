<template>
  <div>
    <van-cell-group>
      <van-cell v-for="apply in activityInfo.applys" :title="apply.displayNickName" :value="actText(apply)" :key="apply" />
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button } from 'vant'
import { Loading, LoadingPlugin, Confirm, Alert, TransferDomDirective as TransferDom } from 'vux'
import wx from 'weixin-js-sdk'
Vue.use(LoadingPlugin)

export default {
  directives: {
    TransferDom
  },
  components: {
    [Stepper.name]: Stepper,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    Loading,
    Confirm,
    Alert,
  },
  name: 'PageActivityView',
  data() {
    return {
      isEnrolled: false,
      isFounder: false,
      showNickName: false,
      showQrcodeAlert: false,
      enrollButtonText: '已报名',
      activityInfo: {
        activityDateTime: '',
        activityTitle: '',
        activityAddress: '',
      },
      enrollNickName: '',
      enrollNumber: 1,
      lastFetchTime: Date.now(),
      qrcodeSrc: '',
      qrcodeTitle: '扫描二维码报名'
    }
  },
  methods: {
    actText(apply) {
      if (apply.unionId == this.activityInfo.founderUnionId) {
        return ''
      } else if (apply.status == 'pass') {
        return '已通过【管理】'
      } else {
        return '等待审核【管理】'
      }
    },
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    freshPage: function() {
      this.$vux.loading.show({
        text: 'Loading'
      })
      if (this.$route.query.activity_id) {
        var app = this
        this.$ajax.get("ajax/getActivity?activity_id=" + this.$route.query.activity_id)
          .then(function(response) {
            var rev = response.data
            console.log('ajax/getActivity?\n', rev)
            app.activityInfo = rev.data
            app.$vux.loading.hide()
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    console.log(window.location.href)
  },
  beforeMount() {
    this.freshPage()
  },
}

</script>
<style>


</style>
