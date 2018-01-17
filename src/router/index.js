import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import PageActivity from '@/pages/Activity'
import PageActivityJqweui from '@/pages/ActivityJqweui'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }, {
    path: '/activity',
    name: 'PageActivity',
    component: PageActivity
  }, {
    path: '/activityJqweui',
    name: 'PageActivityJqweui',
    component: PageActivityJqweui
  }]
})
