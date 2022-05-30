import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `order`;

/**
 * 订单列表
 */
export function searchOrder(params) {
    return request({
        url: PREFIX + `/page`,
        method: 'GET',
        params
    });
}

/**
 * 取消订单
 */
export function cancelOrder(id) {
    return request({
        url: `${PREFIX}/cancel/${id}`,
        method: 'PUT'
    });
}

/**
 * 订单详情
 */
export function getOrder(id) {
    return request({
        url: `${PREFIX}/admin/${id}`,
        method: 'GET'
    });
}
