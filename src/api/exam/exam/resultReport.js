import request from '@/utils/request';

const ctx = `${process.env.PE_API}/resultReport`;

export function statisticOverview(data) {
    return request({
        url: `${ctx}/statisticOverview`,
        method: 'post',
        data
    });
}

// 考试成绩分布饼状图
export function statisticStatus(params) {
    return request({
        url: `${ctx}/statisticStatus`,
        method: 'get',
        params
    });
}

// 考试成绩分布直方图
export function statisticScore(params) {
    return request({
        url: `${ctx}/statisticScore`,
        method: 'get',
        params
    });
}
