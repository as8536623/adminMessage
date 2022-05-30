import request from '@/utils/request';

export function fetchData(params) {
    return request({
        url: `${process.env.STU_API}/data/share/getData`,
        method: 'get',
        params
    });
}

export function fetchCourseLearnData(query) {
    return request({
        url: '/statistics/course/data',
        method: 'get',
        params: query
    });
}
