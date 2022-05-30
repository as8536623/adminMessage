import Cookies from 'js-cookie';
// import {getToken} from "../../utils/auth";

const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop',
        language: Cookies.get('language') || 'zh-CN',
        defaultImage: `${process.env.STATIC_API}/qgyun-static/images/default.png`,
        uploadImageUrl: `${process.env.FS_API}/file/upload`,
        schoolId: '',
        rootCourseCategoryId: '', // 默认根节点课程类别ID
        industry: null, // 行业
        job: null, // 职业
        subject: null // 学科
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1);
            } else {
                Cookies.set('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device;
        },
        SET_LANGUAGE: (state, language) => {
            state.language = language;
            Cookies.set('language', language);
        },
        SET_LOGIN_TYPE: (state, type) => {
            state.loginType = type;
        },
        SET_SCHOOL_ID: (state, schoolId) => {
            state.schoolId = schoolId;
        },
        SET_INDUSTRY: (state, industry) => {
            state.industry = industry;
        },
        SET_JOB: (state, job) => {
            state.job = job;
        },
        SET_SUBJECT: (state, subject) => {
            state.subject = subject;
        },
        SET_COURSE_CATEGORY_ID: (state, id) => {
            state.rootCourseCategoryId = id;
        }
    },
    actions: {
        toggleSideBar({
            commit
        }) {
            commit('TOGGLE_SIDEBAR');
        },
        closeSideBar({
            commit
        }, {
            withoutAnimation
        }) {
            commit('CLOSE_SIDEBAR', withoutAnimation);
        },
        toggleDevice({
            commit
        }, device) {
            commit('TOGGLE_DEVICE', device);
        },
        setLanguage({
            commit
        }, language) {
            commit('SET_LANGUAGE', language);
        },
        setSchoolId({
            commit
        }, schoolId) {
            commit('SET_SCHOOL_ID', schoolId);
        },
        setIndustry({
                        commit
                    }, industry) {
            commit('SET_INDUSTRY', industry);
        },
        setJob({
                        commit
                    }, job) {
            commit('SET_JOB', job);
        },
        setSubject({
                        commit
                    }, subject) {
            commit('SET_SUBJECT', subject);
        },
        setRootCourseCategoryId({
                                    commit
                                }, id) {
            commit('SET_COURSE_CATEGORY_ID', id);
        }
    }
};

export default app;
