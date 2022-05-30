import request from '@/utils/request';

const ctx = `${process.env.STU_API}/courseNote`;
const ctxOperation = `${process.env.STU_API}/portalCourseOperation`;
const ctxPersonCenter = `${process.env.STU_API}/personCenter`;

export function teacherNoteInsert(data) {
    return request({
        url: `https://yapi.qgutech.com/mock/43/bgk/note/insert`,
        method: 'post',
        data
    });
}

// 获取课程笔记分页
export function courseNotePage(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 分页展示我的课程笔记列表
export function pageMyNotes(params) {
    return request({
        url: `${ctxPersonCenter}/pageMyNotes`,
        method: 'get',
        params
    });
}

// 分页展示所有用户的笔记
export function pageAllUserNotes(params) {
    return request({
        url: `${ctxOperation}/pageAllUserNotes`,
        method: 'get',
        params
    });
}

// 删除我的课程下所有的笔记
export function deleteAllMyCourseNote(courseId) {
    return request({
        url: `${ctxPersonCenter}/deleteAllMyCourseNote/${courseId}`,
        method: 'delete'
    });
}

// 删除我的单条笔记
export function deleteMyNote(id) {
    return request({
        url: `${ctxPersonCenter}/deleteMyNote/${id}`,
        method: 'delete'
    });
}

// 保存我的笔记
export function saveCourseNote(data) {
    return request({
        url: `${ctx}/saveCourseNote`,
        method: 'POST',
        data
    });
}

// 编辑保存我的笔记
export function updateCourseNote(id, data) {
    return request({
        url: `${ctx}/updateCourseNote/${id}`,
        method: 'put',
        data
    });
}
