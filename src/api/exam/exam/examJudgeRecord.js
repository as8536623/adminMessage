import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/examJudgeRecord` : `${process.env.PE_API}/examJudgeRecord`;

export function submitMarkExam(data) {
    return request({
        url: `${ctx}/evaluation`,
        method: 'post',
        data
    });
}
export function submitReviewMarkExam(data) {
    return request({
        url: `${ctx}/review`,
        method: 'post',
        data
    });
}
