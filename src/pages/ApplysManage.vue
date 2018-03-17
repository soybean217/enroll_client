<template>
  <div>
    <van-cell-group>
      <van-cell v-for="apply in activityInfo.applys" :title="apply.displayNickName" v-on:click="select(apply)" :value="actText(apply)" :key="apply" />
    </van-cell-group>
    <actionsheet v-model="showMenu" :menus="menuContent" theme="android" @on-click-menu="click">
    </actionsheet>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button } from 'vant'
import { Loading, LoadingPlugin, Confirm, Alert, Actionsheet, TransferDomDirective as TransferDom } from 'vux'
import wx from 'weixin-js-sdk'
Vue.use(LoadingPlugin)

export default {
  directives: {
    TransferDom
  },
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    Loading,
    Confirm,
    Alert,
    Actionsheet,
  },
  name: 'PageActivityView',
  data() {
    return {
      selectedApply: {},
      showMenu: false,
      activityInfo: {
        activityDateTime: '',
        activityTitle: '',
        activityAddress: '',
      },
      menuContent: {
        menu1: '北京烤鸭',
        menu2: '陕西油泼面',
        menu3: '西安肉夹馍'
      },
    }
  },
  methods: {
    click(key) {
      console.log(key)
      if (key == 'confirm') {
        this.$vux.loading.show({
          text: 'Loading'
        })
        var app = this
        this.$ajax({
            method: 'post',
            url: 'ajax/confirmApply',
            data: {
              activity_id: this.$route.query.activity_id,
              applyId: this.selectedApply._id,
            },
          })
          .then(function(response) {
            app.$vux.loading.hide()
            console.log(response.data);
            if (response.data.status != 'ok') {
              alert('please retry or report , page will refresh because of :' + JSON.stringify(response.data));
            }
            app.freshPage()
          })
          .catch(function(error) {
            console.log(error);
          })
      } else if (key == 'del') {
        this.$vux.loading.show({
          text: 'Loading'
        })
        var app = this
        this.$ajax({
            method: 'post',
            url: 'ajax/delApply',
            data: {
              activity_id: this.$route.query.activity_id,
              applyId: this.selectedApply._id,
            },
          })
          .then(function(response) {
            app.$vux.loading.hide()
            console.log(response.data);
            if (response.data.status != 'ok') {
              alert('please retry or report , page will refresh because of :' + JSON.stringify(response.data));
            }
            if (response.data.type && response.data.type == 'unifiedOrder') {
              wx.checkJsApi({
                jsApiList: ['chooseWXPay'],
                success: function(res) {
                  var unifiedOrderData = response.data.data
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
            } else {
              app.freshPage()
            }
          })
          .catch(function(error) {
            console.log(error);
          })
      }
    },
    actText(apply) {
      if (apply.unionId == this.activityInfo.founderUnionId) {
        return ''
      } else if (apply.status == 'pass') {
        return '已通过【管理】'
      } else {
        return '等待审核【管理】'
      }
    },
    select(apply) {
      this.selectedApply = apply
      if (apply.unionId != global.ACTIVITYINFO.WECHATUSER.unionid) {
        var delTitle = '删除'
        if (apply.payToFounderStatus == 'payed') {
          delTitle += '(需退费' + apply.payToFounderAmount / 100 + '元)'
        }
        if (apply.status == 'wait') {
          this.menuContent = {
            confirm: '确认',
            del: delTitle
          }
        } else {
          this.menuContent = {
            del: delTitle
          }
        }
        this.showMenu = true
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
