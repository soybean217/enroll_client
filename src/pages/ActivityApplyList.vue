<template>
  <div v-if='!isLoading'>
    <van-collapse v-model="activeNames">
      <van-collapse-item v-for="activity in activitys" :title="formatTitle(activity)" :key="activity._id" :name="activity._id">
        <div v-on:click="goToActivity(activity)">
          组织者：{{activity.founderNickName}}
          <br> 活动时间：
          <br>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script>
import Vue from 'vue'
import { Collapse, CollapseItem, Button } from 'vant'
Vue.use(Collapse).use(CollapseItem)

export default {
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Button.name]: Button,
  },
  name: 'PageActivityApplyList',
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
