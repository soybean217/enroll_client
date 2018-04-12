<template>
  <div>
    <div class="contentActivity">
      <img v-lazy="imageTop" style="width:100%" />
      <van-cell-group>
        <van-row class='styleActivityTitle'>
          <van-col span="12"><span class='bigTitle'>{{activityInfo.activityTitle}}</span>
            <br><span>报名人数：{{enrollStatisticsText()}}</span>
          </van-col>
          <van-col span="12" class='styleActivityTitleRight'>
            <van-button size="small" v-on:click="routeToApplyList()" type="primary">名单</van-button>
            <van-button size="small" v-on:click="showShareAction()" type="primary">分享</van-button>
          </van-col>
        </van-row>
        <van-row class='styleActivityTitle'>
          <van-col span="24">
            活动地点：{{activityInfo.activityAddress}}
            <br>
            <span v-if="activityInfo.activityField">活动场地：{{activityInfo.activityField}}
            <br>
          </span> 活动日期：{{activityDate}}
            <br>活动时间：{{activityTime}}
            <br>&nbsp;组&nbsp;织&nbsp;者：{{activityInfo.founderNickName}}
            <br>活动费用：{{displayPrice()}}
          </van-col>
        </van-row>
        <van-row class='styleActivityTitle' v-if="activityInfo.activityNotice">
          <van-col span="8">
            活动公告：
          </van-col>
          <van-col span="16" v-html='displayNotice()'>
          </van-col>
        </van-row>
        <van-row v-if="isFounder">
          <van-button type="warn" v-on:click="manageApply">{{manageButtonText}}</van-button>
          <van-button type="danger" v-on:click="deleteActivity">{{deleteActiviyButtonText}}</van-button>
          <van-button type="primary" v-on:click="copyActivity">复制活动</van-button>
        </van-row>
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
      <!-- <van-dialog v-model="showQrcodeAlert" @confirm="freshPage">
        <div class="styleDialogTitle">{{qrcodeTitle}}</div>
        <div class="styleDialogTitle">
          <img height="200px" width="200px" :src='qrcodeSrc' />
        </div>
      </van-dialog> -->
      <van-dialog v-model="showNickName" @confirm="onConfirmEnrollNickName" show-cancel-button>
        <div class="styleDialogTitle">请输入活动伙伴认识的名字</div>
        <van-field v-model="enrollNickName" label="显示昵称" placeholder="请输入在活动中的昵称" />
      </van-dialog>
      <van-dialog v-model="showEnrollNumber" @confirm="onConfirmEnrollNumber" show-cancel-button>
        <div class="styleDialogTitle">请输入报名人数</div>
        <van-field v-model="enrollNumber" label="报名男生" placeholder="" type='number' />
        <van-field v-model="enrollNumberFemale" label="报名女生" placeholder="" type='number' />
      </van-dialog>
      <!-- <van-dialog v-model="showTextShare" @confirm="onConfirmEnrollNumber" confirmButtonText="复制文字">
        <van-field v-model="textShare" label="" type="textarea" :autosize="{ maxHeight: 300, minHeight: 50 }" />
      </van-dialog> -->
      <van-actionsheet v-model="showFollow" title="识别二维码完成报名">
        <div class="styleDialogTitle">{{qrcodeTitle}}</div>
        <div class="styleDialogTitle">
          <img height="200px" width="200px" :src='qrcodeSrc' />
        </div>
        <div class="styleDialogTitle">长按上图，识别二维码</div>
      </van-actionsheet>
      <van-actionsheet v-model="showShareText" title="文字分享">
        <van-field v-model="textShare" id="foo" label="" type="textarea" :autosize="{ maxHeight: 300, minHeight: 50 }" />
        <div style="text-align:center">
          <van-button type="primary" class="btn" data-clipboard-target="#foo">复制文字</van-button>
        </div>
      </van-actionsheet>
      <van-actionsheet v-model="showShare" :actions="shareActions" cancel-text="取消" />
      <!-- <tabbar-activity></tabbar-activity> -->
      <!-- <tabbar-vant></tabbar-vant> -->
    </div>
    <div class="r">
      <van-button size="large" type="primary" v-on:click="enroll" v-if="!checkEnrolled()">{{enrollButtonText}}</van-button>
      <van-button size="large" type="danger" v-on:click="cancelEnroll" v-if="canCancel">取消报名</van-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Row, Col, Stepper, Cell, CellGroup, Button, Lazyload, Dialog, Actionsheet } from 'vant'
