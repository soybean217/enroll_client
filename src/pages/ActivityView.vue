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
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup, Button } from 'vant'
import { Loading, LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)



export default {
  components: {
    [Stepper.name]: Stepper,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    Loading,
  },
  name: 'PageActivityView',
  data() {
    return {
      isEnrolled: false,
      isFounder: false,
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
    enroll: function() {
      if (global.CONFIG.FORCE_SUBSCRIBE) {
        if (global.ACTIVITYINFO.WECHATUSER.subscribe) {
          this.$ajax.get("ajax/enrollActivity?act=enroll")
            .then(function(response) {
              console.log('ajax/enrollActivity?\n', response)
              var rev = response.data
            })
            .catch(function(error) {
              console.log(error);
            });
        }

      } else {

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
