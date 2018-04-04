<template>
  <div id="app">
    <keep-alive>
      <div class="wrap">
        <router-view></router-view>
      </div>
    </keep-alive>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="clock" to="activity_apply_list">参加</van-tabbar-item>
      <van-tabbar-item icon="edit" to="activity_found_list">发起</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vant'
import './globalInfo'
// import { Loading, LoadingPlugin, TransferDomDirective as TransferDom } from 'vux'

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    // Loading,
  },
  name: 'App',
  data() {
    return {
      active: -1,
    }
  },
  mounted() {},
  created() {}
}

</script>
<style lang="less">
/*body { font-size: 16px; background-color: #f8f8f8; -webkit-font-smoothing: antialiased; }
*/

html,
body,
#app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;

  .wrap {
    flex: 1;
    height: 100%;
    margin-bottom: 50px;

    overflow-y: auto;
    overflow-x: hidden;
    font-size: 16px;
  }
}

</style>
