import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import PageActivityEdit from '@/pages/ActivityEdit'
import PageActivityView from '@/pages/ActivityView'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }, {
    path: '/activity_edit',
    name: 'PageActivityEdit',
    component: PageActivityEdit
  }, {
    path: '/activity_view',
    name: 'PageActivityView',
    component: PageActivityView
  }, ]
})
