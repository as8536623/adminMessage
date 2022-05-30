import request from '@/utils/request';

const ctx = `${process.env.UC_API}/courseStatistics`;

/**
 * 课程使用统计列表
 */
export function getCourseUseList(data) {
    return request({
        url: `${ctx}/querySelectedCourseStatisticsByPage`,
        method: 'post',
        data
    });
}
/**
 * 课程使用统计头部
 */
export function getCourseUseStatistics(data) {
    return request({
        url: `${ctx}/queryHeadCourseStatistics`,
        method: 'post',
        data
    });
}
