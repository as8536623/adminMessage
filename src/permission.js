import router from './router';
import store from './store';
import i18n from './lang';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {Message} from 'element-ui';
import {getToken, removeToken} from '@/utils/auth'; // getToken from cookie
import {skipToLogin} from './utils/auth';
import {loadTheme} from '@/utils/theme';
import Cookies from 'js-cookie';

/* import {
    ssoLogin
} from '@/api/login';*/

NProgress.configure({
    showSpinner: false
}); // NProgress Configuration

// permission judge function
function hasPermission(permissions, permission) {
    if (!permission) {
        return true;
    }
    return permissions.some(permission => permission.indexOf(permission) >= 0);
}

const whiteList = [
    '/login',
    '/bgkLogin',
    '/authredirect',
    '/courseReport',
    '/paperPreview',
    '/course',
    '/examPaperPreview'
]; // no redirect whitelist
// const notSaveRouteList = ['/', '/login', '/outerLogin', '/init', '/404', '/401'];

router.beforeEach(async(to, from, next) => {
    if (to.path === '/course') {
        removeToken();
    }
    NProgress.start(); // start progress bar
    // 每次路由跳转 重置 ajax状态
    store.dispatch('setAjaxIng', false);
    loadTheme(Cookies.get('CORP_CODE') || 'dev');

    if (getToken()) {
        // determine if there has token
        /* has token*/
        if (to.path === '/login' || to.path === '/bgkLogin') {
            next({
                path: '/'
            });
            NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (store.getters.permissions && store.getters.permissions.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                store
                    .dispatch('GetUserInfo')
                    .then(res => {
                        const permissions = res.data.data.authCodes || [];
                        store
                            .dispatch('GenerateRoutes', {
                                permissions
                            })
                            .then(() => {
                                // 根据permission权限生成可访问的路由表
                                router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                                if (store.getters.addRouters.length) {
                                    next({
                                        ...to,
                                        replace: true
                                    });
                                    // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                                } else {
                                    removeToken();
                                    Message({
                                        type: 'error',
                                        message: i18n.t('您没有访问权限'),
                                        duration: 1500
                                    });
                                    skipToLogin(next).then(); // 否则全部重定向到登录页
                                    NProgress.done();
                                    console.log('get user info fail');
                                }
                            });
                    })
                    .catch(() => {
                        console.log('get user info fail');
                    });
            } else {
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                if (hasPermission(store.getters.permissions, to.meta.permission)) {
                    next(); //
                } else {
                    next({
                        path: '/401',
                        replace: true,
                        query: {
                            noGoBack: true
                        }
                    });
                }
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            skipToLogin(next).then(); // 否则全部重定向到登录页
            NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
});

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});
