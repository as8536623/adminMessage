import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customerRecharge`;

/**
 * 获取充值列表
 */
export function getRechargeList(data) {
    return request({
        url: `${ctx}/querySelectedCustomerReChargeLogByPage`,
        method: 'post',
        data
    });
}
/**
 * 获取充值金额
 */
export function getCustomerSumAmount(data) {
    return request({
        url: `${ctx}/querySelectedCustomerSumAmount`,
        method: 'post',
        data
    });
}
/**
 * 去支付
 */
export function getCustomerRecharge(data) {
    return request({
        url: `${ctx}/recharge`,
        method: 'post',
        data
    });
}
/**
 * 去支付
 */
export function getRechargeResult(data) {
    return request({
        url: `${ctx}/insertRechargeLog`,
        method: 'post',
        data
    });
}
