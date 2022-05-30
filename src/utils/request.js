import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store';
import router from '@/router';
import {getToken, removeToken, getAppKey} from '@/utils/auth';
import {filterObjForInanition} from '@/utils/index';
import {isIE} from '@/utils/browser';

const whiteUrls = [
    '/priceManage/open/priceSearch',
    '/historyPriceManage/priceSearch'
];

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    // timeout: 40000 // request timeout
});

// request interceptor
service.interceptors.request.use(
    config => {
        if (
            !location.href.includes('localhost') &&
            !location.href.includes('dev=1') &&
            config.url.startsWith('/api')
        ) {
            config.url = `${location.protocol}//${location.host}${config.url}`;
        }
        const url = config.url;
        let isLongTimeout = false;
        for (let i = 0; i < whiteUrls.length; i++) {
            if (url.indexOf(whiteUrls[i]) > -1) {
                isLongTimeout = true;
                break;
            }
        }

        //  过滤 值为''/null/undefined的字段
        if (config.params) {
            config.params = filterObjForInanition(config.params);
        }
        if (config.data) {
            config.data = filterObjForInanition(config.data);
        }

        if (isIE()) {
            if (config.url.includes('?')) {
                config.url = encodeURI(`${config.url}&v=${+new Date()}`);
            } else {
                config.url = encodeURI(`${config.url}?v=${+new Date()}`);
            }
        }

        config.timeout = isLongTimeout ? 2000000 : 40000;

        const serverIp = localStorage.getItem('SERVER-IP');
        if (serverIp) {
            config.headers['SERVER-IP'] = serverIp;
        }
        // Do something before request is sent
        if (store.getters.token) {
            config.headers['Authorization'] = getToken() || '';
        }

        const appKey = getAppKey();
        if (appKey) {
            config.headers['appKey'] = appKey || '';
        }
        return config;
    },
    error => {
        // Do something with request error
        Promise.reject(error);
    }
);

// respone interceptor
service.interceptors.response.use(
    response => response,
    error => {
        let errMsg = error.message;
        store.dispatch('setAjaxIng', false);
        switch (error.response && error.response.status) {
            case 401:
                errMsg = '';
                // 如果登录失效，需要清空缓存并重定向到登录页面
                removeToken();
                router.replace('/login');
                break;
            case 404:
                errMsg = '404';
                break;
            case 417:
                errMsg = '校验失败！';
                break;
            default: {
                if (error.response && error.response.status >= 500) {
                    errMsg = 'serverError';
                }
                break;
            }
        }

        if (errMsg) {
            Message({
                duration: 5000,
                message: errMsg,
                type: 'error'
            });
        }

        return Promise.reject(error);
    }
);

export default service;
