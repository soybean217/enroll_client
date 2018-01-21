<template>
  <div>
    <van-cell-group>
      <van-field v-model="username" label="组织者" icon="clear" placeholder="显示的组织者名称" required @click-icon="username = ''" />
      <van-field id='datetime-picker' v-model="activityTime" label="活动时间" icon="clear" placeholder="活动时间" required />
      <van-field v-model="activityAddress" label="活动地点" icon="clear" placeholder="活动地点" required />
      <van-field v-model="enrollPrice" label="费用(元)" placeholder="请输入费用" type='number' />
      <van-cell title="人数上限" />
      <div align="center">
        <van-stepper v-model="maxEnrollCount" />
      </div>
      <van-cell title="人数下限" value='小于该人数活动自动取消' />
      <div align="center">
        <van-stepper v-model="minEnrollCount" />
      </div>
      <van-cell title="将于活动前多少天确认，确认后所付钱款转给组织者。参与者将不能退费。" />
      <div align="center">
        <van-stepper v-model="confirmDaysBeforeActivity" />
      </div>
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup } from 'vant'
import $ from 'jquery'
import weui from 'jquery-weui/dist/js/jquery-weui.min'

Vue.use(Field)
Vue.use(Stepper)
// Vue.use(DatetimePicker)

export default {
  components: {
    [Stepper.name]: Stepper,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
  },
  name: 'PageActivity',
  data() {
    return {
      enrollPrice: 0,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date(2018, 1, 1)
    }
  },
  mounted() {
    $("#datetime-picker").datetimePicker({
      title: '出发时间',
      min: "1990-12-12",
      max: "2022-12-12 12:12",
      onChange: function(picker, values, displayValues) {
        console.log(values);
      }
    });
  }
}

</script>
<style>
@import 'jquery-weui/dist/css/jquery-weui.min.css'

</style>
