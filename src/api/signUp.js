import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-enroll/enroll' : '/veln-enroll/enroll';

// 获取编号
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 获取List
export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}
// 报名基础信息
export function baseInfoEdit(data) {
    return request({
        url: `${ctx}/base`,
        method: 'post',
        data
    });
}

// 报名设置信息
export function settingInfoEdit(data) {
    return request({
        url: `${ctx}/setting`,
        method: 'post',
        data
    });
}

// 报名参与人员
export function participantsInfoEdit(data) {
    return request({
        url: `${ctx}/outUser`,
        method: 'post',
        data
    });
}

// 报名详情
export function getInfoById(params) {
    return request({
        url: `${ctx}/detail`,
        method: 'get',
        params
    });
}

// 报名删除
export function deleteSignUp(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 启用
export function enableSignUp(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'PUT',
        data
    });
}

// 停用
export function disableSignUp(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'PUT',
        data
    });
}

