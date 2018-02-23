<template>
  <div>
    <van-row>
      <van-col span="24" align="center">
        <br/>活动信息
      </van-col>
    </van-row>
    <van-cell-group>
      <van-field v-model="founderNickName" label="组织者" icon="clear" placeholder="显示的组织者名称" required @click-icon="founderNickName=''" v-on:click="initialActivityFounderNickName" :error="!!$vuelidation.error('founderNickName')" />
      <van-field v-model="activityTitle" label="活动名称" icon="clear" placeholder="活动名称" required @click-icon="activityTitle=''" :error="!!$vuelidation.error('activityTitle')" />
      <van-field v-model="activityDateTime" label="活动时间" readonly placeholder="活动时间" required type="datetime" :error="!!$vuelidation.error('activityDateTime')" v-on:click="showDatatimePicker" />
      <van-datetime-picker v-if='isShowDatatimePicker' @cancel='cancelDatatime' @confirm='chooseDatatime' v-model="activityDateTime" type="datetime" :min-date="minDate" :max-date="maxDate" />
      <van-field v-model="activityAddress" label="活动地点" icon="clear" placeholder="活动地点" required @click-icon="activityAddress=''" :error="!!$vuelidation.error('activityAddress')" />
      <van-field v-model="enrollPrice" label="费用（元）" placeholder="请输入费用" type='number' />
      <van-cell title="人数上限">
        <van-stepper v-model="numberMax" align="center" />
      </van-cell>
      <van-cell title="人数下限">
        <van-stepper v-model="numberMin" align="center" />
      </van-cell>
      <van-cell title="确认天数">
        <van-stepper v-model="confirmDayCount" align="center" />
      </van-cell>
      <van-cell title="可否代报名">
        <van-switch v-model="enrollAgentSwitch" />
      </van-cell>
      <van-cell title="确认开关">
        <van-switch v-model="activityConfirmSwitch" />
      </van-cell>
      <van-cell title="替补开关">
        <van-switch v-model="alternateSwitch" />
      </van-cell>
    </van-cell-group>
    <van-row>
      <van-col span="12">
        <van-button bottom-action v-on:click="confirmActivity">确认</van-button>
      </van-col>
      <van-col span="12">
        <van-button type="primary" bottom-action v-on:click="confirmActivity('view')">确认并预览</van-button>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="12">
        <van-button bottom-action v-on:click="testWechatConfig">测试</van-button>
      </van-col>
      <van-col span="12">
        <van-button type="primary" bottom-action>空</van-button>
      </van-col>
    </van-row>
    <div v-transfer-dom>
      <alert v-model="enrollPriceAlert" title="费用必须为免费或者大于1元" @on-confirm=""></alert>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button, Row, Col, DatetimePicker, Switch } from 'vant'
import { Alert, TransferDomDirective as TransferDom } from 'vux'
import wx from 'weixin-js-sdk'
import Vuelidation from 'vuelidation';
Vue.use(Vuelidation);
export default {
  directives: {
    TransferDom
  },
  components: {
    [Stepper.name]: Stepper,
    [Field.name]: Field,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [Row.name]: Row,
    [Col.name]: Col,
    [CellGroup.name]: CellGroup,
    [DatetimePicker.name]: DatetimePicker,
    [Switch.name]: Switch,
    Alert,
  },
  name: 'PageActivityEdit',
  data() {
    return {
      founderNickName: '',
      activityTitle: '',
      activityAddress: '',
      activityDateTime: new Date(),
      numberMax: 100,
      numberMin: 1,
      confirmDayCount: 2,
      enrollPrice: 0,
      minDate: new Date(),
      maxDate: new Date(2022, 10, 1),
      isShowDatatimePicker: false,
      activityConfirmSwitch: false,
      enrollAgentSwitch: false,
      alternateSwitch: false,
      enrollPriceAlert: false,
    }
  },
  vuelidation: {
    data: {
      founderNickName: {
        required: true,
      },
      activityTitle: {
        required: true,
      },
      activityDateTime: {
        required: true,
      },
      activityAddress: {
        required: true,
      },
    },
  },
  methods: {
    chooseDatatime: function(v) {
      this.isShowDatatimePicker = false
    },
    cancelDatatime: function(v) {
      this.isShowDatatimePicker = false
    },
    showDatatimePicker: function() {
      this.isShowDatatimePicker = true
    },
    initialActivityFounderNickName: function() {
      if (this.founderNickName == '' && global.ACTIVITYINFO.WECHATUSER.nickname && global.ACTIVITYINFO.WECHATUSER.nickname.length > 0) {
        this.founderNickName = global.ACTIVITYINFO.WECHATUSER.nickname
      }
    },
    confirmActivity: function(act) {
      if (this.enrollPrice == 0 || this.enrollPrice >= 1) {
        if (this.$vuelidation.valid()) {
          var app = this;
          console.log(this)
          this.$ajax({
              method: 'post',
              url: 'ajax/createActivity',
              data: this._data,
            })
            .then(function(response) {
              console.log(response);
              var rev = response.data
              if (act == 'view') {
                app.$router.push({ name: 'PageActivityView', query: { activity_id: rev.activityId, } })
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      } else {
        this.enrollPriceAlert = true
      }
    },
    testWechatConfig: function() {
      wx.checkJsApi({
        jsApiList: ['chooseImage'],
        success: function(res) {
          alert('wx.checkJsApi ok!', arguments)
          console.log('global.ACTIVITYINFO', global.ACTIVITYINFO)
        }
      });
    },
    toPageView: function() {
      this.$router.push({ name: 'PageActivityView', query: { routeParams: 'params', } })
    }
  },
  computed: {},
  mounted() {}
}

</script>
<style>
/*@import 'jquery-weui/dist/css/jquery-weui.min.css'
*/

</style>
