import {getToken} from '@/utils/auth';
import store from '@/store';

// 博易考嵌入页面前置调整
export function peRoutePre(to, from, next) {
    if (!to.meta.linkUrl.includes('&hideHeader=true')) {
        to.meta.linkUrl = `${process.env.PE_SCREEN_API}/manage/initPage?_token=${getToken()}&hideHeader=true${to.meta.linkUrl}`;
    }
    next();
}

export function getUsableRoute(name) {
    const addRoutes = store.getters.addRouters;
    let first = [];
    addRoutes.map(item => {
        if (item.name === name) {
            first = item.children[0];
        }
    });
    return first.name;
}
