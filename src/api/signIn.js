import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-sign/sign' : '/veln-sign/sign';

// 签到列表
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 获取编号
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}
// 签到基础信息
export function baseInfoEdit(data) {
    return request({
        url: `${ctx}/saveBase`,
        method: 'post',
        data
    });
}
// 签到设置信息
export function settingInfoEdit(data) {
    return request({
        url: `${ctx}/saveSetting`,
        method: 'post',
        data
    });
}

// 根据id获取对应实体
export function getInfoById(params) {
    return request({
        url: `${ctx}/getBasic/${params.id}`,
        method: 'get'
    });
}

// 删除签到
export function deleteSignIn(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 启用
export function enableSignIn(params) {
    return request({
        url: `${ctx}/enable/${params.id}`,
        method: 'get'
    });
}

// 停用
export function disableSignIn(params) {
    return request({
        url: `${ctx}/disable/${params.id}`,
        method: 'get'
    });
}

