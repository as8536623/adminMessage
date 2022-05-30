import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.FACE_API}/stoneRecords` : `${process.env.FACE_API}/stoneRecords`;

// 获取分页
export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

// 新增接口
export function insert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 详情分页
export function getDetailList(data) {
    return request({
        url: `${ctx}/detail/page`,
        method: 'post',
        data
    });
}

// 详情
export function stoneRecords(params) {
    return request({
        url: `${ctx}/stoneRecords/${params.id}`,
        method: 'get'
    });
}

// 获取所有数据
export function listAll() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}

// 学员详情
export function detail(params) {
    return request({
        url: `${ctx}/detail`,
        method: 'get',
        params
    });
}
