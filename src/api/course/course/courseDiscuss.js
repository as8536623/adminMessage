import request from '@/utils/request';

const ctx = `${process.env.STU_API}/courseDiscuss`;

// 获取讨论列表
export function searchCourseDiscuss(params) {
    return request({
        url: `${ctx}/all/page`,
        method: 'get',
        params
    });
}

// 课程笔记详情
export function saveCourseDiscuss(data) {
    return request({
        url: `${ctx}/saveCourseDiscuss`,
        method: 'POST',
        data
    });
}
