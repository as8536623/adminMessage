import request from '@/utils/request';

/**
 * 启用
 */
export function enable(PREFIX, id) {
    return request({
        url: PREFIX + `/enable/${id}`,
        method: 'put'
    });
}

/**
 * 禁用
 */
export function disable(PREFIX, id) {
    return request({
        url: PREFIX + `/disable/${id}`,
        method: 'put'
    });
}

/**
 * 置顶开关
 */
export function switchTop(PREFIX, id) {
    return request({
        url: PREFIX + `/switchTop/${id}`,
        method: 'put'
    });
}

export function modifyShowOrder(PREFIX, operationId, showOrder) {
    return request({
        url: PREFIX + `/modifyShowOrder/${operationId}?showOrder=${showOrder}`,
        method: 'put'
    });
}

/**
 * 批量删除
 */
export function batchDelete(PREFIX, data) {
    return request({
        url: PREFIX + `/delete`,
        method: 'delete',
        data
    });
}

export function Operational(enable, disable, switchTop, modifyShowOrder, batchDelete) {
    this.enable = enable;
    this.disable = disable;
    this.switchTop = switchTop;
    this.modifyShowOrder = modifyShowOrder;
    this.batchDelete = batchDelete;
}
