import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
// import { formatGetParams } from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.SURVEY_API}/surveyItem` : `${process.env.SURVEY_API}/surveyItem`;

// 新增题目
export function save(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

// 获取问卷
export function getSurvey(templateId) {
    return request({
        url: `${ctx}/listAll/${templateId}`,
        method: 'get'
    });
}

// 删除题目
export function deleteSurveyItem(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}
