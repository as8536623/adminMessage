import request from '@/utils/request';

const ctx = `${process.env.UC_API}/courseStatistics`;

/**
 * 课程使用统计列表
 */
export function getCustomerUseList(data) {
    return request({
        url: `${ctx}/querySelectedCustomerStatisticsByPage`,
        method: 'post',
        data
    });
}
/**
 * 客户使用统计头部
 */
export function getCustomerUseStatistics(data) {
    return request({
        url: `${ctx}/queryHeadCustomerStatistics`,
        method: 'post',
        data
    });
}
/**
 * 课程列表
 */
export function getCourseList(data) {
    return request({
        url: `${ctx}/querySelectedCourseList`,
        method: 'post'
    });
}

