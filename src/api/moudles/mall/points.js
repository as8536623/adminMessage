import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.IS;

/**
 *获取积分分页
 */
export function searchPoints(params) {
    return request({
        url: `${PREFIX}/rule/fuzzyQueryByName`,
        method: 'GET',
        params
    });
}

/**
 *编辑积分
 */
export function editPoints(data) {
    return request({
        url: `${PREFIX}/points/edit`,
        method: 'POST',
        data
    });
}

/**
 *编辑积分状态
 */
export function updatePointsStatus(data) {
    return request({
        url: `${PREFIX}/rule/edit/${data.id}`,
        method: 'POST',
        data
    });
}

/**
 *获取积分兑换分页
 */
export function searchPointsRedeem(params) {
    return request({
        url: `${PREFIX}/redeem/pointsRedeem/page`,
        method: 'GET',
        params
    });
}

/**
 *编辑积分兑换
 */
export function editPointsRedeem(data) {
    return request({
        url: `${PREFIX}/redeem/edit`,
        method: 'POST',
        data
    });
}

/**
 *编辑积分状态
 */
export function updatePointsRedeemStatus(data) {
    return request({
        url: `${PREFIX}/redeem/pointsRedeem/updateStatus`,
        method: 'POST',
        data
    });
}