// import tabbarActivity from '../components/tabbar-activity'
// import tabbarVant from '../components/tabbar-vant'
import wx from 'weixin-js-sdk'
import Clipboard from 'clipboard';
Vue.use(Dialog);
Vue.use(Lazyload)

export default {
  name: 'PageActivityView',
  components: {
    [Stepper.name]: Stepper,
    [Row.name]: Row,
    [Col.name]: Col,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Actionsheet.name]: Actionsheet,
    // tabbarVant,
    // tabbarActivity,
  },
  data() {
    return {
      textAreaSize: { maxHeight: 100, minHeight: 50 },
      imageTop: 'http://pic01-1253796995.file.myqcloud.com/badminton/badminton_top_180329.jpg',
      isEnrolled: false,
      canCancel: false,
      isFounder: false,
      showShare: false,
      showEnrollNumber: false,
      showNickName: false,
      // showTextShare: false,
      showShareText: false,
      // showQrcodeAlert: false,
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
      enrollNumberFemale: 0,
      lastFetchTime: Date.now(),
      qrcodeSrc: '',
      qrcodeTitle: '扫描二维码报名',
      activityDate: '',
      activityTime: '',
      textShare: '',
      showFollow: false,
      shareActions: [{
          name: '微信分享',
          subname: '点击右上角 ···',
        },
        {
          name: '文字分享',
          subname: '可复制到微信聊天',
          callback: this.openTextShare,
        }
      ]
    }
  },
  methods: {
    procTextShare() {
      this.textShare = global.formatDateToDayAndWeek(this.activityInfo.activityDateTime) + '\n'
      this.textShare += global.formatTimeDuring(this.activityInfo) + '\n'
      this.textShare += this.activityInfo.activityAddress + '\n'
      if (this.activityInfo.activityField) {
        this.textShare += this.activityInfo.activityField + '\n'
      }
      this.textShare += this.activityInfo.founderNickName + ' 组织的 ' + this.activityInfo.activityTitle + '\n'
      this.textShare += '费用：' + this.displayPrice() + '\n'
      if (this.activityInfo.activityNotice) {
        this.textShare += this.activityInfo.activityNotice + '\n'
      }
      this.textShare += '报名情况：' + this.enrollStatisticsText() + '\n'
      var current = 1
      var count = this.enrollStatistics()
      var totalLength = String(count).length
      for (var apply of this.activityInfo.applys) {
        if (apply.status == 'pass') {
          this.textShare += this.addZero(totalLength, current) + '.' + apply.displayNickName + '\n'
          current++
          for (var i = 1; i < parseInt(apply.enrollNumber + apply.enrollNumberFemale); i++) {
            this.textShare += this.addZero(totalLength, current) + '.' + apply.displayNickName + '+' + i + '\n'
            current++
          }
        }
      }
      this.textShare += '报名地址：' + location.href
    },
    addZero(totalLength, input) {
      var tmp = String(input)
      var result = ''
      for (var i = tmp.length; i < totalLength; i++) {
        result += '0'
      }
      return result + tmp
    },
    openTextShare() {
      this.showShare = false
      this.procTextShare()
      this.showShareText = true
    },
    showShareAction() {
      this.showShare = true
    },
    routeToApplyList() {
      this.$router.push({ name: 'PageApplysList', query: { activity_id: this.$route.query.activity_id, } })
    },
    enrollStatistics() {
      var result = 0
      for (var apply of this.activityInfo.applys) {
        if (apply.status == 'pass') {
          result += parseInt(apply.enrollNumber + apply.enrollNumberFemale)
        }
      }
      return result
    },
    enrollStatisticsText() {
      return this.enrollStatistics() + '/' + this.activityInfo.numberMax
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
    },
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    deleteActivity() {
      this.$dialog.confirm({
        title: '确认',
        message: '删除活动？'
      }).then(() => {
        // on confirm
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
      }).catch(() => {
        // on cancel
      });
    },
    copyActivity() {
      this.$router.push({ name: 'PageActivityEdit', query: { activity_id: this.$route.query.activity_id, } })
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
            enrollNumberFemale: this.enrollNumberFemale,
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
        if (global.ACTIVITYINFO.WECHATUSER.sex == 2) {
          this.enrollNumber = 0
          this.enrollNumberFemale = 1
        } else {
          this.enrollNumber = 1
          this.enrollNumberFemale = 0
        }
        this.showEnrollNumber = true;
      } else {
        this.enrollActivity()
      }
    },
    onConfirmEnrollNumber() {
      if (this.enrollNumber + this.enrollNumberFemale > 0) {
        this.enrollActivity()
      }
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
        this.showFollow = true
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
            // app.showQrcodeAlert = true
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    cancelEnroll: function() {
      this.$dialog.confirm({
        title: '确认',
        message: '是否取消报名？'
      }).then(() => {
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
              app.freshPage()
            } else {
              alert(rev.msg)
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }).catch(() => {
        // on cancel
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
    // checkGlobalPara: function() {
    //   console.log('checkGlobalPara')
    //   if (global.ACTIVITYINFO.WECHATUSER) {

    //   } else {
    //     if (Date.now() - this.lastFetchTime > 10000) {
    //       window.location.href = global.updateUrl(window.location.href)
    //     } else {
    //       setTimeout(this.checkGlobalPara(), 1000)
    //     }
    //   }
    // },
    freshPage: function() {
      if (this.$route.query.activity_id) {
        var app = this
        this.$ajax.get("ajax/getActivity?activity_id=" + this.$route.query.activity_id)
          .then(function(response) {
            var rev = response.data
            console.log('ajax/getActivity?\n', rev)
            if (rev.status == 'ok') {
              app.activityInfo = rev.data
              app.activityDate = global.formatDateToDayAndWeek(app.activityInfo.activityDateTime)
              app.qrcodeTitle = app.activityDate + '“' + app.activityInfo.founderNickName + '”组织的' + app.activityInfo.activityTitle

              app.activityTime = global.formatTimeDuring(app.activityInfo)
              app.isEnrolled = app.checkEnrolled()
              app.isFounder = app.checkIsFounder()
              app.canCancel = app.checkCanCancel()
              wx.checkJsApi({
                jsApiList: ['chooseImage', 'onMenuShareTimeline', 'onMenuShareAppMessage'],
                success: function(res) {
                  function shareData(act) {
                    // title: '微信JS-SDK Demo',
                    // desc: '读书接龙',
                    // link: 'https://demo.open.weixin.qq.com/jssdk/',
                    // imgUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0'
                    return { // title: 'title', // 分享标题
                      title: app.activityInfo.activityTitle,
                      desc: app.activityDate + app.activityInfo.founderNickName + '组织，' + app.activityInfo.activityAddress + '不见不散', // 分享描述
                      link: location.href,
                      imgUrl: 'http://pic01-1253796995.image.myqcloud.com/badminton/badminton_top_180329_for_image.jpg?imageView2/1/w/80', // 分享图标
                      success: function() {
                        // logAction(act, 'success');
                        // 用户确认分享后执行的回调函数
                      },
                      cancel: function() {
                        // logAction(act, 'cancel');
                        // 用户取消分享后执行的回调函数
                      }
                    }
                  };
                  wx.onMenuShareTimeline(shareData('onMenuShareTimeline'));
                  wx.onMenuShareAppMessage(shareData('onMenuShareAppMessage'));
                  wx.onMenuShareQQ(shareData('onMenuShareQQ'));
                  wx.onMenuShareWeibo(shareData('onMenuShareWeibo'));
                  wx.onMenuShareQZone(shareData('onMenuShareQZone'));
                }
              });
            } else {
              // alert(rev.msg)
              app.$router.push({ name: 'PageActivityApplyList' })
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
  watch: {
    showFollow: function(val) {
      if (val == false) {
        window.location.href = global.updateUrl(window.location.href)
      }
    }
  },
  mounted() {
    const clipboard = new Clipboard('.btn');
    var app = this
    clipboard.on('success', function(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
      e.clearSelection();
      app.$dialog.alert({
        message: '复制成功'
      }).then(() => {
        // on close
      });
    });
    this.freshPage()
  },
  beforeMount() {},
}

</script>
<style>
.styleActivityTitle {
  margin: 16px;
  font-size: 14px;
}

.bigTitle {
  font-size: 16px
}

.styleActivityTitleRight {
  text-align: right;
  margin-top: 16px;
}

.styleDialogTitle {
  text-align: center;
  margin: 10px
}

.r {
  width: 100%;
  position: fixed;
  bottom: 50px;
}

.contentActivity {
  margin-bottom: 50px;
}

</style>
