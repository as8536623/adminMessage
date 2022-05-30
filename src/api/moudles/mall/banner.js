import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `banner`;

/**
 * 根据类型，查询banner数据
 * @param displayType banner类型
 */
export function listAdminBanner(displayType) {
    return request({
        url: `${PREFIX}/admin/list/${displayType}`,
        method: 'GET'
    });
}

/**
 * 发布banner
 * @param displayType 类型
 * @param data 数据
 */
export function publish(displayType, data) {
    return request({
        url: `${PREFIX}/admin/publish/${displayType}`,
        method: 'POST',
        data
    });
}
