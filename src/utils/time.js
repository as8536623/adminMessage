/**
 * time 工具类
 */

/**
 * 将秒钟转换为 mm:ss
 * @export
 */
export function transformSecondToMS(s) {
    if (!s || isNaN(s)) {
        return '00:00';
    }
    let m = Math.floor(s / 60);
    s = s - m * 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    return `${m}:${s}`;
}
