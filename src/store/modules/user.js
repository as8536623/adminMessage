import {getUserInfo, loginByUsername} from '@/api/login';
import {getToken, removeToken, setToken} from '@/utils/auth';
import {userGet, userGetForAdmin} from '@/api/user';
import {deepClone} from '@/utils';
import {loadI18n} from '@/utils/i18n';
// import {getUcSvc} from '@/utils/ajax';
// import {createSocketLink} from '@/utils/socket';

const user = {
    state: {
        userId: '',
        token: getToken(),
        name: '',
        loginName: '',
        permissions: [],
        userCode: '',
        corpCode: '',
        adminType: '',
        hasBgk: false,
        ucPrefix: 'veln-uc'
    },

    mutations: {
        SET_HAS_BGK: (state, enableBgk) => {
            state.hasBgk = typeof enableBgk === 'boolean' ? enableBgk : false;
        },
        SET_USERID: (state, userId) => {
            state.userId = userId;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_LOGIN_NAME: (state, loginName) => {
            state.loginName = loginName;
        },
        SET_USER_CODE: (state, code) => {
            state.userCode = code;
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions;
        },
        SET_CORPCODE: (state, code) => {
            state.corpCode = code;
        },
        SET_ADMIN_TYPE: (state, type) => {
            state.adminType = type;
        },
        SET_UC_PRE: (state, prefix) => {
            state.ucPrefix = prefix;
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                const params = deepClone(userInfo);
                params.password = btoa(params.password);
                loginByUsername(params)
                    .then(response => {
                        const result = response.data;
                        if (result.success) {
                            commit('SET_TOKEN', result.data);
                            setToken(result.data);
                            resolve();
                        } else {
                            reject(result);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 获取用户信息
        GetUserInfo({commit, state}) {
            return new Promise(async(resolve, reject) => {
                const ucPrefix = 'veln-uc';
                commit('SET_UC_PRE', ucPrefix);
                const response = location.hash === '#/course' ? await userGet() : await userGetForAdmin();
                if (!response.data) {
                    // 由于mockjs 不支持自定义状态码只能这样hack
                    reject('error');
                }
                if (!response.data.success) {
                    reject('error');
                }

                // if (!window.Socket) {
                //     createSocketLink();
                // }

                const data = response.data.data;
                let permission = data.authCodes;
                if (!permission || (permission && !permission.length)) {
                    permission = ['NULL'];
                }
                data.permissions = permission;
                if (permission && permission.length > 0) {
                    // 验证返回的roles是否是一个非空数组
                    commit('SET_PERMISSIONS', permission);
                } else {
                    // reject( 'getInfo: permissions must be a non-null array !' );
                    commit('SET_PERMISSIONS', ['NULL']);
                }
                loadI18n(data.corpCode);

                commit('SET_USER_CODE', data.code || '');
                commit('SET_USERID', data.id || '');
                commit('SET_CORPCODE', data.corpCode || '');
                commit('SET_NAME', data.name || '');
                commit('SET_ADMIN_TYPE', data.adminType || '');
                localStorage.setItem('velnUserName', data.name);
                commit('SET_LOGIN_NAME', data.loginName || '');
                // 判断是否是北国会公司
                const corpCodeKey = ['bgk', 'bgh'];
                commit('SET_HAS_BGK', !!(data.corpCode && corpCodeKey.includes(data.corpCode)));
                resolve(response);
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                // logout(state.token).then(() => {
                commit('SET_TOKEN', '');
                commit('SET_PERMISSIONS', []);
                removeToken();
                resolve();
                // }).catch(error => {
                //     reject(error);
                // });
            });
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                removeToken();
                resolve();
            });
        },

        // 前端 设置token
        setToken({commit}, token) {
            return new Promise(resolve => {
                commit('SET_TOKEN', token);
                resolve();
            });
        },

        // 动态修改权限
        ChangeRoles({commit}, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role);
                setToken(role);
                getUserInfo(role).then(response => {
                    const data = response.data;
                    commit('SET_PERMISSIONS', data.permissions || []);
                    commit('SET_USER_CODE', data.code || '');
                    commit('SET_USERID', data.id || '');
                    commit('SET_NAME', data.name || '');
                    commit('SET_CORPCODE', data.corpCode || '');
                    localStorage.setItem('velnUserName', data.name);
                    commit('SET_LOGIN_NAME', data.loginName || '');
                    resolve();
                });
            });
        }
    }
};

export default user;
