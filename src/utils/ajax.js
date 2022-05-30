import {getUcService} from '@/api/feign/feign';
import store from '@/store';

// 因为通用版本UC和K12教育UC分属不同服务，需要获取服务前缀
export function getUcSvc() {
    return new Promise(async(resolve, reject) => {
        const params = {name: 'veln-uc'};
        const re = await getUcService(params);
        const {success, data, msg} = re.data;
        if (success) {
            resolve(data);
        } else {
            reject(msg);
        }
    });
}

// 获取UC前缀
export function getUcPrefix() {
    if (!store) {
        return 'veln-uc';
    }
    return `${process.env.BASE_API}/${store.getters.ucPrefix}`;
}

// 获取UC code
export function getUcCode() {
    return store.getters.ucPrefix;
}
