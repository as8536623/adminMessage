import request from '@/utils/request';
const ctx = `${process.env.LOG_API}/loginLog`;

// 获取角色数据
export function getLoginLog(params) {
    return request({
        url: `${ctx}/pageLoginUserInfoLastSixMonth`,
        method: 'get',
        params
    });
}
