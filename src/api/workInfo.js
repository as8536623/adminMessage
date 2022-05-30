/**
 * WorkInfoController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `/workInfo` : `${process.env.WORK_API}/workInfo`;

// 新增作业
export function addHomework(data) {
    return request({
        url: `${ctx}`,
        method: 'post',
        data
    });
}

// 新增作业
export function updateHomework(data) {
    return request({
        url: `${ctx}`,
        method: 'put',
        data
    });
}

// 删除作业
export function deleteHomework(data) {
    return request({
        url: `${ctx}`,
        method: 'delete',
        data
    });
}

// 获取作业唯一标识符
export function generateCode() {
    return request({
        url: `${ctx}/generateCode`,
        method: 'get'
    });
}

// 获取作业列表
export function getWorkPage(params) {
    return request({
        url: `${ctx}/page${formatGetParams(params)}`,
        method: 'get'
    });
}

// 查询作业信息
export function getWorkInfo(id) {
    return request({
        url: `${ctx}/${id}`,
        method: 'get'
    });
}

// 启用作业
export function enableWork(id) {
    return request({
        url: `${ctx}/enable/${id}`,
        method: 'put'
    });
}

// 停用作业
export function discontinuedWork(id) {
    return request({
        url: `${ctx}/discontinued/${id}`,
        method: 'put'
    });
}

// 二维码
export function qrCode(id) {
    return request({
        url: `${ctx}/generateQrCode/${id}`,
        method: 'get'
    });
}
