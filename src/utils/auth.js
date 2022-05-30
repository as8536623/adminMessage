import Cookies from 'js-cookie';
import store from '@/store';
import {shareGet} from '@/api/personalized/personalized';

const TokenKey = 'veln-key';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function getAppKey() {
    return Cookies.get('appKey');
}

export function setAppKey(appKey) {
    return Cookies.set('appKey', appKey);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

// 获取登录模板信息
export function getLoginType() {
    let timer = null;
    return new Promise(resolve => {
        timer = setTimeout(() => {
            store.commit('SET_LOGIN_TYPE', 'SYSTEM');
            resolve('SYSTEM');
            clearTimeout(timer);
        }, 10000);
        // 获取登录模板信息
        shareGet().then(re => {
            clearTimeout(timer);
            const result = re.data;
            if (result.success && result.data) {
                const {type} = result.data;
                store.commit('SET_LOGIN_TYPE', type);
                resolve(type);
            } else {
                store.commit('SET_LOGIN_TYPE', 'SYSTEM');
                resolve('SYSTEM');
            }
        });
    });
}

// 判断 跳转到哪
export async function skipToLogin(next) {
    // 跳转到普通登录页
    const skipToTemplate = () => {
        next('/login');
    };
    // 跳转到个性化登录页
    const skipToCustom = () => {
        location.href = `${location.protocol}//${location.host}/login`;
    };
    const loginType = store.getters.loginType || await getLoginType();
    if (loginType && loginType === 'SYSTEM' || location.href.includes('localhost')) {
        skipToTemplate();
    }

    if (loginType && loginType !== 'SYSTEM') {
        skipToCustom();
    }
}

export function getCorpCode() {
    const codeFromCookie = Cookies.get('CORP_CODE');
    if (!codeFromCookie) {
        return store.getters.corpCode;
    } else {
        return codeFromCookie;
    }
}

export function isBgk() {
    const corpCode = getCorpCode();
    return corpCode === 'bgk' || corpCode === 'bgh';
}

export function isJY() {
    const corpCode = getCorpCode();
    return corpCode === 'jiayi';
}
