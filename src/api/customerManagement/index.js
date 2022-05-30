import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/userComponent`;
// 获取数据
export function getData(url, params) {
    return request({
        url,
        method: 'get',
        params
    });
}
// 保存数据
export function postData(url, data) {
    return request({
        url,
        method: 'post',
        data
    });
}
// 选择、移除
export function putData(url, data) {
    return request({
        url,
        method: 'put',
        data
    });
}
/**
 * 获取是否有部门、群组、岗位 操作权限
 */
export function listRangOrg() {
    return request({
        url: `${ctx}/listRangOrg`,
        method: 'POST'
    });
}
