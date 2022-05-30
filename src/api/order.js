import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MALL_API}` : `${process.env.MALL_API}`;

// 生成课程购买订单,返回支付页URL
export function genCourseOrder(data) {
    return request({
        url: `${ctx}/order/app/course/order`,
        method: 'post',
        data
    });
}

// 生成专题购买订单,返回支付页URL
export function genSubjectOrder(data) {
    return request({
        url: `${ctx}/order/app/subject/order`,
        method: 'post',
        data
    });
}

// 生成支付链接
export function genPayUrl(orderId, params) {
    return request({
        url: `${ctx}/order/genPayUrl/${orderId}`,
        method: 'get',
        params
    });
}

/**
 * 取消订单
 */
export function cancelOrder(id) {
    return request({
        url: `${ctx}/order/cancel/${id}`,
        method: 'PUT'
    });
}

/**
 * 通过订单Id查询订单详情
 */
export function getBaseOrder(id) {
    return request({
        url: `${ctx}/order/${id}`,
        method: 'GET'
    });
}
