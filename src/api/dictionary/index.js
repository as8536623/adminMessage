import request from '@/utils/request';

const ctx = `${process.env.STU_API}/dictionary`;

// 获取学科、行业、职业基础数据
export function listByLevelAndCode(params) {
    return request({
        url: `${ctx}/listByLevelAndCode`,
        method: 'get',
        params
    });
}

// 获取学科、行业、职业基础数据
export function listByType(params) {
    return request({
        url: `${ctx}/listByType`,
        method: 'get',
        params
    });
}

// 获取筛选标签
export function listByTag() {
    return request({
        url: `${process.env.TAG_API}/labelCategory/listCategoryAndLabel`,
        method: 'get'
    });
}
