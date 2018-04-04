import Vue from 'vue';
import Router from 'vue-router';
import wx from 'weixin-js-sdk';
import axios from 'axios';
import './globalInfo'

Vue.use(Router);

const routes = [{
    path: '*',
    redirect: '/goods'
  },
  {
    name: 'user',
    component: () =>
      import ('./view/user'),
    meta: {
      title: '会员中心'
    }
  },
  {
    name: 'cart',
    component: () =>
      import ('./view/cart'),
    meta: {
      title: '购物车'
    }
  },
  {
    name: 'goods',
    component: () =>
      import ('./view/goods'),
    meta: {
      title: '商品详情'
    }
  }, {
    path: '/activity_found_list',
    name: 'PageActivityFoundList',
    component: () =>
      import ('./pages/ActivityFoundList'),
    meta: {
      title: '发起的活动'
    }
  }, {
    path: '/activity_apply_list',
    name: 'PageActivityApplyList',
    component: () =>
      import ('./pages/ActivityApplyList'),
    meta: {
      title: '参加的活动'
    }
  }, {
    path: '/activity_edit',
    name: 'PageActivityEdit',
    component: () =>
      import ('./pages/ActivityEdit'),
    meta: {
      title: '创建活动'
    }
  }, {
    path: '/activity_view',
    name: 'PageActivityView',
    component: () =>
      import ('./pages/ActivityView'),
    meta: {
      title: '查看活动'
    }
  }, {
    path: '/applys_list',
    name: 'PageApplysList',
    component: () =>
      import ('./pages/ApplysList'),
    meta: {
      title: '报名人员'
    }
  }, {
    path: '/applys_manage',
    name: 'PageApplysManage',
    component: () =>
      import ('./pages/ApplysManage'),
    meta: {
      title: '管理报名'
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  if (global.ACTIVITYINFO.WECHATUSER) {
    next()
  } else {
    axios.get("ajaxPub/signWechat")
      .then(function(response) {
        var rev = response.data
        console.log(rev)
        if (!rev.wechatUserInfo) {
          // alert('test')
          // window.location = "ajhrefRedirect?href=" + encodeURIComponent(location.href)
          axios({
              method: 'post',
              url: 'ajhrefRecord',
              data: {
                href: location.href,
              },
            })
            .then(function(response) {
              console.log(response.data)
              if (response.data.status = 'ok') {
                window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + rev.appId + '&redirect_uri=' + response.data.loginUrl + '&response_type=code&scope=snsapi_base&state=' + response.data.state + '#wechat_redirect'
              } else {
                alert('error when get state')
              }
            }).catch(function(error) {
              alert('error when get state')
              console.log(error);
            });
        }
        global.ACTIVITYINFO.WECHATUSER = rev.wechatUserInfo
        wx.config({
          debug: rev.debug,
          appId: rev.appId,
          timestamp: rev.timestamp,
          nonceStr: rev.nonceStr,
          signature: rev.signature,
          jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "onVoicePlayEnd", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
        })
        wx.ready(function() {
          wx.checkJsApi({
            jsApiList: ['chooseImage'],
            success: function(res) {
              next()
            }
          });
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});

export {
  router
};
