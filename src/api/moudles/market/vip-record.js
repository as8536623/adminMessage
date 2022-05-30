import request from '@/utils/request';
import {CTX} from '@/api/config';
import {formatObjToEnCodeString} from '@/utils';
import {getToken} from '@/utils/auth';

const PREFIX = `${CTX.MARKET}/userVip/market`;

export function exportUrl(user, vipId) {
    return `${process.env.BASE_API}/${PREFIX}/customize/export?${formatObjToEnCodeString({
        user,
        vipId,
        _token: getToken()
    })}`;
}

/**
 * vip获取记录
 */
export function search(params) {
    return request({
        url: `${PREFIX}/customize/page`,
        method: 'get',
        params
    });
}

/**
 * 关闭
 */
export function freeze(path) {
    return request({
        url: `${PREFIX}/freeze/${path}`,
        method: 'put'
    });
}
