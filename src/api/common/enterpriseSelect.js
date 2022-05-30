import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customerUserRel`;

/**
 * 获取关联客户的下拉列表
 */
export function getEnterpriseSelectList(data) {
    return request({
        url: `${ctx}/querySelectedCustomerUserRel`,
        method: 'post',
        data
    });
}
