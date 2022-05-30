import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.SURVEY_API}/surveyUser` : `${process.env.SURVEY_API}/surveyUser`;

// 调查问卷-学员分页
export function surveyUserPage(params) {
    return request({
        url: `${ctx}/page${formatGetParams(params)}`,
        method: 'get'
    });
}

// 调查问卷-获取详情
export function getUserCount(id) {
    return request({
        url: `${ctx}/getUserCount/${id}`,
        method: 'get'
    });
}
