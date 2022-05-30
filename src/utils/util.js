/**
 *  工具类
 */

/**
 * 删除对象里面特定的key值
 * @param result 结果集
 * @param delparam 删除的key，模糊匹配
 */
export function deleteParam(result, delparam) {
    try {
        if (!result || !delparam) {
            return result;
        }
        const delArr = [];
        for (const key in result) {
            if (key.indexOf(delparam) === 0) {
                delArr.push(key);
            }
        }
        if (delArr.length <= 0) {
            return result;
        }
        delArr.forEach(item => {
            delete result[item];
        });
        return result;
    } catch (e) {
        return result;
    }
}

// 价格保留两位小数
export const numFixed = (val, empty) => {
    if (parseInt(val) >= 0) {
        return parseFloat(val).toFixed(2);
    } else {
        return empty || '0.00';
    }
};
