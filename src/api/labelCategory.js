import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-tag/labelCategory' : '/veln-tag/labelCategory';

// 获取List
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}
// 标签组新增
export function editLabelGroup(data) {
    return request({
        url: `${ctx}/save`,
        method: 'POST',
        data
    });
}

// 获取标签组详情

export function getLabelGroupDetail(params) {
    return request({
        url: `${ctx}/get/${params.id}`,
        method: 'get'
    });
}

// 标签组删除
export function deleteLabelGroup(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data: params
    });
}

// 获取所有标签组
export function labelCategoryAll() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}
