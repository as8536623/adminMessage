import request from '@/utils/request';

const ctx = `${process.env.PE_API}/selectItem`;

export function removeItems(data) {
    return request({
        url: `${ctx}/removeItems`,
        method: 'post',
        data
    });
}

export function removeItemsForBgk(data) {
    return request({
        url: `${ctx}/removeItems/bgk`,
        method: 'post',
        data
    });
}
