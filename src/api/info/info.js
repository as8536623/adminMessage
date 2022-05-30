import request from '@/utils/request';

const ctx = `${process.env.NEWS_API}/info`;

/**
 * 保存资讯
 */
export function saveNews(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

/**
 * 资讯分页
 */
export function newsPage(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

/**
 * 资讯启用
 */
export function enableNews(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'post',
        data
    });
}

/**
 * 资讯禁用
 */
export function disableNews(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'post',
        data
    });
}

/**
 * 资讯删除
 */
export function deleteNews(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data
    });
}

/**
 * 根据ID获取资讯
 */
export function getNewsById(params) {
    return request({
        url: `${ctx}/getInfo`,
        method: 'get',
        params
    });
}
