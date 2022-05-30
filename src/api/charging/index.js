import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customerCourse`;

/**
 * 获取充值记录
 */
export function getChargingStandardList(data) {
    return request({
        url: `${ctx}/queryChargeLevelByPage`,
        method: 'post',
        data
    });
}

/**
 * 单个修改/批量修改收费标准
 */
export function setChargingStandard(data) {
    return request({
        url: `${ctx}/batchAddChargeLevel`,
        method: 'put',
        data
    });
}
