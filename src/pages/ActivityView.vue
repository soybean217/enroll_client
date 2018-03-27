<template>
  <div>
    <van-cell-group>
      <van-row class='styleActivityTitle'>
        <van-col span="12"><span class='bigTitle'>{{activityInfo.activityTitle}}</span>
          <br><span>报名人数：{{enrollStatistics()}}</span>
        </van-col>
        <van-col span="12" class='styleActivityTitleRight'>
          <van-button size="mini" type="primary">名单</van-button>
          <van-button size="mini" type="primary">分享</van-button>
        </van-col>
      </van-row>
      <van-row class='styleActivityTitle'>
        <van-col span="24">
          活动地点：{{activityInfo.activityAddress}}
          <br>活动场地：{{activityInfo.activityField}}
          <br>活动日期：{{activityDate}}
          <br>活动时间：{{activityTime}}
          <br>&nbsp;组&nbsp;织&nbsp;者：{{activityInfo.founderNickName}}
          <br>活动费用：{{displayPrice()}}
        </van-col>
      </van-row>
      <van-row class='styleActivityTitle'>
        <van-col span="7">
          活动公告：
        </van-col>
        <van-col span="17" v-html='displayNotice()'>
        </van-col>
      </van-row>
      <van-button size="large" type="primary" v-on:click="enroll" v-if="!checkEnrolled()">{{enrollButtonText}}</van-button>
      <van-button size="large" type="primary" v-on:click="cancelEnroll" v-if="canCancel">取消报名</van-button>
      <van-button size="large" type="warn" v-on:click="manageApply" v-if="isFounder">{{manageButtonText}}</van-button>
      <van-button size="large" type="danger" v-on:click="deleteActivity" v-if="isFounder">{{deleteActiviyButtonText}}</van-button>
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
    <!-- <div v-transfer-dom>
  <confirm v-model="showNickName" show-input ref="confirmNickName" title="显示的昵称" @on-confirm="onConfirmNickName" @on-show="onShowNickName" @on-cancel="" @on-hide="">
  </confirm>
</div>
 -->
    <!-- <div v-transfer-dom>
      <confirm v-model="showEnrollNumber
" show-input :input-attrs="{type: 'number'}" ref="confirmEnrollNumber" title="报名人数" @on-confirm="onConfirmEnrollNumber" @on-show="onShowEnrollNumber">
      </confirm>
    </div> -->
    <div v-transfer-dom>
      <alert v-model="showQrcodeAlert" :title="qrcodeTitle" @on-confirm="freshPage"><img height="200px" width="200px" :src='qrcodeSrc' /></alert>
    </div>
    <van-dialog v-model="showNickName" @confirm="onConfirmEnrollNickName" show-cancel-button>
      <div class="styleDialogTitle">请输入活动伙伴认识的名字</div>
      <van-field v-model="enrollNickName" label="显示昵称" placeholder="请输入在活动中的昵称" />
    </van-dialog>
    <van-dialog v-model="showEnrollNumber" @confirm="onConfirmEnrollNumber" show-cancel-button>
      <div class="styleDialogTitle">请输入报名人数</div>
      <van-field v-model="enrollNumber" label="报名人数" placeholder="" type='number' />
    </van-dialog>
    <!-- <tabbar-activity></tabbar-activity> -->
    <!-- <tabbar-vant></tabbar-vant> -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Row, Col, Stepper, Cell, CellGroup, Button, Dialog } from 'vant'
import { Loading, LoadingPlugin, Confirm, ConfirmPlugin, Alert, TransferDomDirective as TransferDom } from 'vux'
// import tabbarActivity from '../components/tabbar-activity'
// import tabbarVant from '../components/tabbar-vant'
import wx from 'weixin-js-sdk'
Vue.use(LoadingPlugin)
Vue.use(Dialog);

