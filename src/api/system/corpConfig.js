import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CS_API}/corpConfig` : `${process.env.CS_API}/corpConfig`;

// 获取当前公司预防措施或者其他设置
export function corpConfig() {
    return request({
        url: `${ctx}`,
        method: 'get'
    });
}

// 编辑公司预防措施设置
export function editCorpConfig(params) {
    return request({
        url: `${ctx}/${params.editType}`,
        method: 'PUT',
        params
    });
}

// 判断标签组件是否可用
export function inputTag() {
    return request({
        url: `${ctx}/inputTag`,
        method: 'get'
    });
}
