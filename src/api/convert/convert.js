import request from '@/utils/request';
const ctx = `${process.env.STU_API}/convert`;

export function getRequest(params) {
    return request({
        url: `${ctx}/share/getDataByUrl`,
        method: 'get',
        params
    });
}
