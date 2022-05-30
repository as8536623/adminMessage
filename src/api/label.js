import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-tag/label' : '/veln-tag/label';

// 获取List
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}
// 标签新增
export function editLabel(data) {
    return request({
        url: `${ctx}/save`,
        method: 'POST',
        data
    });
}

// 获取标签详情

export function getLabelDetail(params) {
    return request({
        url: `${ctx}/get/${params.id}`,
        method: 'get'
    });
}

// 标签删除
export function deleteLabel(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data: params
    });
}

export function listByLabelType(params) {
    return request({
        url: `${ctx}/listByApp/${params.labelType}`,
        method: 'get'
    });
}
