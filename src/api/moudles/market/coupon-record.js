import request from '@/utils/request';
import {CTX} from '@/api/config';
import {getToken} from '@/utils/auth';
import {formatObjToEnCodeString} from '@/utils';

const PREFIX = `${CTX.MARKET}/userCoupon/market`;

export function exportUrl(couponId) {
    return `${process.env.BASE_API}/${PREFIX}/customize/export?${formatObjToEnCodeString({
        couponId,
        _token: getToken()
    })}`;
}

/**
 * 优惠券发放记录
 */
export function search(params) {
    return request({
        url: `${PREFIX}/customize/page`,
        method: 'get',
        params
    });
}

/**
 * 作废
 */
export function recover(path) {
    return request({
        url: `${PREFIX}/recover/${path}`,
        method: 'put'
    });
}

/**
 * 恢复
 */
export function restore(path) {
    return request({
        url: `${PREFIX}/restore/${path}`,
        method: 'put'
    });
}

/**
 * 作废
 */
export function batchRecover(data) {
    return request({
        url: `${PREFIX}/recover/batch`,
        method: 'put',
        data
    });
}

/**
 * 恢复
 */
export function batchRestore(data) {
    return request({
        url: `${PREFIX}/restore/batch`,
        method: 'put',
        data
    });
}
