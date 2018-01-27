<template>
  <div>
    <van-cell-group>
      <van-cell title="活动名称" :value="activityTitle" />
      <van-cell title="活动时间" :value="activityDateTime" />
      <van-cell title="活动地点" :value="activityAddress" />
    </van-cell-group>
    <!-- <van-datetime-picker v-model="currentDate" type="datetime" :min-hour="minHour" :max-hour="maxHour" :min-date="minDate" :max-date="maxDate" />
 -->
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Stepper, Cell, CellGroup } from 'vant'
import { Loading, LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)



export default {
  components: {
    [Stepper.name]: Stepper,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    Loading,
  },
  name: 'PageActivityView',
  data() {
    return {
      activityDateTime: '',
      activityTitle: '',
      activityAddress: '',
    }
  },
  mounted() {

  },
  created() {
    this.$vux.loading.show({
      text: 'Loading'
    })
    if (this.$route.query.activity_id) {
      var app = this
      this.$ajax.get("ajax/getActivity?activity_id=" + this.$route.query.activity_id)
        .then(function(response) {
          console.log('ajax/getActivity?\n', response)
          var rev = response.data
          app.activityDateTime = rev.data.activityDateTime
          app.activityTitle = rev.data.activityTitle
          app.activityAddress = rev.data.activityAddress
          app.$vux.loading.hide()
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
