import {Message} from 'element-ui';

// 错误提示
export function errorMsg(message) {
    Message({
        type: 'error',
        duration: 5000,
        message
    });
}

// 正确提示
export function successMsg(message) {
    Message({
        type: 'success',
        duration: 1500,
        message
    });
}

// 提示
export function warnMsg(message) {
    Message({
        type: 'warning',
        duration: 5000,
        message
    });
}

// 提示
export function infoMsg(message) {
    Message({
        type: 'info',
        duration: 1500,
        message
    });
}
