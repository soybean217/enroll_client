<template>
  <div>
    <van-cell-group>
      <van-cell title="活动名称" :value="activityInfo.activityTitle" />
      <van-cell title="组织者" :value="activityInfo.founderNickName" />
      <van-cell title="活动时间" :value="activityInfo.activityDateTime" />
      <van-cell title="活动地点" :value="activityInfo.activityAddress" />
      <van-cell title="确认天数" :value="activityInfo.confirmDayCount" />
      <van-cell title="活动费用" :value="activityInfo.enrollPrice?activityInfo.enrollPrice+'元/人':'免费'" />
      <van-button size="large" type="primary" v-on:click="enroll" v-if="!checkEnrolled()">{{enrollButtonText}}</van-button>
      <van-cell title="已报名人数" :value="activityInfo.applys.length+'/'+activityInfo.numberMax" />
      <div>
        <img v-for="item in activityInfo.applys" :src="procHeadImg(item.headimgurl)" />
      </div>
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
    <div v-transfer-dom>
      <confirm v-model="show5" show-input ref="confirm5" title="显示的昵称" @on-confirm="onConfirm5" @on-show="onShow5">
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert v-model="showQrcodeAlert" title="扫描二维码完成报名" @on-show="onShow"><img height="200px" width="200px" :src='qrcodeSrc' /></alert>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button } from 'vant'
import { Loading, LoadingPlugin, Confirm, Alert, TransferDomDirective as TransferDom } from 'vux'
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
      show5: false,
      showQrcodeAlert: false,
      enrollButtonText: '已报名',
      activityInfo: {
        activityDateTime: '',
        activityTitle: '',
        activityAddress: '',
      }
    }
  },
  methods: {
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    onShow5() {
      this.$refs.confirm5.setInputValue(global.ACTIVITYINFO.WECHATUSER.nickname)
    },
    onConfirm5(value) {
      this.$ajax({
          method: 'post',
          url: 'ajax/enrollActivity',
          data: {
            activityId: this.$route.query.activity_id,
            displayNickName: value,
          },
        })
        .then(function(response) {
          console.log(response);
          var rev = response.data
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    enroll: function() {
      if (false) {
        // if (global.ACTIVITYINFO.WECHATUSER.subscribe) {
        this.show5 = true;
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
    checkEnrolled: function() {
      console.log('console.log(global.ACTIVITYINFO.WECHATUSER)', global.ACTIVITYINFO.WECHATUSER)
      for (var i in this.activityInfo.applys) {
        console.log('i', i)
        if (global.ACTIVITYINFO.WECHATUSER.unionid == this.activityInfo.applys[i].unionId) {
          return true
        }
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
        setTimeout(this.checkGlobalPara(), 500)
      }
    }
  },
  mounted() {},
  beforeMount() {
    this.$vux.loading.show({
      text: 'Loading'
    })
    if (this.$route.query.activity_id) {
      var app = this
      this.$ajax.get("ajax/getActivity?activity_id=" + this.$route.query.activity_id)
        .then(function(response) {
          console.log('ajax/getActivity?\n', response)
          var rev = response.data
          app.activityInfo = rev.data
          app.checkGlobalPara()
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
}

</script>
<style>


</style>
