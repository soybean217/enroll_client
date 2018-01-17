<template>
  <div>
    <input type="text" id='datetime-picker' />
    <!--
<van-datetime-picker
  v-model="currentDate"
  type="datetime"
  :min-hour="minHour"
  :max-hour="maxHour"
  :min-date="minDate"
  :max-date="maxDate"
/>
-->
  </div>
</template>
<script>
import Vue from 'vue'
// import $ from 'jquery/dist/jquery.min'
import $ from 'jquery'
import weui from 'jquery-weui/dist/js/jquery-weui.min'


export default {
  name: 'PageActivityJqweui',
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
    console.log('mounted')
    $("#datetime-picker").datetimePicker({
      title: '活动时间',
      min: "1990-12-12",
      max: "2022-12-12 12:12",
      onChange: function(picker, values, displayValues) {
        console.log(values);
      }
    });
    $.notification({
      title: "Baby",
      text: "I miss you",
      media: "<img src='...'>",
      data: "123",
      onClick: function(data) {
        $.alert("Click" + data);
      },
      onClose: function(data) {
        $.alert("Close " + data);
      }
    });
  }
}

</script>
<style>
@import 'jquery-weui/dist/css/jquery-weui.min.css'

</style>
