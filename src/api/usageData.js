import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customerUsageData`;

// 获取详情
export function getInfo(data) {
    return request({
        url: `${ctx}/getDetail`,
        method: 'post',
        data
    });
}

// 获取cdn域名
export function listDomain() {
    return request({
        url: `${process.env.UC_API}/customer/listIdAndName`,
        method: 'get'
    });
}

// 导出流量数据
export function exportUsageData(params) {
    return request({
        url: `${process.env.STU_API}/export/exportUsageData`,
        method: 'get',
        params
    });
}
