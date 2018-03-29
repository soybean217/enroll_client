import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import PageActivityEdit from '@/pages/ActivityEdit'
import PageActivityView from '@/pages/ActivityView'
import PageActivityFoundList from '@/pages/ActivityFoundList'
import PageActivityApplyList from '@/pages/ActivityApplyList'
import PageApplysManage from '@/pages/ApplysManage'
import PageApplysList from '@/pages/ApplysList'

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
  }, {
    path: '/activity_found_list',
    name: 'PageActivityFoundList',
    component: PageActivityFoundList
  }, {
    path: '/activity_apply_list',
    name: 'PageActivityApplyList',
    component: PageActivityApplyList
  }, {
    path: '/applys_manage',
    name: 'PageApplysManage',
    component: PageApplysManage
  }, {
    path: '/applys_list',
    name: 'PageApplysList',
    component: PageApplysList
  }, ]
})
