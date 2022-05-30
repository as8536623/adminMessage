/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone');
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

// 获取随机字符串
export function getRandomString(length, chars) {
    const len = (length || 19) - 1;
    const charStr = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const firstCharStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = firstCharStr[Math.floor(Math.random() * firstCharStr.length)];
    for (var i = len; i > 0; --i) { result += charStr[Math.floor(Math.random() * charStr.length)]; }
    return result;
}

// 处理分支节点字段 只适用于第一版本
export function formatBranch(node, index) {
    node.text = index === 1 ? '通过' : '不通过';
    node.field.conditionExpression = index === 1 ? 'YES' : 'NO';
    return node;
}
