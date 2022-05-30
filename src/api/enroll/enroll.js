import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `/veln-enroll/enroll` : `/veln-enroll/enroll`;

// 保存学习项目报名
export function saveMpEnroll(data) {
    return request({
        url: `${ctx}/saveMpEnroll`,
        method: 'post',
        data
    });
}

// 学习项目回显
export function getMpEnrollInfo(param) {
    return request({
        url: `${ctx}/detail?id=${param}`,
        method: 'get'
    });
}

// 获取编号
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}
