/**
 * Fs
 * @author yuqiusuo
 */

import request from '@/utils/request';
// import {getCtx} from "@/utils/dev";

// const ctx = getCtx() ? getCtx() + "" : "";

// 获取文件 tree
export function getFileCommonTree() {
    return request({
        url: `${process.env.FS_API}/commonTree/file_category`,
        method: 'get'
    });
}

// 获取文件分页
export function getFilePage(params) {
    const data = params;
    return request({
        url: `${process.env.FS_API}/file/page`,
        method: 'post',
        params,
        data
    });
}

// 文件关联信息 新增
export function fileRel(obj) {
    const {fileIds, appCode, funCode, quotedName} = obj;
    const data = fileIds;
    const params = {
        appCode,
        funCode,
        quotedName
    };
    return request({
        url: `${process.env.FS_API}/fileRel/`,
        method: 'post',
        params,
        data
    });
}
