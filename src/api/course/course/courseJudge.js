import request from '@/utils/request';

const ctx = `${process.env.STU_API}/courseJudge`;

// 发布评论
export function submitComment(data) {
    return request({
        url: `${ctx}/add`,
        method: 'POST',
        data
    });
}

// 发布评论
export function getComment(params) {
    return request({
        url: `${ctx}/getCourseJudge`,
        method: 'get',
        params
    });
}
