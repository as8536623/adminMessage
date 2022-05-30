import request from '@/utils/request';
import {CTX} from '@/api/config';
import {getToken} from '@/utils/auth';
import {formatObjToEnCodeString} from '@/utils';

const PREFIX = `${CTX.MARKET}/userCard/market`;

export function exportUrl(cardId, code, status) {
    return `${process.env.BASE_API}/${PREFIX}/customize/export?${formatObjToEnCodeString({
        cardId,
        code,
        status,
        _token: getToken()
    })}`;
}

/**
 * 分页
 */
export function search(params) {
    return request({
        url: PREFIX + `/customize/page`,
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
