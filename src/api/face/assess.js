import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.FACE_API}/assessCondition` : `${process.env.FACE_API}/assessCondition`;

// 查询考核条件
export function getAssessCondition(params) {
    return request({
        url: `${ctx}/getAssessCondition`,
        method: 'get',
        params
    });
}

// 新增考核条件
export function insert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}
