const appCodes = {
    test: {
        pe: 'veln-pe'
    },
    prod: {
        pe: 'veln-pe'
    },
    getAppCodes() {
        return this[process.env.ENV_CODE];
    }
};

export default appCodes;
