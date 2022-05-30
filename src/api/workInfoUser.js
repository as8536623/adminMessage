/**
 * WorkInfoController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.WORK_API}/user` : `${process.env.WORK_API}/user`;

// 根据作业id获取学员状态统计
export function statistics(params) {
    return request({
        url: `${ctx}/statistics/${params.id}`,
        method: 'get'
    });
}

// 获取作业-人员列表
export function getWorkUserPage(params) {
    return request({
        url: `${ctx}/page${formatGetParams(params)}`,
        method: 'get'
    });
}

// 个人评分 & 评语
export function gradeAndRemark(params) {
    return request({
        url: `${ctx}/toGradeAndRemark/${params.id}`,
        method: 'put',
        params
    });
}

// 批量评分
export function toGrade(data) {
    return request({
        url: `${ctx}/toGrade`,
        method: 'put',
        data
    });
}

// 通过/未通过
export function toJudge(data, type) {
    return request({
        url: `${ctx}/toJudge/${type}`,
        method: 'put',
        data
    });
}

// 提醒参加
export function remindToComplete(data) {
    return request({
        url: `${ctx}/remindToComplete`,
        method: 'post',
        data
    });
}

// 学员详情
export function getUserDetail(id) {
    return request({
        url: `${ctx}/getUserDetail/${id}`,
        method: 'get'
    });
}

// 根据id获取对应作业详情
export function loadDetail(id) {
    return request({
        url: `${ctx}/loadDetail/${id}`,
        method: 'get'
    });
}
