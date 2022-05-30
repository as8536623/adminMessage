import request from '@/utils/request';

const ctx = `${process.env.CS_API}/feign`;

// 获取UC服务
export function getUcService(params) {
    return request({
        url: `${ctx}/get`,
        method: 'get',
        params
    });
}
