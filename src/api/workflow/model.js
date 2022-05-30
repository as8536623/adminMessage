import request from '@/utils/request';

const ctx = '/qgyun-service-workflow/model';

export function getDeployedModelByKey(key) {
    return request({
        url: `${ctx}/getDeployedModelByKey/${key}`,
        method: 'get'
    });
}
