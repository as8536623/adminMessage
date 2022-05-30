import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import user from './modules/user';
import ajax from './modules/ajax';
import temporary from './modules/temporary';
import getters from './getters';
import project from './modules/project';
import cache from './modules/cache';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        errorLog,
        permission,
        user,
        ajax,
        temporary,
        project,
        cache
    },
    getters
});

export default store;
