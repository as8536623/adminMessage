import Layout from '@/views/layout/Layout';
import ContentLayout from '@/views/contentLayout/Layout';
import NoneLayout from '@/views/layout/NoneLayout';
import {isJY} from '@/utils/auth';
// import {getUsableRoute} from '@/utils/router';
import checkPermission from '@/utils/permission';

const ucRouter = {
    path: '/uc',
    name: 'uc',
    redirect: '/uc/user',
    component: Layout,
    meta: {
        title: '系统管理',
        permission: ['veln-uc', 'veln-is', 'veln-cs', 'k12-role', 'k12-org', 'courseUsageDetails']
    },
    // beforeEnter(to, from, next) {
        // if (to.name === 'uc') {
    // const name = getUsableRoute('uc');
    // next({name});
    // }
    // next();
    // },
    beforeEnter(to, from, next) {
        const systemPermission = to.meta.permission || [];
        systemPermission.map(item => function() {
            if (checkPermission(item)) {
                next({name: item});
                return;
            }
        });
        next();
    },
    children: [
        {
            path: 'user',
            component: ContentLayout,
            name: 'user',
            redirect: '/uc/user/person',
            meta: {
                icon: 'user_m',
                title: '用户中心',
                permission: ['veln-uc']
            },
            children: [
                {
                    path: 'person',
                    component: NoneLayout,
                    name: 'person',
                    redirect: {name: 'personList'},
                    meta: {
                        parentTitle: '用户中心',
                        title: '人员',
                        permission: ['user']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () => import('@/views/uc/user/person/list'),
                            name: 'personList',
                            meta: {
                                parentTitle: '人员',
                                curNav: 'personList',
                                permission: ['user']
                            },
                            beforeEnter(to, from, next) {
                                console.log('isJY', isJY());
                                if (isJY()) {
                                    next({name: 'roleSingleList'});
                                    return;
                                }
                                next();
                            }
                        },
                        {
                            path: 'edit',
                            component: () => import('@/views/uc/user/person/edit'),
                            name: 'personEdit',
                            hidden: true,
                            meta: {
                                parentTitle: '人员',
                                title: '人员新增',
                                curNav: 'personList',
                                permission: ['addUser']
                            },
                            beforeEnter: (to, from, next) => {
                                if (to.query.id) {
                                    to.meta.title = '人员编辑';
                                } else {
                                    to.meta.title = '人员新增';
                                }
                                next();
                            }
                        },
                        {
                            path: 'userinfo',
                            component: () => import('@/views/uc/user/person/info'),
                            name: 'userinfo',
                            hidden: true,
                            meta: {
                                parentTitle: '人员',
                                title: '人员详情',
                                curNav: 'homeworkList'
                            }
                        },
                        {
                            path: 'out',
                            component: () => import('@/views/uc/user/person/out'),
                            name: 'personOut',
                            hidden: true,
                            meta: {
                                parentTitle: '人员',
                                title: '外部联系人',
                                curNav: 'personList',
                                permission: ['addUser']
                            },
                            beforeEnter: (to, from, next) => {
                                if (to.query.id) {
                                    to.meta.title = '外部联系人编辑';
                                } else {
                                    to.meta.title = '外部联系人新增';
                                }
                                next();
                            }
                        }
                    ]
                },
                {
                    path: 'organize',
                    name: 'organize',
                    component: () => import('@/views/uc/user/organize'),
                    meta: {
                        parentTitle: '用户中心',
                        title: '部门',
                        curNav: 'organize',
                        permission: ['org']
                    }
                },
                {
                    path: 'post',
                    component: NoneLayout,
                    name: 'post',
                    redirect: {name: 'postManage'},
                    meta: {
                        parentTitle: '用户中心',
                        title: '岗位',
                        permission: ['position']
                    },
                    children: [
                        {
                            path: 'category',
                            component: () => import('@/views/uc/user/post/category'),
                            name: 'postCategory',
                            hidden: true,
                            meta: {
                                parentTitle: '岗位',
                                title: '岗位类别',
                                curNav: 'postManage',
                                showBack: true,
                                permission: ['position']
                            }
                        },
                        {
                            path: 'manage',
                            component: () => import('@/views/uc/user/post/manage'),
                            name: 'postManage',
                            meta: {
                                parentTitle: '岗位',
                                curNav: 'postManage',
                                permission: ['position']
                            }
                        }
                    ]
                },
                {
                    path: 'group',
                    component: NoneLayout,
                    name: 'group',
                    redirect: {name: 'groupManage'},
                    meta: {
                        parentTitle: '用户中心',
                        title: '群组',
                        permission: ['group']
                    },
                    children: [
                        {
                            path: 'category',
                            component: () => import('@/views/uc/user/group/category'),
                            name: 'groupCategory',
                            hidden: true,
                            meta: {
                                parentTitle: '群组',
                                title: '群组类别',
                                showBack: true,
                                curNav: 'groupManage',
                                permission: ['group']
                            }
                        },
                        {
                            path: 'manage',
                            component: () => import('@/views/uc/user/group/manage'),
                            name: 'groupManage',
                            meta: {
                                parentTitle: '群组',
                                curNav: 'groupManage',
                                permission: ['group']
                            }
                        },
                        {
                            path: 'edit',
                            component: () => import('@/views/uc/user/group/edit'),
                            name: 'groupEdit',
                            hidden: true,
                            meta: {
                                parentTitle: '群组',
                                title: '新增群组',
                                curNav: 'groupManage',
                                permission: ['addGroup']
                            }
                        }
                    ]
                },
                {
                    path: 'role',
                    component: NoneLayout,
                    name: 'role',
                    redirect: {name: 'roleList'},
                    meta: {
                        parentTitle: '用户中心',
                        title: '角色',
                        permission: ['role']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () => import('@/views/uc/user/role/list'),
                            name: 'roleList',
                            meta: {
                                parentTitle: '角色',
                                curNav: 'roleList',
                                permission: ['role']
                            }
                        },
                        {
                            path: 'user',
                            component: () => import('@/views/uc/user/role/user'),
                            name: 'roleUser',
                            hidden: true,
                            meta: {
                                parentTitle: '角色管理',
                                curNav: 'roleList',
                                showBack: true,
                                permission: ['role']
                            }
                        },
                        {
                            path: 'detail',
                            component: () => import('@/views/uc/user/role/detail'),
                            name: 'roleDetail',
                            hidden: true,
                            meta: {
                                title: '角色授权',
                                curNav: 'roleList',
                                permission: ['updUserRange']
                            }
                        }
                    ]
                },
                {
                    path: 'jurisdiction',
                    component: NoneLayout,
                    name: 'jurisdiction',
                    hidden: true,
                    redirect: {name: 'jurisdictionList'},
                    meta: {
                        parentTitle: '用户中心',
                        title: '管辖范围管理',
                        permission: ['userRange']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () => import('@/views/uc/user/jurisdiction/list'),
                            name: 'jurisdictionList',
                            meta: {
                                parentTitle: '管辖范围管理',
                                curNav: 'jurisdictionList',
                                permission: ['userRange']
                            }
                        },
                        {
                            path: 'edit',
                            component: () => import('@/views/uc/user/jurisdiction/edit'),
                            name: 'jurisdictionEdit',
                            hidden: true,
                            meta: {
                                parentTitle: '管辖范围管理',
                                title: '新增授权',
                                curNav: 'jurisdictionList',
                                permission: ['updUserRange']
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: 'client',
            component: ContentLayout,
            name: 'client',
            redirect: {name: 'clientList'},
            meta: {
                icon: 'user_m',
                title: '客户管理',
                permission: ['client']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/uc/client/list'),
                    name: 'clientList',
                    meta: {
                        parentTitle: '客户管理',
                        curNav: 'clientList',
                        permission: ['client']
                    }
                },
                {
                    path: 'edit',
                    component: () => import('@/views/uc/client/edit'),
                    name: 'clientEdit',
                    hidden: true,
                    meta: {
                        parentTitle: '客户管理',
                        title: '客户编辑',
                        curNav: 'clientEdit',
                        permission: ['clientEdit']
                    }
                },
               /* {
                    path: 'chargingList',
                    component: () => import('@/views/uc/client/charging/list'),
                    name: 'chargingList',
                    meta: {
                        parentTitle: '客户管理',
                        title: '收费标准',
                        curNav: 'chargingList',
                        permission: ['chargingList']
                    }
                },*/
                {
                    path: 'joinList',
                    component: () => import('@/views/uc/client/join/list'),
                    name: 'joinList',
                    meta: {
                        parentTitle: '客户管理',
                        title: '推送管理',
                        curNav: 'joinList',
                        permission: ['joinList']
                    }
                },
                {
                    path: 'joinEdit',
                    component: () => import('@/views/uc/client/join/edit'),
                    name: 'joinEdit',
                    hidden: true,
                    meta: {
                        parentTitle: '客户管理',
                        title: '推送详情',
                        curNav: 'joinList',
                        permission: ['joinEdit']
                    }
                },
                {
                    path: 'joinRelList',
                    component: () => import('@/views/uc/client/join/relList'),
                    name: 'joinRelList',
                    hidden: true,
                    meta: {
                        parentTitle: '客户管理',
                        title: '推送详情',
                        curNav: 'joinList',
                        permission: ['joinRelList']
                    }
                },
                {
                    path: 'usage',
                    component: () => import('@/views/uc/client/usage'),
                    name: 'clientUsage',
                    meta: {
                        parentTitle: '客户管理',
                        title: '流量统计',
                        curNav: 'clientUsage',
                        permission: ['clientUsage']
                    }
                },
                {
                    path: 'detail',
                    component: () => import('@/views/uc/client/usageDetail'),
                    name: 'usageDetail',
                    meta: {
                        parentTitle: '客户管理',
                        title: '流量详情',
                        curNav: 'usageDetail',
                        permission: ['usageDetail']
                    }
                }
                /* {
                    path: 'recharge',
                    component: () => import('@/views/uc/client/recharge'),
                    name: 'recharge',
                    meta: {
                        parentTitle: '客户管理',
                        title: '充值管理',
                        curNav: 'recharge',
                        permission: ['recharge']
                    }
                }*/
            ]
        },
        {
            path: 'role',
            component: ContentLayout,
            name: 'roleSingle',
            redirect: {name: 'roleSingleList'},
            meta: {
                title: '角色管理',
                icon: 'user_l',
                permission: ['k12-role']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/uc/user/role/list'),
                    name: 'roleSingleList',
                    meta: {
                        parentTitle: '角色管理',
                        curNav: 'roleSingleList',
                        permission: ['k12-role']
                    }
                },
                {
                    path: 'user',
                    component: () => import('@/views/uc/user/role/user'),
                    name: 'roleSingleUser',
                    hidden: true,
                    meta: {
                        parentTitle: '角色管理',
                        curNav: 'roleSingleList',
                        showBack: true,
                        permission: ['k12-role']
                    }
                },
                {
                    path: 'detail',
                    component: () => import('@/views/uc/user/role/detail'),
                    name: 'roleSingleDetail',
                    hidden: true,
                    meta: {
                        title: '角色授权',
                        curNav: 'roleSingleList',
                        permission: ['k12-role']
                    }
                }
            ]
        },
        {
            path: 'school',
            component: ContentLayout,
            name: 'school',
            redirect: {name: 'SchoolList'},
            meta: {
                icon: 'score_m',
                title: '学校管理',
                permission: ['k12-org']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/uc/school/list'),
                    name: 'SchoolList',
                    meta: {
                        title: '学校管理'
                    }
                },
                {
                    path: 'edit',
                    component: () => import('@/views/uc/school/edit'),
                    name: 'SchoolEdit',
                    hidden: true,
                    meta: {
                        title: '学校信息',
                        curNav: 'SchoolList'
                    }
                }
            ]
        },
        {
            path: 'score',
            component: ContentLayout,
            name: 'score',
            meta: {
                icon: 'score_m',
                title: '积分中心',
                permission: ['veln-is']
            },
            children: [
                {
                    path: 'user',
                    component: () => import('@/views/uc/score/user'),
                    name: 'scoreUser',
                    meta: {
                        title: '学员积分',
                        permission: ['admin/account']
                    }
                },
                {
                    path: 'rule',
                    component: () => import('@/views/uc/score/rule'),
                    name: 'scoreRule',
                    meta: {
                        title: '积分规则',
                        permission: ['rule']
                    }
                },
                {
                    path: 'level',
                    component: () => import('@/views/uc/score/level'),
                    name: 'scoreLevel',
                    meta: {
                        title: '积分等级',
                        permission: ['level']
                    }
                },
                {
                    path: 'detail',
                    component: () => import('@/views/uc/score/detail'),
                    name: 'scoreDetail',
                    hidden: true,
                    meta: {
                        title: '学员积分明细',
                        curNav: 'scoreUser'
                    }
                }
            ]
        },
        {
            path: 'log',
            component: ContentLayout,
            name: 'log',
            redirect: {name: 'loginLog'},
            meta: {
                icon: 'system_m',
                title: '系统日志',
                permission: ['log']
            },
            children: [
                {
                    path: 'login',
                    component: () => import('@/views/uc/log/login'),
                    name: 'loginLog',
                    meta: {
                        title: '登录日志',
                        curNav: 'loginLog'
                    }
                },
                {
                    path: 'option',
                    component: () => import('@/views/uc/log/option'),
                    name: 'optionLog',
                    hidden: true,
                    meta: {
                        title: '操作日志',
                        curNav: 'optionLog'
                    }
                }
            ]
        },
        {
            path: 'system',
            component: ContentLayout,
            name: 'system',
            redirect: {name: 'systemConfig'},
            meta: {
                icon: 'system_m',
                title: '系统配置',
                permission: ['veln-cs']
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/uc/system/index'),
                    name: 'systemConfig',
                    hidden: true,
                    meta: {
                        title: '系统配置',
                        curNav: 'system',
                        permission: ['veln-cs']
                    }
                },
                {
                    path: 'reset',
                    component: () => import('@/views/reset/index'),
                    name: 'resetPassword',
                    hidden: true,
                    meta: {
                        title: '修改密码',
                        curNav: 'system'
                    }
                }
            ]
        },
        /* {
            path: 'billing',
            component: ContentLayout,
            name: 'billing',
            redirect: {name: 'billingLog'},
            meta: {
                icon: 'billing',
                title: '计费日志',
                permission: ['billingLog']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/uc/billing/list'),
                    name: 'billingLog',
                    meta: {
                        parentTitle: '计费日志',
                        curNav: 'billingLog'
                    }
                }
            ]
        },*/
        {
            path: 'dataStatistics',
            component: ContentLayout,
            name: 'dataStatistics',
            redirect: {name: 'courseUsageDetails'},
            meta: {
                icon: 'dataStatistics',
                title: '数据统计',
                permission: ['dataStatistics']
            },
            beforeEnter(to, from, next) {
                if (checkPermission(to.meta.permission)) {
                    next({name: to.meta.permission});
                }
                next();
            },
            children: [
                {
                    path: 'courseUse',
                    component: NoneLayout,
                    redirect: {name: 'courseUse'},
                    name: 'courseUse',
                    meta: {
                        parentTitle: '数据统计',
                        curNav: 'courseUse',
                        title: '课程使用统计',
                        permission: ['courseUse']
                    },
                    children: [
                        {
                            path: 'courseUse',
                            component: () => import('@/views/uc/dataStatistics/courseUse'),
                            name: 'courseUse',
                            meta: {
                                parentTitle: '课程使用统计',
                                curNav: 'courseUse'
                            }
                        }
                    ]
                },
                {
                    path: 'customerUse',
                    component: NoneLayout,
                    redirect: {name: 'customerUseList'},
                    name: 'customerUse',
                    meta: {
                        parentTitle: '数据统计',
                        curNav: 'customerUse',
                        title: '客户使用统计',
                        permission: ['customerUse']
                    },
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/uc/dataStatistics/customerUse'),
                            name: 'customerUseList',
                            hidden: true,
                            meta: {
                                parentTitle: '客户使用统计',
                                curNav: 'customerUse',
                                permission: ['customerUse']
                            }
                        }
                    ]
                },
                {
                    path: 'courseUsageDetails',
                    component: NoneLayout,
                    redirect: {name: 'courseUsageList'},
                    name: 'courseUsageDetails',
                    meta: {
                        parentTitle: '数据统计',
                        curNav: 'courseUsageDetails',
                        title: '课程使用详情',
                        permission: ['courseUsageDetails']
                    },
                    children: [
                        {
                            path: 'courseUsageList',
                            component: () => import('@/views/uc/dataStatistics/couserUsageDetails'),
                            name: 'courseUsageList',
                            hidden: true,
                            meta: {
                                parentTitle: '课程使用详情',
                                curNav: 'courseUsageDetails',
                                permission: ['courseUsageDetails']
                            }
                        },
                        {
                            path: 'courseStudent',
                            component: () => import('@/views/uc/dataStatistics/courseStudent'),
                            name: 'courseStudent',
                            hidden: true,
                            meta: {
                                parentTitle: '课程使用详情',
                                curNav: 'courseUsageDetails',
                                title: '学员列表',
                                permission: ['courseStudent']
                            },
                            children: [
                                {
                                    path: 'courseVideo',
                                    component: () => import('@/views/uc/dataStatistics/courseVideo'),
                                    name: 'courseVideo',
                                    hidden: true,
                                    meta: {
                                        parentTitle: '学员列表',
                                        curNav: 'courseVideo',
                                        title: '视频列表',
                                        permission: ['courseVideo']
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export default ucRouter;
