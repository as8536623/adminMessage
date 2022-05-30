import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import './assets/iconfont/iconfont.css';
import './assets/iconfont/iconfont.js';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/index.scss'; // global css
import App from './App';
import router from './router';
import store from './store';
import i18n from './lang'; // Internationalization
import Cookies from 'js-cookie';

import './assets/icons'; // icon
import './errorLog'; // error log
import './permission'; // permission control
import SearchInput from './components/SearchInput/index';
import VelnDatetime from './components/VelnDatetime/index';
import QguTable from './components/QguTable/index';
// import QgSearchForm from './components/QgSearchForm/index';
import QguDragRow from './components/QguDragRow/index';
import QguDatePicker from './components/QguDatePicker/index';
import VelnImage from '@/components/VelnImage';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import * as filters from './filters'; // global filters
import extend from './utils/extend';
import qgvUi from '@qg/qgv-ui';
import '@qg/qgv-ui/lib/qgv-ui.css';

import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import moment from 'moment';
Vue.prototype.$moment = moment;

Vue.use(extend); // 注册 vue 扩展
Vue.use(vuescroll);
Vue.use(Element, {
    size: 'small', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
});

Vue.component('search-input', SearchInput);
// Vue.component('qg-search-form', QgSearchForm);
Vue.component('veln-datetime', VelnDatetime);
Vue.component('qgu-table', QguTable);
Vue.component('qgu-drag-row', QguDragRow);
Vue.component('qgu-date-picker', QguDatePicker);
Vue.component('veln-image', VelnImage);

Vue.use(qgvUi);
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;

Vue.prototype.$vuescrollConfig = {
    bar: {
        background: '#333333',
        size: '5px',
        keepShow: true
    }
};

const code = Cookies.get('CORP_CODE');
if (code) {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', code);

    switch (code) {
        case 'bgk':
        case 'bgh':
            document.title = '北国会';
            break;
        case 'xjd':
            document.title = '小桔灯';
            break;
        default:
            document.title = '课通天下教育平台';
            break;
    }
} else {
    document.title = '课通天下教育平台';
}

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
});
