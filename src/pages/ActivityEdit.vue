<template>
  <div>
    <van-row>
      <van-col span="24" align="center">
        <br/>活动信息
      </van-col>
    </van-row>
    <van-cell-group>
      <van-field v-model="founderNickName" label="组织者" icon="clear" placeholder="显示的组织者名称" :error="checkError('founderNickName')" :error-message="errorMassage('founderNickName')" required @click-icon="founderNickName=''" v-on:click="initialActivityFounderNickName" />
      <van-field v-model="activityTitle" label="活动名称" icon="clear" placeholder="活动名称" :error="checkError('activityTitle')" :error-message="errorMassage('activityTitle')" required @click-icon="activityTitle=''" />
      <van-field v-model="activityDateTime" label="活动时间" readonly placeholder="活动时间" :error="checkError('activityDateTime')" :error-message="errorMassage('activityDateTime')" required type="datetime" v-on:click="showDatatimePicker" />
      <van-datetime-picker v-if='isShowDatatimePicker' @cancel='cancelDatatime' @confirm='chooseDatatime' v-model="activityDateTime" type="datetime" :min-date="minDate" :max-date="maxDate()" />
      <van-cell title="预计用时(小时)">
        <van-stepper v-model="spendHours" align="center" />
      </van-cell>
      <van-field v-model="activityAddress" label="活动地点" icon="clear" placeholder="活动地点" :error="checkError('activityAddress')" :error-message="errorMassage('activityAddress')" required @click-icon="activityAddress=''" />
      <van-field v-model="activityField" label="活动场地" icon="clear" placeholder="活动场地" />
      <van-field v-model="enrollPrice" label="男生费用" placeholder="请输入费用(元)" type='number' />
      <van-field v-model="enrollPriceFemale" label="女生费用" placeholder="请输入费用(元)" type='number' />
      <van-cell title="人数上限">
        <van-stepper v-model="numberMax" align="center" />
      </van-cell>
      <!-- <van-cell title="人数下限">
  <van-stepper v-model="numberMin" align="center" />
</van-cell>
 -->
      <van-cell title="确认天数">
        <van-stepper v-model="confirmDayCount" align="center" />
      </van-cell>
      <van-cell title="可否代报名">
        <van-switch v-model="enrollAgentSwitch" />
      </van-cell>
      <van-cell title="确认开关">
        <van-switch v-model="activityConfirmSwitch" />
      </van-cell>
      <van-cell title="通知开关">
        <van-switch v-model="notifySwitch" />
      </van-cell>
      <!-- <van-cell title="替补开关">
  <van-switch v-model="alternateSwitch" />
</van-cell>
 -->
      <van-field v-model="activityNotice" label="公告" type="textarea" placeholder="公告" rows="1" autosize />
      <!-- <x-textarea v-model="activityNotice" title="公告" placeholder="请输入公告" :show-counter="false" :rows="1" autosize></x-textarea> -->
    </van-cell-group>
    <van-row>
      <van-col span="12">
        <van-button bottom-action v-on:click="confirmActivity">确认</van-button>
      </van-col>
      <van-col span="12">
        <van-button type="primary" bottom-action v-on:click="confirmActivity('view')">确认并预览</van-button>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button, Row, Col, DatetimePicker, Switch } from 'vant'
// import Validator from 'better-validator' // also can not work on wechat PC version
// import Vuelidation from 'vuelidation';// can not work on wechat PC version
// Vue.use(Vuelidation);
export default {
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
  },
  name: 'PageActivityEdit',
  data() {
    return {
      founderNickName: '',
      activityTitle: '',
      activityAddress: '',
      activityField: '',
      activityNotice: '',
      activityDateTime: new Date(),
      numberMax: 100,
      numberMin: 1,
      confirmDayCount: 2,
      enrollPrice: 0,
      enrollPriceFemale: 0,
      spendHours: 1,
      minDate: new Date(),
      isShowDatatimePicker: false,
      activityConfirmSwitch: false,
      enrollAgentSwitch: false,
      alternateSwitch: false,
      notifySwitch: true,
      enrollPriceAlert: false,
      checkParamsResult: {}
    }
  },
  // vuelidation: { // data: { // founderNickName: { // required: true, // }, // activityTitle: { // required: true, // }, // activityDateTime: { // required: true, // }, // activityAddress: { // required: true, // }, // }, // },
  methods: {
    maxDate: function() {
      return new Date(Date.now() + 86400 * 1000 * 365)
    },
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
      if (this.founderNickName == '' && global.ACTIVITYINFO.WECHATUSER.nickname) {
        this.founderNickName = global.ACTIVITYINFO.WECHATUSER.nickname
      }
    },
    checkError(title) {
      if (this.checkParamsResult[title] && this.checkParamsResult[title].error) {
        return true
      }
    },
    errorMassage(title) {
      if (this.checkParamsResult[title] && this.checkParamsResult[title].errMsg) {
        return this.checkParamsResult[title].errMsg
      } else {
        return ""
      }
    },
    checkParams() {
      var result = true
      if (!(this.enrollPrice == 0 || this.enrollPrice >= 1)) {
        this.checkParamsResult['enrollPrice'] = { error: true, errMsg: "价格不正确" }
        result = false
      }
      if (this.founderNickName.length == 0) {
        this.checkParamsResult['founderNickName'] = { error: true, errMsg: "组织者不能为空" }
        result = false
      }
      if (this.activityTitle.length == 0) {
        this.checkParamsResult['activityTitle'] = { error: true, errMsg: "活动名称不能为空" }
        result = false
      }
      if (this.activityAddress.length == 0) {
        this.checkParamsResult['activityAddress'] = { error: true, errMsg: "活动地点不能为空" }
        result = false
      }
      if (this.activityDateTime.length == 0) {
        this.checkParamsResult['activityDateTime'] = { error: true, errMsg: "活动时间不能为空" }
        result = false
      }
      return result
    },
    confirmActivity: function(act) {
      this.checkParamsResult = {}
      if (this.checkParams()) {
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
      } else {

      }
    },
    toPageView: function() {
      this.$router.push({ name: 'PageActivityView', query: { routeParams: 'params', } })
    }
  },
}

</script>
<style>


</style>
