import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/examResult` : `${process.env.PE_API}/examResult`;

export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

export function waitReleasePage(data) {
    return request({
        url: `${ctx}/waitReleasePage`,
        method: 'post',
        data
    });
}

export function publishResult(param) {
    return request({
        url: `${ctx}/publishResult?examId=${param}`,
        method: 'get'
    });
}

/**
 * 成绩-复评-学员查询
 * @param data
 */
export function reviewExamPage(data) {
    return request({
        url: `${ctx}/reviewExamPage`,
        method: 'post',
        data
    });
}

/**
 * 成绩-复评-获取试卷信息
 * @param params
 */
export function reviewUserResult(params) {
    return request({
        url: `${ctx}/reviewUserResult`,
        method: 'get',
        params
    });
}

/**
 * 成绩-考试明细
 * @param data
 */
export function searchUserDetail(data) {
    return request({
        url: `${ctx}/searchUserDetail`,
        method: 'post',
        data
    });
}

/**
 * 成绩-考生考试信息
 * @param params
 */
export function getUserDetail(params) {
    return request({
        url: `${ctx}/getUserDetail`,
        method: 'get',
        params
    });
}

/**
 * 成绩-考生信息
 * @param params
 */
export function getExamResultDetail(params) {
    return request({
        url: `${ctx}/getExamResultDetail`,
        method: 'get',
        params
    });
}

export function exportResult(data) {
    return request({
        url: `${ctx}/exportResult`,
        method: 'post',
        data
    });
}

export function importResult(params) {
    return request({
        url: `${ctx}/importResult`,
        method: 'get',
        params
    });
}

