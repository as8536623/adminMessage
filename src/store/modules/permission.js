import {asyncRouterMap, constantRouterMap} from '@/router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
    if (!permissions.length) {
        return false;
    }
    if (route.meta && route.meta.permission && route.meta.permission.length) {
        const per = permissions.filter(item => {
            return route.meta.permission.indexOf(item) > -1;
        });
        return per.length;
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param permissions
 */
function filterAsyncRouter(asyncRouterMap, permissions) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(permissions, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, permissions);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}

function filterNowRouter(addRoutes, key) {
    return addRoutes.filter(item => {
        return item.meta && item.meta.key && item.meta.key === key;
    });
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        nowRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_NOW_ROUTERS: (state, key) => {
            state.nowRouters = filterNowRouter(state.addRouters, key);
        }
    },
    actions: {
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                const {permissions} = data;
                let accessedRouters;
                if (!permissions || permissions.length === 0) {
                    accessedRouters = [];
                } else if (permissions.indexOf('*') > -1) {
                    accessedRouters = asyncRouterMap;
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, permissions);
                }
                commit('SET_PERMISSIONS', permissions);
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            });
        }
    }
};

export default permission;
