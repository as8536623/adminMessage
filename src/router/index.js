import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '@/views/layout/Layout';

import ucRouter from './uc';
import contentRouter from './content';
import outerRouter from './outer';
import {getToken} from '@/utils/auth';

Vue.use(Router);
/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    permission: ['table:list']     will control the page permission (you can set multiple permission)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/bgkLogin',
        name: 'bgkLogin',
        component: () => import('@/views/login/bgkLogin'),
        hidden: true
    },
    {
        path: '/authredirect',
        component: () => import('@/views/login/authredirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
    {
        path: `/preview`,
        name: 'paperPreview',
        component: () => import('@/views/content/exam/paper/preview'),
        hidden: true,
        meta: {
            title: '试卷预览'
        }
    },
    {
        path: `/filePreview`,
        name: 'filePreview',
        component: () => import('@/views/filePreview'),
        hidden: true,
        meta: {
            title: '文件预览'
        }
    },
    {
        path: `/exam/preview`,
        name: 'examPaperPreview',
        component: () => import('@/views/content/exam/examination/preview'),
        hidden: true,
        meta: {
            title: '试卷预览'
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/first',
        hidden: true,
        children: [
            {
                path: 'dashboard',
                redirect: '/first',
                name: 'dashboard',
                meta: {
                    title: 'iyongzhi',
                    icon: 'dashboard',
                    noCache: true
                }
            }
        ]
    },
    {
        path: '/courseReport',
        name: 'courseReport',
        component: () => import('@/views/content/course/report'),
        hidden: true,
        meta: {
            title: '课程报表'
        }
    },
    {
        path: '/live',
        name: 'live',
        component: () => import('@/views/content/live/index'),
        hidden: true,
        meta: {
            title: '直播课程'
        }
    }
];
export const asyncRouterMap = [
    {
        path: '/first',
        component: () => import('@/views/first/index'),
        name: 'first',
        hidden: true,
        meta: {
            title: '加载中...'
        }
    },
    contentRouter, // 内容管理
    ucRouter, // 人员管理
    {
        path: `${location.protocol}//${location.host}/velnFs`,
        component: Layout,
        hidden: true,
        meta: {
            title: '文件库'
        }
    },
    {
        path: `/course`,
        name: 'course',
        component: () => import('@/views/course'),
        hidden: true,
        meta: {
            title: '课程播放'
        }
    },
    outerRouter,
    {
        path: `${location.protocol}//${
            location.host
            }/api/veln-pe/manage/initPage?_token=${getToken()}`,
        component: Layout,
        meta: {
            title: '考试管理'
        },
        hidden: true,
        children: [
            {
                path: `${
                    location.host
                    }/api/veln-pe/manage/initPage?_token=${getToken()}`,
                meta: {title: 'External Link', icon: 'link'}
            }
        ]
    },
    {
        path: '/questionnaire',
        name: 'questionnaire',
        component: () => import('@/views/content/tool/survey/questionnaire'),
        hidden: true,
        meta: {
            title: '问卷编辑'
        }
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];

export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap.concat(asyncRouterMap)
});
