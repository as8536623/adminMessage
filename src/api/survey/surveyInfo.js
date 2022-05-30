import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.SURVEY_API}/surveyInfo` : `${process.env.SURVEY_API}/surveyInfo`;

// 调查问卷分页
export function surveyPage(params) {
    return request({
        url: `${ctx}/page${formatGetParams(params)}`,
        method: 'get'
    });
}

// 调查问卷 获取编号
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 调查问卷 获取编号
export function save(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

// 调查问卷 获取问卷详情
export function getInfoById(id) {
    return request({
        url: `${ctx}/get/${id}`,
        method: 'get'
    });
}

// 讲师管理-停用
export function surveyDisable(id) {
    return request({
        url: `${ctx}/disable/${id}`,
        method: 'get'
    });
}

// 讲师管理-启用
export function surveyEnable(id) {
    return request({
        url: `${ctx}/enable/${id}`,
        method: 'get'
    });
}

// 讲师管理-删除
export function surveyDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data
    });
}
