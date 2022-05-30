import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customerCharge`;

/**
 * 获取计费日志
 */
export function getBillingLogList(params) {
    return request({
        url: `${ctx}/queryChargeLogByPage`,
        method: 'get',
        params
    });
}
