import request from '@/utils/request';

const ctx = `${process.env.STU_API}/subject`;

// 项目监控能量石列表导出
export function getSubjectPage(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

/**
 * 专题详情
 */
export function getSubject(id) {
    return request({
        url: `${ctx}/${id}`,
        method: 'get'
    });
}

/**
 * 专题课程
 */
export function getSubjectCourse(id) {
    return request({
        url: `${ctx}/listRefer/${id}`,
        method: 'get'
    });
}
