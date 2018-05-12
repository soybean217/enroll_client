<template>
  <div>
    <van-cell-group>
      <van-cell v-for="apply in activityInfo.applys" :title="displayTitle(apply)" v-on:click="select(apply)" :value="actText(apply)" :key="apply._id" />
    </van-cell-group>
    <!-- <actionsheet v-model="showMenu" :menus="menuContent" theme="android" @on-click-menu="click">
    </actionsheet> -->
    <van-actionsheet v-model="showMenu" :actions="actions" />
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button, Dialog, Actionsheet } from 'vant'
import wx from 'weixin-js-sdk'
Vue.use(Dialog);

export default {
  name: 'PageApplysManage',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Actionsheet.name]: Actionsheet,
  },
  data() {
    return {
      selectedApply: {},
      showMenu: false,
      activityInfo: {
        activityDateTime: '',
        activityTitle: '',
        activityAddress: '',
      },
      actions: [{
          name: '选项',
          callback: this.onClick
        },
        {
          name: '选项',
          subname: '描述信息'
        },
        {
          name: '选项',
          loading: true
        }
      ]
    }
  },
  methods: {
    displayTitle(apply) {
      if ((parseInt(apply.enrollNumber) + parseInt(apply.enrollNumberFemale)) > 1) {
        return apply.displayNickName + '(' + (apply.enrollNumber >= 1 ? apply.enrollNumber + '男' : '') + (apply.enrollNumberFemale >= 1 ? apply.enrollNumberFemale + '女' : '') + ((apply.enrollNumber > 1 && apply.enrollNumberFemale > 1) ? '共' + (parseInt(apply.enrollNumber) + parseInt(apply.enrollNumberFemale)) + '人' : '') +
          ')'
      } else {
        return apply.displayNickName + '(' + (apply.enrollNumber >= 1 ? '男' : '') + (apply.enrollNumberFemale >= 1 ? '女' : '') + ')'
      }

    },
    click(item) {
      if (item.name == '确认') {
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
            console.log(response.data);
            if (response.data.status != 'ok') {
              alert('please retry or report , page will refresh because of :' + JSON.stringify(response.data));
            }
            app.freshPage()
          })
          .catch(function(error) {
            console.log(error);
          })
      } else if (item.name == '删除') {
        this.$dialog.confirm({
          title: '确认',
          message: '删除' + this.selectedApply.displayNickName + '的申请？'
        }).then(() => {
          // on confirm
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
        }).catch(() => {
          // on cancel
        });

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
        var subTitle = ''
        if (apply.payToFounderStatus == 'payed') {
          subTitle += '(需退费' + apply.payToFounderAmount / 100 + '元)'
        }
        if (apply.status == 'wait') {
          this.actions = [{
              name: '确认',
              callback: this.click
            },
            {
              name: delTitle,
              subname: subTitle,
              callback: this.click
            }
          ]
        } else {
          this.actions = [{
            name: delTitle,
            subname: subTitle,
            callback: this.click
          }]
        }
        this.showMenu = true
      }
    },
    procHeadImg: function(imgUrl) {
      return imgUrl.substr(0, imgUrl.lastIndexOf('/') + 1) + global.CONFIG.HEAD_ICON_REAL_RESOLUTION
    },
    freshPage: function() {
      this.showMenu = false
      if (this.$route.query.activity_id) {
        var app = this
        this.$ajax.get("ajax/getActivity?activity_id=" + this.$route.query.activity_id)
          .then(function(response) {
            var rev = response.data
            if (global.ACTIVITYINFO.WECHATUSER.unionid != rev.data.founderUnionId) {
              app.$router.push({ name: 'PageActivityView', query: { activity_id: app.$route.query.activity_id, } })
            }
            app.activityInfo = rev.data
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
