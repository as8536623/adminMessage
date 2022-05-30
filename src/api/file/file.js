import request from '@/utils/request';

// 文件查询接口
export function getFileInfo(data) {
    return request({
        url: `${process.env.FS_API}/file/q`,
        method: 'post',
        data
    });
}
