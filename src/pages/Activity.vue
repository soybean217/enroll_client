<template>
  <div>
    <van-cell-group>
      <van-field v-model="username" label="组织者" icon="clear" placeholder="显示的组织者名称" required @click-icon="username = ''" />
      <van-field id='datetime-picker' v-model="activityTime" label="活动时间" icon="clear" placeholder="活动时间" required />
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, DatetimePicker } from 'vant'
import $ from 'jquery'
import weui from 'jquery-weui/dist/js/jquery-weui.min'

Vue.use(Field)
// Vue.use(DatetimePicker)

export default {
  name: 'PageActivity',
  data() {
    return {
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
