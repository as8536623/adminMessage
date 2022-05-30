import request from '@/utils/request';

const ctx = '/qgyun-service-workflow/userComponent';

// 获取已选人员
export function searchUser(data) {
    return request({
        url: `${ctx}/searchSelected`,
        method: 'post',
        data
    });
}
