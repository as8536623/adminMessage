// 课程相关分页
import request from '@/utils/request';

const ctx = `${process.env.STU_API}`;
const mallCtx = `${process.env.MALL_API}`;

/**
 * 获取热搜词
 */
export function listHotSearchKeyword() {
    return request({
        url: `${mallCtx}/portal/listHotKeywords`,
        method: 'get'
    });
}

export function listHotSearchKeywordWithType(type) {
    return request({
        url: `${mallCtx}/portal/listHotKeywords/${type}`,
        method: 'get'
    });
}

export function getPersonalRecommend() {
    return request({
        url: `${mallCtx}/portal/getPersonalRecommend`,
        method: 'get'
    });
}

/**
 * 搜索普通课程
 */
export function indexSearch(params) {
    return request({
        url: `${ctx}/portalCourseOperation/indexSearch`,
        method: 'get',
        params
    });
}

// 新课速递【通用】
export function courseNewGeneral(params) {
    return request({
        url: `${ctx}/portalCourseOperation/newCourse`,
        method: 'get',
        params
    });
}

// 热门课程
export function hotCourse(params) {
    return request({
        url: `${ctx}/portalCourseOperation/hotCourse`,
        method: 'get',
        params
    });
}

// 热门课程
export function getPreviewDemo(params) {
    return request({
        url: `${ctx}/portalCourseOperation/getPreviewDemo`,
        method: 'get',
        params
    });
}

// 推荐课程【课程详情页】
export function listRecommendForCourseDetail(params) {
    return request({
        // url: `https://yapi.qgutech.com/mock/43/bgk/course/recommend/new`,
        url: `${ctx}/portalCourseOperation/listRecommendForCourseDetail`,
        method: 'get',
        params
    });
}

// 公开课首页（最新好课、推荐课程）
export function courseGoodAndRecommend(params) {
    return request({
        url: `${ctx}/portalCourseOperation/listGoodOrRecommendCourse`,
        method: 'get',
        params
    });
}

// 公开课首页（免费好课）
export function courseFree(params) {
    return request({
        url: `${ctx}/portalCourseOperation/listFreeCourse`,
        method: 'get',
        params
    });
}

// 分类-推荐和最新好课
export function getRecommendOrNewCourse(params) {
    return request({
        url: `${ctx}/portalCourseOperation/getRecommendOrNewCourse`,
        method: 'get',
        params
    });
}

// 推荐课程（new）【课程详情页】--登录情况下
export function listRecommendCourseWithLogin(params) {
    return request({
        url: `${ctx}/portalCourseOperation/listRecommendCourseWithLogin`,
        method: 'get',
        params
    });
}

// 推荐课程（new）【课程详情页】--未登录情况下
export function listRecommendCourseWithoutLogin(params) {
    return request({
        url: `${ctx}/portalCourseOperation/listRecommendCourseWithoutLogin`,
        method: 'get',
        params
    });
}
