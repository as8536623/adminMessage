import store from '@/store';
/**
 * 在元素前插入元素
 * @param {HTMLElement} newEl 新DOM元素
 * @param {HTMLElement} targetEl 在指定目标DOM元素前插入
 */
export function insertAfter(newEl, targetEl) {
    const parentEl = targetEl.parentNode;
    if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}

/**
 * 根据 fileId 拼接查看文件Url
 * @param {String} fileId
 */
export function getViewUrlById(fileId) {
    return `${process.env.FS_API}/file/v/${fileId}?_token=${store.getters.token}`;
}

// 使某个元素 全屏
export function requestFullscreen(element) {
    if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    } else if (element.requestFullscreen) {
        element.requestFullscreen();
    }
}

// 退出全屏
export function exitFullscreen() {
    if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}
