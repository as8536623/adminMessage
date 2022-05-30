import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CS_API}/loginSetting` : `${process.env.CS_API}/loginSetting`;

// 获取登录相关设置信息
export function loginSetting() {
    return request({
        url: `${ctx}`,
        method: 'get'
    });
}

// 获取密码相关设置
export function getPasswordSetting() {
    return request({
        url: `${ctx}/getPasswordSetting`,
        method: 'get'
    });
}

// 编辑
export function editSetting(data) {
    return request({
        url: `${ctx}/${data.editType}`,
        method: 'PUT',
        data
    });
}
