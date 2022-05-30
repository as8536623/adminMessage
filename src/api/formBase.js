import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-enroll/formBase' : '/veln-enroll/formBase';

// 报名设置信息--系统字段
export function listAll() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}
