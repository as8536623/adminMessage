import request from '@/utils/request';

// 获取客户列表数据
export function getClientList(params) {
    return request({
        url: `https://yapi.qgutech.com/mock/41/bgk/client/list`,
        method: 'get',
        params
    });
}

// 获取导出文件ID
export function getExportExcelFileId(id, params) {
    return request({
        url: `${process.env.STU_API}/export/exportCustomerCourseInfo/${id}`,
        method: 'get',
        params
    })
}

// 导出所有课程
export function exportAllCourse() {
    return request({
        url: `${process.env.STU_API}/export/exportCourseData`,
        method: 'get'
    })
}

export function getExportCourseExcelFileId(data) {
    return request({
        url: `${process.env.STU_API}/export/exportCourseInfo`,
        method: 'post',
        data
    })
}


// 获取导出文件ID
export function getExportCourseUrlExcelFileId(id, params) {
    return request({
        url: `${process.env.STU_API}/export/exportCustomerCourseUrlInfo/${id}`,
        method: 'get',
        params
    })
}
