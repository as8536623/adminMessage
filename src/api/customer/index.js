import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customer`;

/**
 * 获取客户分页
 */
export function getCustomerPage(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

/**
 * 保存客户
 */
export function saveCustomer(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

/**
 * 保存客户
 */
export function getCustomer(params) {
    return request({
        url: `${ctx}/get`,
        method: 'get',
        params
    });
}

/**
 * 启用客户
 */
export function enable(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'post',
        params
    });
}

/**
 * 停用客户
 */
export function disable(params) {
    return request({
        url: `${ctx}/disable`,
        method: 'post',
        params
    });
}

/**
 * 开启关闭计费
 * @params customerId 客户ID
 * @params chargeType 是否启用收费:0-关闭；1-启用
 */
export function startCharging(data) {
    return request({
        url: `${ctx}/editCharge`,
        method: 'PUT',
        data
    });
}

/**
 * 设置收费标准
 * @params customerId 客户ID
 * @params chargeLevel 收费标准 单位：元
 */
export function chargingStandard(data) {
    return request({
        url: `${ctx}/setChargeLevel`,
        method: 'PUT',
        data
    });
}
