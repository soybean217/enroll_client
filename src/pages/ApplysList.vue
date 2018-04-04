<template>
  <div>
    <div style="height:60px;margin-bottom: 20px;margin: 30px;font-size: 200%;text-align: center;">{{activityInfo.activityTitle}}
      <br>人员名单</div>
    <van-cell-group>
      <van-cell v-for="apply in activityInfo.applys" v-if="apply.status=='pass'" :title="displayTitle(apply)" :icon="displayIcon(apply)" :value="displayAgent(apply)" :key="apply" />
    </van-cell-group>
    </actionsheet>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button } from 'vant'
import wx from 'weixin-js-sdk'

export default {
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
  },
  name: 'PageApplysList',
  data() {
    return {
      selectedApply: {},
      showMenu: false,
      activityInfo: {},
    }
  },
  methods: {
    displayTitle(apply) {
      return apply.seq + ' . ' + apply.displayNickName
    },
    displayAgent(apply) {
      if (apply.enrollNumber + apply.enrollNumberFemale > 1) {
        return (apply.enrollNumber >= 1 ? apply.enrollNumber + '男' : '') + (apply.enrollNumberFemale >= 1 ? apply.enrollNumberFemale + '女' : '')
      } else {
        return ''
      }
    },
    displayIcon(apply) {
      if (apply.wechatUserInfo.sex == 2) {
        return 'password-not-view'
      } else {
        return 'contact'
      }
    },
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    freshPage: function() {
      if (this.$route.query.activity_id) {
        var app = this
        this.$ajax.get("ajax/getActivity?activity_id=" + this.$route.query.activity_id)
          .then(function(response) {
            var rev = response.data
            console.log('ajax/getActivity?\n', rev)
            app.activityInfo = rev.data
            var seq = 1
            for (var apply of app.activityInfo.applys) {
              if (apply.status == 'pass') {
                apply.seq = seq
                seq += (apply.enrollNumber + apply.enrollNumberFemale)
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    this.freshPage()
  },
  beforeMount() {},
}

</script>
<style>


</style>