export default {
  directives: {
    TransferDom
  },
  components: {
    [Stepper.name]: Stepper,
    [Row.name]: Row,
    [Col.name]: Col,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    Loading,
    Confirm,
    Alert,
    // tabbarVant,
    // tabbarActivity,
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
      enrollButtonText: '报名',
      manageButtonText: '管理报名',
      deleteActiviyButtonText: '删除活动',
      activityInfo: {
        activityDateTime: '',
        activityTitle: '',
        activityAddress: '',
      },
      enrollNickName: '',
      enrollNumber: 1,
      lastFetchTime: Date.now(),
      qrcodeSrc: '',
      qrcodeTitle: '扫描二维码报名',
      activityDate: '',
      activityTime: '',
    }
  },
  methods: {
    enrollStatistics() {
      var result = 0
      for (var apply of this.activityInfo.applys) {
        if (apply.status == 'pass') {
          result += apply.enrollNumber
        }
      }
      return result + '/' + this.activityInfo.numberMax
    },
    displayPrice() {
      if (this.activityInfo.enrollPrice > 0 && this.activityInfo.enrollPriceFemale > 0) {
        return '男' + this.activityInfo.enrollPrice + '元，女' + this.activityInfo.enrollPriceFemale + '元'
      } else if (this.activityInfo.enrollPrice == 0 && this.activityInfo.enrollPriceFemale == 0) {
        return '免费'
      }
    },
    displayNotice() {
      if (this.activityInfo.activityNotice) {
        return this.activityInfo.activityNotice.toString().replace(/\n/g, '<br>')
      } else {
        return ''
      }

      // return this.activityInfo.activityNotice
    },
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    onShowNickName() {
      this.$refs.confirmNickName.setInputValue(global.ACTIVITYINFO.WECHATUSER.nickname)
    },
    onShowEnrollNumber() {
      this.$refs.confirmEnrollNumber.setInputValue(1)
    },
    deleteActivity() {
      var app = this
      this.$ajax({
          method: 'post',
          url: 'ajax/delActivity',
          data: {
            activity_id: this.$route.query.activity_id,
          },
        })
        .then(function(response) {
          console.log(response.date);
          var rev = response.data
          if (rev.status == 'ok') {
            app.$router.push({ name: 'PageActivityFoundList' })
          } else if (rev.msg == 'please delete all other apply') {
            alert('请先删除所有申请，')
          } else if (rev.msg) {
            alert(rev.msg)
          } else {
            alert('error data when delActivity')
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
    onConfirmEnrollNickName() {
      if (this.activityInfo.enrollAgentSwitch) {
        this.showNickName = false;
        this.showEnrollNumber = true;
      } else {
        this.enrollActivity()
      }
    },
    onConfirmEnrollNumber() {
      this.enrollActivity()
    },
    manageApply: function() {
      this.$router.push({ name: 'PageApplysManage', query: { activity_id: this.activityInfo._id, } })
    },
    enroll() {
      // if (false) {
      console.log(global.ACTIVITYINFO.WECHATUSER)
      if (global.ACTIVITYINFO.WECHATUSER.subscribe) {
        this.showNickName = true;
        this.enrollNickName = global.ACTIVITYINFO.WECHATUSER.nickname
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
        this.isFounder = this.checkIsFounder()
        this.canCancel = this.checkCanCancel()
        console.log('mounted this.isEnrolled', this.isEnrolled)
        this.$vux.loading.hide()
      } else {
        if (Date.now() - this.lastFetchTime > 10000) {
          window.location.href = global.updateUrl(window.location.href)
        } else {
          setTimeout(this.checkGlobalPara(), 1000)
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
            if (rev.status == 'ok') {
              app.activityInfo = rev.data
              app.qrcodeTitle = '扫描二维码报名“' + app.activityInfo.founderNickName + '”组织的' + app.activityInfo.activityTitle
              app.activityDate = global.formatDateToDayAndWeek(app.activityInfo.activityDateTime)
              app.activityTime = global.formatTimeDuring(app.activityInfo)
              app.checkGlobalPara()
            } else {
              alert(rev.msg)
              app.$router.push({ name: 'PageActivityApplyList' })
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
.styleActivityTitle {
  margin: 15px;
  font-size: 90%;
}

.bigTitle {
  font-size: 140%
}

.styleActivityTitleRight {
  text-align: right;
  margin-top: 15px;
}

.styleDialogTitle {
  text-align: center;
  margin: 10px
}

</style>
