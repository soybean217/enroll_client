<template>
  <div>
    <van-cell-group>
      <van-cell title="活动时间" :value="activityInfo.activityDateTime" />
      <van-cell title="活动名称" :value="activityInfo.activityTitle" />
      <van-cell title="组织者" :value="activityInfo.founderNickName" />
      <van-cell title="活动地点" :value="activityInfo.activityAddress" />
      <van-cell v-if='activityInfo.enrollPrice>0' title="确认天数" :value="activityInfo.confirmDayCount" />
      <van-cell title="活动费用" :value="activityInfo.enrollPrice?activityInfo.enrollPrice+'元/人':'免费'" />
      <van-button size="large" type="primary" v-on:click="enroll" v-if="!checkEnrolled()">{{enrollButtonText}}</van-button>
      <van-button size="large" type="primary" v-on:click="cancelEnroll" v-if="canCancel">取消报名</van-button>
      <van-button size="large" type="warn" v-on:click="manageApply" v-if="isFounder">{{manageButtonText}}</van-button>
      <van-cell title="已报名人数" :value="activityInfo.applys.length+'/'+activityInfo.numberMax" />
      <div>
        <img v-for="item in activityInfo.applys" :src="procHeadImg(item.headimgurl)" />
      </div>
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
    <div v-transfer-dom>
      <confirm v-model="showNickName" show-input ref="confirmNickName" title="显示的昵称" @on-confirm="onConfirmNickName" @on-show="onShowNickName">
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showEnrollNumber" show-input :input-attrs="{type: 'number'}" ref="confirmEnrollNumber" title="报名人数" @on-confirm="onConfirmEnrollNumber" @on-show="onShowEnrollNumber">
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert v-model="showQrcodeAlert" :title="qrcodeTitle" @on-confirm="freshPage"><img height="200px" width="200px" :src='qrcodeSrc' /></alert>
    </div>
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
      canCancel: false,
      isFounder: false,
      showEnrollNumber: false,
      showNickName: false,
      showQrcodeAlert: false,
      enrollButtonText: '已报名',
      manageButtonText: '管理报名',
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
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    onShowNickName() {
      this.$refs.confirmNickName.setInputValue(global.ACTIVITYINFO.WECHATUSER.nickname)
    },
    onShowEnrollNumber() {
      this.$refs.confirmEnrollNumber.setInputValue(1)
    },
    enrollActivity() {
      var app = this
      this.$ajax({
          method: 'post',
          url: 'ajax/enrollActivity',
          data: {
            activityId: this.$route.query.activity_id,
            displayNickName: this.enrollNickName,
            enrollNumber: this.enrollNumber,
          },
        })
        .then(function(response) {
          console.log(response);
          var rev = response.data
          if (rev.type == 'unifiedOrder') {
            wx.checkJsApi({
              jsApiList: ['chooseWXPay'],
              success: function(res) {
                var unifiedOrderData = rev.data
                unifiedOrderData.success = function(res) {
                  // alert(JSON.stringify(res));
                  //{"errMsg":"chooseWXPay:ok"}
                  if (res.errMsg == "chooseWXPay:ok") {
                    alert('支付成功');
                    app.freshPage()
                  } else {
                    alert(JSON.stringify(res))
                  }
                }
                console.log('unifiedOrderData', unifiedOrderData)
                wx.chooseWXPay(unifiedOrderData)
              }
            });
          } else if (rev.status = 'ok') {
            app.freshPage()
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onConfirmNickName(value) {
      this.enrollNickName = value
      if (this.activityInfo.enrollAgentSwitch) {
        this.showNickName = false;
        this.showEnrollNumber = true;
      } else {
        this.enrollActivity()
      }

    },
    onConfirmEnrollNumber(value) {
      this.enrollNumber = value
      this.enrollActivity()
    },
    manageApply: function() {
      this.$router.push({ name: 'PageApplysManage', query: { activity_id: this.activityInfo._id, } })
    },
    enroll: function() {
      // if (false) {
      if (global.ACTIVITYINFO.WECHATUSER.subscribe) {
        this.showNickName = true;
      } else {
        var app = this
        this.$ajax({
            method: 'post',
            url: 'ajax/enrollQrcode',
            data: {
              activityId: this.$route.query.activity_id,
              from: global.getUrlParam('f'),
            },
          })
          .then(function(response) {
            console.log(response);
            var rev = response.data
            app.qrcodeSrc = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + encodeURI(rev.ticket)
            app.showQrcodeAlert = true
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    cancelEnroll: function() {
      // if (false) {
      var app = this
      this.$ajax({
          method: 'post',
          url: 'ajax/cancelEnrollByCustomer',
          data: {
            activityId: this.$route.query.activity_id,
          },
        })
        .then(function(response) {
          console.log('cancelEnroll rsp:', response.data);
          var rev = response.data
          if (rev.status == 'ok') {
            setTimeout(app.freshPage(), 1000)
          } else {
            alert(rev.msg)
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkCanCancel: function() {
      if (this.checkIsFounder()) {
        return false
      }
      if (this.checkEnrolled()) {
        return true
      } else {
        return false
      }
    },
    checkEnrolled: function() {
      for (var i in this.activityInfo.applys) {
        if (global.ACTIVITYINFO.WECHATUSER.unionid == this.activityInfo.applys[i].unionId) {
          return true
        }
      }
      return false
    },
    checkIsFounder: function() {
      if (global.ACTIVITYINFO.WECHATUSER.unionid == this.activityInfo.founderUnionId) {
        return true
      }
      return false
    },
    checkGlobalPara: function() {
      console.log('checkGlobalPara')
      if (global.ACTIVITYINFO.WECHATUSER) {
        this.isEnrolled = this.checkEnrolled()
        if (!this.isEnrolled) {
          this.enrollButtonText = '报名'
        }
        console.log('mounted this.isEnrolled', this.isEnrolled)
        this.$vux.loading.hide()
      } else {
        if (Date.now() - this.lastFetchTime > 30000) {
          window.location.href = global.updateUrl(window.location.href)
        } else {
          setTimeout(this.checkGlobalPara(), 500)
        }
      }
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
            app.qrcodeTitle = '扫描二维码报名“' + app.activityInfo.founderNickName + '”组织的' + app.activityInfo.activityTitle
            app.isFounder = app.checkIsFounder()
            app.canCancel = app.checkCanCancel()
            app.checkGlobalPara()
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
  mounted() {},
  beforeMount() {
    this.freshPage()
  },
}

</script>
<style>


</style>
