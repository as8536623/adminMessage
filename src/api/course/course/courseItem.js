import request from '@/utils/request';

const ctx = `${process.env.STU_API}/courseItem`;
const ctxOperation = `${process.env.STU_API}/portalCourseOperation`;

// 获取课程的内容
export function findByCourseId(params) {
    return request({
        url: `${ctx}/findByCourseId`,
        method: 'get',
        params
    });
}

/**
 * 获取课程目录
 */
export function getCourseItem(params) {
    return request({
        url: `${ctx}/app/courseItem`,
        method: 'get',
        params
    });
}

/**
 * 获取课程目录
 */
export function getOpenCourseItem(params) {
    return request({
        url: `${ctx}/open/courseItem`,
        method: 'get',
        params
    });
}

/**
 * 获取课程目录
 */
export function getCourseItemForOpen(params) {
    return request({
        url: `${ctxOperation}/courseItem`,
        method: 'get',
        params
    });
}

