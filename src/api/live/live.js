import request from '@/utils/request';
const ctx = `${process.env.MALL_API}/live`;

// 获取角色数据
export function gotoLive(params) {
    return request({
        url: `${ctx}/gotoLive`,
        method: 'get',
        params
    });
}
