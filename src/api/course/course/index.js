import request from '@/utils/request';

const ctx = `${process.env.STU_API}/course`;
const ctxOperation = `${process.env.STU_API}/portalCourseOperation`;
const ctxCourseUser = `${process.env.STU_API}/portalCourseUser`;

export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 全部课程获取List
export function getList(params) {
    return request({
        url: `${process.env.STU_API}/portalCourseOperation/pageCourseForPublicIndex`,
        method: 'get',
        params
    });
}

// 新增--第一步
export function appSave(data) {
    return request({
        url: `${ctx}/appSave`,
        method: 'POST',
        data
    });
}

// 新增--第二步
export function courseContent(params) {
    return request({
        url: `${ctx}/courseContent`,
        method: 'POST',
        data: params
    });
}

// 新增--第三步
export function openScope(params) {
    return request({
        url: `${ctx}/openScope`,
        method: 'POST',
        data: params
    });
}

// 编辑
export function updateCourse(data) {
    return request({
        url: `${ctx}/update`,
        method: 'POST',
        data
    });
}

// 根据课程ID获取详情描述
export function getIntroduceById(courseId) {
    return request({
        url: `${ctxOperation}/introduce/${courseId}`,
        method: 'get'
    });
}

// 课程详细信息
export function getCourse(id) {
    return request({
        url: `${ctx}/detail/` + id,
        method: 'get'
    });
}

// 获取课程详情
export function getCourseById({id}) {
    return request({
        url: `${ctx}/detail?id=${id}`,
        method: 'get'
    });
}

// 获取课程审核状态
export function courseAudit(params) {
    return request({
        url: `https://yapi.qgutech.com/mock/43/bgk/course/audit`,
        method: 'get',
        params
    });
}

// 获取课程评价
export function getCourseJudge(params) {
    return request({
        url: `${ctxOperation}/listCourseJudge`,
        method: 'get',
        params
    });
}

// 获取课程讲师笔记
export function getCourseTeacherNote(params) {
    return request({
        url: `https://yapi.qgutech.com/mock/43/bgk/course/teacherNote`,
        method: 'get',
        params
    });
}

/**
 * 课程详情
 * @param params
 */
export function getCourseDetail(params) {
    return request({
        url: `https://kty.kttx.cn/api/veln-stu/course/detail/4OXJFOJNo3KysydX7AP`,
        method: 'get'
    });
}

/**
 * 获取课程的基本信息
 */
export function getBasicInfoByCourseId(id) {
    return request({
        url: `${ctx}/getBasicInfo/${id}`,
        method: 'GET'
    });
}

/**
 * 课程详情
 * @param params
 */
export function getOpenCourseInfo(params) {
    return request({
        url: `${process.env.STU_API}/portalCourseOperation/getOpenCourseInfo`,
        method: 'get',
        params
    });
}

/**
 * 记录用户进入课程观看
 */
export function recordEnter(id) {
    return request({
        url: `${ctxCourseUser}/recordEnter/${id}`,
        method: 'get'
    });
}

/**
 * 公开课课程播放页
 */
export function getOpenCourseForPlay(id) {
    return request({
        url: `${ctx}/getOpenCourseForPlay/${id}`,
        method: 'get'
    });
}

/**
 * 公开课课程播放页
 */
export function openCourseInfo(id) {
    return request({
        url: `${ctx}/open/${id}`,
        method: 'get'
    });
}

/**
 * 教师工作室 - 视频课程
 * @param params
 */
export function getCourseByTeacherId(params) {
    return request({
        url: `${ctxOperation}/share/listCourseByTeacherId`,
        method: 'get',
        params: params
    });
}

/**
 * 获取课程列表
 * @param params
 */
export function getCourseList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params: params
    });
}

/**
 * 获取审核课程列表
 * @param params
 */
export function getOpenCourseList(params) {
    return request({
        url: `${ctx}/openApproveSearch`,
        method: 'get',
        params: params
    });
}

/**
 * 提交、再次提交课程审核
 * @param params
 */
export function submitOuterCourse(params) {
    return request({
        url: `${ctx}/submitCourse`,
        method: 'post',
        params: params
    });
}

/**
 * 移除课程
 * @param params
 */
export function removeOuterCourse(params) {
    return request({
        url: `${ctx}/removeCourse`,
        method: 'post',
        params: params
    });
}

/**
 * 查看课程审核驳回原因
 * @param params
 */
export function getRejectReason(params) {
    return request({
        url: `${ctx}/getRejectReason`,
        method: 'get',
        params: params
    });
}
