import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/stageTask` : `${process.env.MP_API}/stageTask`;

// 获取待选课程列表
export function listCourse(data) {
    return request({
        url: `${ctx}/listCourse`,
        method: 'post',
        data
    });
}
