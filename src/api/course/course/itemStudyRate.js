import request from '@/utils/request';

const ctx = `${process.env.STU_API}/itemStudyRate`;

// 获取用户当前学习的位置
export function getItemStudyRate(params) {
    return request({
        url: `${ctx}/getItemStudyRate`,
        method: 'get',
        params
    });
}
