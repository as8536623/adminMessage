import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/groupMember`;

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

/**
 * 批量加入班级
 */
export function batchInsert(data) {
    return request({
        url: `${ctx}/insertClassroom`,
        method: 'post',
        data: data
    });
}
