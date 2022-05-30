import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/judge` : `${process.env.PE_API}/judge`;

export function getMarkingInfo(params) {
    return request({
        url: `${ctx}/getMarkingInfo?examId=${params.examId}&userId=${params.userId}`,
        method: 'get'
    });
}

export function getWait(data) {
    return request({
        url: `${ctx}/waitPage`,
        method: 'post',
        data
    });
}

export function getMarked(data) {
    return request({
        url: `${ctx}/markedPage`,
        method: 'post',
        data
    });
}

export function getMarking(params) {
    return request({
        url: `${ctx}/getMarking`,
        method: 'get',
        params
    });
}

export function getMarkingPage(params) {
    return request({
        url: `${ctx}/getMarkingPage`,
        method: 'get',
        params
    });
}
