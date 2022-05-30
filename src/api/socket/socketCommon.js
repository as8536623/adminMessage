import request from '@/utils/request';

export function socketHostInfo() {
    return request({
        url: `${process.env.SOCKET_API}/socketCommon/hostInfo`,
        method: 'post'
    });
}
