<template>
  <div v-if='!isLoading'>
    <van-button size="large" type="primary" v-on:click="createActivity">创建新活动</van-button>
    <van-collapse v-model="activeNames" v-if='!isLoading'>
      <van-collapse-item v-for="activity in activitys" :title="formatTitle(activity)" :key="activity._id" :name="activity._id">
        <div v-on:click="goToActivity(activity)">
          <activity-simple-item :activity='activity'></activity-simple-item>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script>
import Vue from 'vue'
import { Collapse, CollapseItem, Button, Loading } from 'vant'
// import { Loading, LoadingPlugin, TransferDomDirective as TransferDom } from 'vux'
import activitySimpleItem from '../components/activity-simple-item'
Vue.use(Collapse).use(CollapseItem).use(Loading)

export default {
  // directives: { // TransferDom // },
  name: 'PageActivityFoundList',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Button.name]: Button,
    [Loading.name]: Loading,
    activitySimpleItem,
    // Loading,
  },
  data() {
    return {
      activeNames: [],
      activitys: [],
      isLoading: true,
    }
  },
  methods: {
    goToActivity: function(activity) {
      this.$router.push({ name: 'PageActivityView', query: { activity_id: activity._id, } })
    },
    createActivity: function() {
      this.$router.push({
        name: 'PageActivityEdit'
      })
    },
    formatTitle: function(activity) {
      return activity.activityTitle + '-' + global.formatDateToDay(activity.activityDateTime)
    },
    freshPage: function() {
      // this.$vux.loading.show({ // text: 'Loading' // })

      var app = this
      this.$ajax.get("ajax/getActivityFoundList")
        .then(function(response) {
          var rev = response.data
          console.log('ajax/getActivityFoundList?\n', rev)
          app.activitys = rev.data
          app.isLoading = false
          // app.$vux.loading.hide()
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  beforeMount() {
    this.freshPage()
  },
}

</script>
