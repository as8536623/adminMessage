import request from '@/utils/request';
import {formatGetParams} from '@/utils/index';

const ctx = `${process.env.PE_API}/exercise`;

export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

export function enable(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'get',
        params: params
    });
}

export function disable(params) {
    return request({
        url: `${ctx}/disable`,
        method: 'get',
        params: params
    });
}

// 获取练习 code
export function getExerciseCode() {
    return request({
        url: `${ctx}/getExerciseCode`,
        method: 'get'
    });
}

// 获取练习 code
export function getExercise(params) {
    return request({
        url: `${ctx}/getExercise`,
        method: 'get',
        params
    });
}

// 练习-分析
export function exerciseItemAnalyze(params) {
    return request({
        url: `${ctx}/exerciseItemAnalyze${formatGetParams(params)}`,
        method: 'get'
    });
}

// 保存练习
export function exedciseSave(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

// 练习-分析
export function updateUserScope(params) {
    return request({
        url: `${ctx}/updateUserScope`,
        method: 'get',
        params
    });
}

