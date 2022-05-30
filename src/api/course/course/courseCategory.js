import request from '@/utils/request';

const ctx = `${process.env.STU_API}/courseCategory`;

/**
 * 获取类别
 */
export function getCategory() {
    return request({
        url: `${ctx}/getCanManageTree`,
        method: 'get'
    });
}

// 新增
export function insertNode(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 编辑
export function updateNode(data) {
    return request({
        url: `${ctx}/update`,
        method: 'POST',
        data
    });
}

// 删除
export function deleteNode(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

// 移动
export function moveNode(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 保存开放范围
export function updateScope(params) {
    return request({
        url: `${ctx}/updateScope`,
        method: 'post',
        params
    });
}

/**
 * 获取类别
 */
export function getCategoryForPublicIndex() {
    return request({
        url: `${process.env.STU_API}/portalCourseOperation/getCategoryWithNoAuth`,
        method: 'get'
    });
}

/**
 * 获取课程根类别
 */
export function getRootCourseCategory() {
    return request({
        url: `${process.env.STU_API}/portalCourseOperation/getRootCourseCategory`,
        method: 'get'
    });
}

// 查询一级类别
export function listFirstLevelCategory() {
    return request({
        url: `${ctx}/listFirstLevelCategoryWithoutAuth`,
        method: 'get'
    });
}

// 同步课程-类型
export function getSyncTypeOptions() {
    return request({
        url: `${process.env.STU_API}/courseSynchronize/categories`,
        method: 'get',
        params: {
            testFlag: process.env.NODE_ENV !== 'production'
        }
    });
}

// 同步课程-工种
export function getSyncTypeWorkOptions(params) {
    return request({
        url: `${process.env.STU_API}/courseSynchronize/projects`,
        method: 'get',
        params: {
            ...params,
            testFlag: process.env.NODE_ENV !== 'production'
        }
    });
}

// 同步课程-等级
export function getSyncTypeGradeOptions(params) {
    return request({
        url: `${process.env.STU_API}/courseSynchronize/grades`,
        method: 'get',
        params: {
            ...params,
            testFlag: process.env.NODE_ENV !== 'production'
        }
    });
}

// 同步课程-职业
export function getSyncJobOptions(params) {
    return request({
        url: `${process.env.STU_API}/courseNewSync/listJob`,
        method: 'get',
        params
    });
}

// 同步课程-版权
export function getSyncCopyrightOptions(params) {
    return request({
        url: `${process.env.STU_API}/courseNewSync/listCopyright`,
        method: 'get',
        params
    });
}

// 同步课程-江西
export function getSyncCourse(data) {
    return request({
        url: `${process.env.STU_API}/courseSynchronize/addCourse`,
        method: 'post',
        data: {...data, testFlag: process.env.NODE_ENV !== 'production'}
    });
}

// 同步课程-湖南
export function syncHnCourse(params) {
    return request({
        url: `${process.env.STU_API}/courseSynchronize/syncHNCourse`,
        method: 'get',
        params: {
            ...params
        }
    });
}

// 同步课程-中控平台
export function syncCenterCourse(params) {
    return request({
        url: `${process.env.STU_API}/courseNewSync/syncCourse`,
        method: 'post',
        params: {
            ...params
        }
    });
}
