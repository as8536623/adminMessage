/**
 * 开发环境条件判断支持
 *
 * @param name
 * @returns {*}
 */
const getQueryString = (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) { return unescape(r[2]); }
    return null;
};

export function getDev() {
    return getQueryString('dev') ? getQueryString('dev') : '';
}

export function getCtx() {
    return getQueryString('dev') ? `https://${getQueryString('dev')}` : '';
}

export function getPre() {
    return location.href.includes('localhost') ? 'https://kty.kttx.cn' : `${location.protocol}//${location.host}`;
}
