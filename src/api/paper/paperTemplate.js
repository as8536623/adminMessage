import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/paperTemplate` : `${process.env.PE_API}/paperTemplate`;

/**
 * 试卷分页
 */
export function search(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

/**
 * 试卷编号
 */
export function getPaperCode() {
    return request({
        url: `${ctx}/getPaperCode`,
        method: 'get'
    });
}

/**
 * 获取基本信息详情
 */
export function getBasic(params) {
    return request({
        url: `${ctx}/getBasic`,
        method: 'get',
        params
    });
}

/**
 * 基本信息保存
 */
export function saveBasic(data) {
    return request({
        url: `${ctx}/saveBaseInfo`,
        method: 'post',
        data
    });
}

/**
 * 待选试题
 */
export function searchWaitItem(data) {
    return request({
        url: `${ctx}/findWaitItem`,
        method: 'post',
        data
    });
}

/**
 * 已选试题
 * @param data
 */
export function searchSelectFixItem(data) {
    return request({
        url: `${ctx}/findFixItem`,
        method: 'post',
        data
    });
}

/**
 * 保存已选试题
 */
export function saveFixed() {
    return request({
        url: `${ctx}/saveFixed`,
        method: 'post'
    });
}

/**
 * 获取必考题信息
 * @param params
 */
export function findFixedItem(params) {
    return request({
        url: `${ctx}/findFixedItem`,
        method: 'get',
        params
    });
}

/**
 * 上下移动
 */
export function moveMustItem(data) {
    return request({
        url: `${ctx}/moveMustItem`,
        method: 'get',
        params: data
    });
}

/**
 * 删除
 * @param data
 */
export function deleteFixed(data) {
    return request({
        url: `${ctx}/removeFixed`,
        method: 'post',
        data
    });
}

/**
 * 启用
 * @param params
 */
export function enable(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'get',
        params: params
    });
}
/**
 * 停用
 * @param data
 */
export function disabled(data) {
    return request({
        url: `${ctx}/disabled`,
        method: 'post',
        data
    });
}
/**
 * 停用
 * @param data
 */
export function deletePaper(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data
    });
}

/**
 * 随机题--选择
 * @param data
 */
export function findCountItem(data) {
    return request({
        url: `${ctx}/findCountItem`,
        method: 'post',
        data
    });
}

/**
 * 随机题保存
 * @param data
 */
export function saveRandomPaper(data) {
    return request({
        url: `${ctx}/saveRandomPaper`,
        method: 'post',
        data
    });
}

/**
 * 根据id获取随机题详情
 * @param params
 */
export function getRandomInfo(params) {
    return request({
        url: `${ctx}/getRandomInfo?templateId=${params.id}`,
        method: 'get'
    });
}

/**
 * 试卷预览
 * @param params
 */
export function viewPaper(params) {
    return request({
        url: `${ctx}/getPaperDetail?templateId=${params.id}`,
        method: 'get'
    });
}

/**
 * 保存为草稿
 * @param params
 */
export function updateStatus(params) {
    return request({
        url: `${ctx}/updateStatus`,
        method: 'get',
        params
    });
}

/**
 * 随机题选择-预览
 * @param params
 */
export function viewItem(params) {
    return request({
        url: `${ctx}/viewItem`,
        method: 'get',
        params
    });
}
/**
 * 随机题选择-预览基本信息
 * @param params
 */
export function viewBank(params) {
    return request({
        url: `${ctx}/viewBank`,
        method: 'get',
        params
    });
}
