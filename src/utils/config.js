const getToPagePreUrl = () => {
    const {host} = location;
    if (host.includes('localhost')) {
        return `https://kty.kttx.cn/weChat/toPage`;
    }
    return `${process.env.SHARE_PREFIX}/weChat/toPage`;
};

export {getToPagePreUrl};
