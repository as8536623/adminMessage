import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
// import { formatGetParams } from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.SURVEY_API}/surveyTemplate` : `${process.env.SURVEY_API}/surveyTemplate`;

// 保存问卷
export function templateSave(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}
