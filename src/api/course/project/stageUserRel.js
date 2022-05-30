import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/stageUserRel` : `${process.env.MP_API}/stageUserRel`;

// 监控-学员阶段详情-手动升级接口
export function upgradeManual(data) {
    return request({
        url: `${ctx}/upgradeManual?proId=${data.proId}&userId=${data.userId}`,
        method: 'post'
    });
}

// 监控-学员阶段详情-批量手动升级接口
export function upgradeManualBatch(data) {
    return request({
        url: `${ctx}/upgradeManualBatch`,
        method: 'post',
        data
    });
}

