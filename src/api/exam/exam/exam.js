import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/exam` : `${process.env.PE_API}/exam`;

// 获取code值
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 生成试卷
export function checkPaperTemplate(param) {
    return request({
        url: `${ctx}/checkPaperTemplate?templateId=${param}`,
        method: 'get'
    });
}

export function countPaper(params) {
    return request({
        url: `${ctx}/countPaper`,
        method: 'get',
        params: params
    });
}

// 保存试卷
export function makePaper(data) {
    return request({
        url: `${ctx}/makePaper`,
        method: 'post',
        data
    });
}

// 保存试卷
export function searchPaperPage(params) {
    return request({
        url: `${ctx}/searchPaperPage`,
        method: 'get',
        params: params
    });
}

// 考试-基本信息
export function saveInfo(data) {
    return request({
        url: `${ctx}/saveExamInfo`,
        method: 'post',
        data
    });
}

// 删除
export function deleteHandel(data) {
    return request({
        url: `${ctx}/deleteExamList`,
        method: 'delete',
        data
    });
}

// 启用
export function enable(data) {
    return request({
        url: `${ctx}/enableExam`,
        method: 'post',
        data
    });
}

// 停用
export function disable(param) {
    return request({
        url: `${ctx}/invalidExam?examId=${param}`,
        method: 'get'
    });
}

// 考试-考试设置
export function saveSetting(data) {
    return request({
        url: `${ctx}/saveSetting`,
        method: 'post',
        data
    });
}

// 考试-考试设置
export function updateArrange(data) {
    return request({
        url: `${ctx}/updateArrange`,
        method: 'post',
        data
    });
}

// 考试基本信息
export function getInfo(param) {
    return request({
        url: `${ctx}/getExamInfo?id=${param}`,
        method: 'get'
    });
}

// 考试设置信息
export function getSettingInfo(param) {
    return request({
        url: `${ctx}/getSettingInfo?id=${param}`,
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

/**
 * 是否是系统管理员
 */
export function isSuperAdmin() {
    return request({
        url: `${ctx}/isSuperAdmin`,
        method: 'get'
    });
}

/**
 * 删除试卷
 */
export function deletePaper(params) {
    return request({
        url: `${ctx}/deletePaper`,
        method: 'post',
        params: params
    });
}

// 考试设置信息
export function listExamArrange(param) {
    return request({
        url: `${ctx}/listExamArrange?examId=${param}`,
        method: 'get'
    });
}

// 添加批次
export function addArrange(param) {
    return request({
        url: `${ctx}/addArrange?examId=${param}`,
        method: 'get'
    });
}

// 删除批次
export function deleteArrange(param) {
    return request({
        url: `${ctx}/deleteArrange?arrangeId=${param}`,
        method: 'get'
    });
}

// 获取考试设置
export function getExamSetting(param) {
    return request({
        url: `${ctx}/getExamSetting?examId=${param}`,
        method: 'get'
    });
}

/**
 * 保存考试设置
 */
export function saveExamSetting(data) {
    return request({
        url: `${ctx}/saveExamSetting`,
        method: 'post',
        data
    });
}

/**
 * 复制考试
 */
export function copyExam(data) {
    return request({
        url: `${ctx}/copyExam`,
        method: 'post',
        data
    });
}

/**
 * 复制考试
 */
export function cancelExam(param) {
    return request({
        url: `${ctx}/invalidExam?examId=${param}`,
        method: 'get'
    });
}

/**
 * 删除试题
 * @param params
 */
export function deletePaperItem(params) {
    return request({
        url: `${ctx}/deletePaperItem`,
        method: 'get',
        params
    });
}

/**
 * 试题移动
 * @param params
 */
export function movePaperItem(params) {
    return request({
        url: `${ctx}/movePaperItem`,
        method: 'get',
        params
    });
}

/**
 * 更新试题分值
 * @param params
 */
export function updatePaperMark(data) {
    return request({
        url: `${ctx}/updatePaperMark`,
        method: 'post',
        data
    });
}

/**
 * 保存试题
 * @param data
 */
export function savePaperItem(data) {
    return request({
        url: `${ctx}/savePaperItem`,
        method: 'post',
        data
    });
}

/**
 * 获取试卷
 * @param params
 */
export function getPaper(params) {
    return request({
        url: `${ctx}/getPaper`,
        method: 'get',
        params
    });
}

/**
 * 获取试题详情
 * @param params
 */
export function getItemDetail(params) {
    return request({
        url: `${ctx}/getItemDetail`,
        method: 'get',
        params
    });
}

/**
 * 通知学员参加考试
 * @param data
 */
export function noticeArrangeUser(data) {
    return request({
        url: `${ctx}/noticeArrangeUser`,
        method: 'post',
        data
    });
}

/**
 * 下载试题详情
 * @param params
 */
export function downloadPaper(params) {
    return request({
        url: `${ctx}/manage/exportPaper`,
        method: 'get',
        params
    });
}

/**
 * 获取补考
 * @param params
 */
export function getMarkUpArrange(params) {
    return request({
        url: `${ctx}/getMarkUpArrange`,
        method: 'get',
        params
    });
}

/**
 * 修改补考
 * @param data
 */
export function saveMarkUpArrange(data) {
    return request({
        url: `${ctx}/saveMarkUpArrange`,
        method: 'post',
        data
    });
}
