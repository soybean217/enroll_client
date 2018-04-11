<template>
  <div v-if='!isLoading'>
    <van-collapse v-model="activeNames">
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
import { Collapse, CollapseItem, Button } from 'vant'
import activitySimpleItem from '../components/activity-simple-item'
Vue.use(Collapse).use(CollapseItem)

export default {
  name: 'PageActivityApplyList',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Button.name]: Button,
    activitySimpleItem,
  },
  data() {
    return {
      activeNames: [],
      activitys: [],
      isLoading: true
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
      var app = this
      this.$ajax.get("ajax/getActivityApplyList")
        .then(function(response) {
          var rev = response.data
          console.log('ajax/getActivityApplyList?\n', rev)
          app.activitys = rev.data
          app.isLoading = false
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
