import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-k12/groupMember' : '/veln-k12/groupMember';

/**
 * 获取人员分页
 */
export function groupMemberPage(params) {
    return request({
        url: `${ctx}/search`,
        method: 'get',
        params
    });
}

/**
 * 批量删除群组人员
 */
export function deleteUsers(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data: params
    });
}
