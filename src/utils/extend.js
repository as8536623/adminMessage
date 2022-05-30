import {errorMsg, successMsg, warnMsg, infoMsg} from '../utils/element';
import appCodes from './appCodes';

export default {
    install: function(Vue) {
        Vue.prototype.$errorMsg = errorMsg;
        Vue.prototype.$successMsg = successMsg;
        Vue.prototype.$warnMsg = warnMsg;
        Vue.prototype.$infoMsg = infoMsg;
        Vue.prototype.$appCodes = appCodes[process.env.ENV_CODE];
    }
};
