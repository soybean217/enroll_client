<template>
  <div>
    组织者：{{activity.founderNickName}}
    <br> 活动时间：{{procDate()}}
    <br> 活动地点：{{activity.activityAddress}}
  </div>
</template>
<script>
export default ({
  name: 'ActivitySimpleItem',
  props: {
    activity: Object,
  },
  methods: {
    procDate() {
      return global.formatDateToDayAndWeek(this.activity.activityDateTime)
    },
  },
})

</script>
