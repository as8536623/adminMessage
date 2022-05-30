import Layout from '@/views/layout/Layout';
import ContentLayout from '@/views/contentLayout/Layout';
import NoneLayout from '@/views/layout/NoneLayout';
import {isBgk} from '@/utils/auth';
import i18n from '../lang';
// import {getUsableRoute} from '@/utils/router';
// import { peRoutePre } from '@/utils/router';

const contentRouter = {
    path: '/content',
    name: 'content',
    redirect: '/content/course',
    component: Layout,
    meta: {
        title: '内容管理',
        permission: [
            'veln-stu',
            'veln-face',
            'veln-km',
            'veln-pe',
            'veln-cert',
            'veln-sign',
            'veln-teacher',
            'veln-qtn',
            'veln-work',
            'veln-enroll',
            'tools',
            // 新权限
            'stu-teacher',
            'pe-bank',
            'pe-paper',
            'pe-exam',
            'pe-exercise',
            'veln-mp'
        ]
    },
    // beforeEnter(to, from, next) {
    //     if (to.name === 'content') {
    //         const name = getUsableRoute('content');
    //         next({name});
    //     }
    //     next();
    // },
    children: [
        {
            path: 'course',
            component: ContentLayout,
            name: 'course',
            redirect: {name: 'courseManage'},
            meta: {
                title: '课程管理',
                icon: 'online',
                permission: ['veln-stu']
            },
            children: [
                {
                    path: 'manage',
                    component: () => import('@/views/content/course/manage'),
                    name: 'courseManage',
                    meta: {
                        title: '课程管理',
                        curNav: 'courseManage',
                        permission: ['course']
                    }
                },
                {
                    path: 'statistics',
                    component: () => import('@/views/content/course/statistics'),
                    name: 'courseStatistics',
                    hidden: true,
                    meta: {
                        title: '课程统计',
                        curNav: 'courseStatistics',
                        permission: ['course']
                    }
                },
                {
                    path: 'category',
                    component: () => import('@/views/content/course/category'),
                    name: 'courseCategory',
                    meta: {
                        title: '课程类别',
                        curNav: 'courseCategory',
                        permission: ['courseCategory']
                    }
                },
                {
                    path: 'resource',
                    component: () => import('@/views/content/course/resource'),
                    name: 'courseResource',
                    hidden: false,
                    meta: {
                        title: '资源管理',
                        curNav: 'courseResource',
                        permission: ['resource']
                    }
                },
                {
                    path: 'resourceCategory',
                    component: () => import('@/views/content/course/resourceCategory'),
                    name: 'resourceCategory',
                    meta: {
                        title: '资源类别',
                        curNav: 'resourceCategory',
                        permission: ['resource']
                    }
                },
                 {
                    path: 'examine',
                    component: () => import('@/views/content/course/examine'),
                    name: 'courseExamine',
                    hidden: false,
                    meta: {
                        title: '课程审核',
                        curNav: 'courseExamine',
                        permission: ['courseApprove']

                    }
                },
                {
                    path: 'detail',
                    component: () => import('@/views/content/course/detail'),
                    name: 'courseDetail',
                    hidden: true,
                    meta: {
                        title: '课程详情',
                        curNav: 'courseManage',
                        permission: ['course']
                    }
                },
                {
                    path: 'edit',
                    component: () => import('@/views/content/course/edit'),
                    name: 'courseEdit',
                    hidden: true,
                    meta: {
                        title: '新增课程',
                        curNav: 'courseManage',
                        permission: ['addCourse'],
                        keepAlive: true
                    }
                },
                {
                    path: 'courseItem',
                    component: () =>
                        import('@/views/content/course/courseItem'),
                    name: 'courseItem',
                    hidden: true,
                    meta: {
                        title: '课程内容',
                        curNav: 'courseManage',
                        permission: ['addCourse']
                    }
                },
                {
                    path: 'openScope',
                    component: () => import('@/views/content/course/openScope'),
                    name: 'courseOpenScope',
                    hidden: true,
                    meta: {
                        title: '其他设置',
                        curNav: 'courseManage',
                        permission: ['addCourse']
                    }
                },
                {
                    path: 'accredit',
                    component: () => import('@/views/content/course/accredit'),
                    name: 'courseAccredit',
                    hidden: true,
                    meta: {
                        title: '课程授权',
                        curNav: 'courseManage',
                        permission: ['addCourse']
                    }
                },
                {
                    path: 'editAccredit',
                    component: () =>
                        import('@/views/content/course/editAccredit'),
                    name: 'courseEditAccredit',
                    hidden: true,
                    meta: {
                        title: '新增授权',
                        curNav: 'courseManage',
                        permission: ['addCourse']
                    }
                },
                // 课程报表
                {
                    path: `${location.protocol}//${location.host}/#/courseReport`,
                    name: 'onlineCourseReport',
                    component: Layout,
                    // todo 北国会现公网没有这块功能，沟通后直接隐藏
                    hidden: true,
                    meta: {
                        title: '课程报表',
                        curNav: 'courseManage',
                        permission: ['veln-course-report']
                    }
                },
                {
                    path: 'onlineSubject',
                    component: () => import('@/views/content/subject/list/index.vue'),
                    name: 'onlineSubject',
                    meta: {
                        title: '专题课程',
                        curNav: 'onlineSubject',
                        permission: ['veln-k12']
                    }
                },
                {
                    path: 'onlineSubjectAdd',
                    component: () => import('@/views/content/subject/subjectCourse/edit.vue'),
                    name: 'onlineSubjectAdd',
                    hidden: true,
                    meta: {
                        title: '新增',
                        curNav: 'onlineSubject'
                    }
                },
                {
                    path: 'onlineSubjectEdit',
                    component: () => import('@/views/content/subject/subjectCourse/edit.vue'),
                    name: 'onlineSubjectEdit',
                    hidden: true,
                    meta: {
                        title: '编辑',
                        curNav: 'onlineSubject'
                    }
                },
                {
                    path: 'onlineSubjectStepTwo',
                    component: () => import('@/views/content/subject/subjectCourse/stepTwo.vue'),
                    name: 'onlineSubjectStepTwo',
                    hidden: true,
                    meta: {
                        title: '专题第二步',
                        curNav: 'onlineSubject'
                    }
                },
                {
                    path: 'onlineSubjectDetail',
                    component: () => import('@/views/content/subject/subjectCourse/detail.vue'),
                    name: 'onlineSubjectDetail',
                    hidden: true,
                    meta: {
                        title: '查看详情',
                        curNav: 'onlineSubject'
                    }
                },
                {
                    path: 'innerBuy',
                    component: () => import('@/views/content/course/innerBuy'),
                    name: 'courseInnerBuy',
                    meta: {
                        title: '专题内购',
                        curNav: 'courseInnerBuy',
                        permission: ['veln-k12']
                    }
                }
            ]
        },
        {
            path: 'teacher',
            component: ContentLayout,
            name: 'teacher',
            redirect: {name: 'teacherList'},
            meta: {
                title: '讲师管理',
                icon: 'teacher_manage',
                permission: ['stu-teacher']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/content/teacher/list'),
                    name: 'teacherList',
                    meta: {
                        title: '讲师管理',
                        curNav: 'teacherList'
                    }
                },
                {
                    path: 'copyright',
                    component: () => import('@/views/content/teacher/copyright'),
                    name: 'teacherCopyright',
                    meta: {
                        title: '版权管理',
                        curNav: 'teacherCopyright'
                    }
                },
                {
                    path: 'category',
                    component: () => import('@/views/content/teacher/category'),
                    name: 'teacherCategory',
                    hidden: true,
                    meta: {
                        title: '讲师类别',
                        curNav: 'teacherList'
                    }
                },
                {
                    path: 'edit',
                    component: () => import('@/views/content/teacher/edit'),
                    name: 'teacherEdit',
                    hidden: true,
                    meta: {
                        title: '编辑讲师',
                        curNav: 'teacherList'
                    },
                    beforeEnter(to, from, next) {
                        if (to.query.readOnly) {
                            to.meta.title = '讲师详情';
                        } else if (to.query.id) {
                            to.meta.title = '编辑讲师';
                        } else {
                            to.meta.title = '新增讲师';
                        }

                        next();
                    }
                },
                {
                    path: 'level',
                    component: () => import('@/views/content/teacher/level'),
                    name: 'teacherLevel',
                    hidden: true,
                    meta: {
                        title: '讲师等级',
                        curNav: 'teacherList'
                    }
                }
            ]
        },
        {
            path: 'pe',
            component: ContentLayout,
            name: 'pe',
            redirect: {name: 'eQuestion'},
            meta: {
                title: '考试管理',
                icon: 'exam_m',
                permission: ['pe-bank', 'pe-paper', 'pe-exam']
            },
            children: [
                {
                    path: 'manage',
                    component: NoneLayout,
                    name: 'eQuestion',
                    redirect: {name: 'question'},
                    meta: {
                        title: '题库',
                        permission: ['pe-bank']
                    },
                    children: [
                        {
                            path: 'itemBank',
                            redirect: {name: 'itemBankIndex'},
                            component: NoneLayout,
                            name: 'itemBank',
                            hidden: true,
                            meta: {
                                title: '题库',
                                permission: ['itemBank']
                            },
                            children: [
                                {
                                    path: 'list',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/itemBank/list'
                                            ),
                                    name: 'itemBankIndex',
                                    meta: {
                                        parentTitle: '题库',
                                        curNav: 'eQuestion'
                                    }
                                },
                                {
                                    path: 'category',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/itemBank/category'
                                            ),
                                    name: 'itemBankCategory',
                                    hidden: true,
                                    meta: {
                                        title: '题库类别',
                                        curNav: 'eQuestion'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'points',
                            redirect: {name: 'knowledgePointsList'},
                            component: NoneLayout,
                            name: 'points',
                            hidden: true,
                            meta: {
                                title: '知识点',
                                permission: ['itemPoint']
                            },
                            children: [
                                {
                                    path: 'list',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/knowledgePoints/list'
                                            ),
                                    name: 'knowledgePointsList',
                                    meta: {
                                        parentTitle: '知识点',
                                        curNav: 'eQuestion'
                                    }
                                },
                                {
                                    path: 'category',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/knowledgePoints/category'
                                            ),
                                    name: 'knowledgePointsCategory',
                                    hidden: true,
                                    meta: {
                                        title: '知识点类别',
                                        curNav: 'eQuestion'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'question',
                            redirect: {name: 'examQuestion'},
                            component: NoneLayout,
                            name: 'question',
                            hidden: true,
                            meta: {
                                parentTitle: '试题',
                                permission: ['item']
                            },
                            children: [
                                {
                                    path: 'list',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/question/list'
                                            ),
                                    name: 'examQuestion',
                                    hidden: true,
                                    meta: {
                                        parentTitle: '试题',
                                        curNav: 'eQuestion'
                                    }
                                },
                                {
                                    path: 'edit',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/question/edit'
                                            ),
                                    name: 'editExamQuestion',
                                    hidden: true,
                                    meta: {
                                        title: '试题',
                                        curNav: 'eQuestion'
                                    },
                                    beforeEnter: (to, from, next) => {
                                        if (to.query.id) {
                                            to.meta.title = '编辑试题';
                                        } else {
                                            to.meta.title = '新增试题';
                                        }
                                        next();
                                    }
                                },
                                {
                                    path: 'detail',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/question/detail'
                                            ),
                                    name: 'questionDetail',
                                    hidden: true,
                                    meta: {
                                        title: '详情',
                                        curNav: 'eQuestion'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'paper',
                    redirect: {name: 'paperList'},
                    component: NoneLayout,
                    name: 'paper',
                    meta: {
                        title: '试卷',
                        permission: ['pe-paper']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/exam/paper/list'),
                            name: 'paperList',
                            meta: {
                                parentTitle: '试卷',
                                curNav: 'paperList'
                            }
                        },
                        {
                            path: 'category',
                            component: () =>
                                import('@/views/content/exam/paper/category'),
                            name: 'paperCategory',
                            hidden: true,
                            meta: {
                                title: '试卷类别',
                                curNav: 'paperList'
                            }
                        },
                        {
                            path: 'edit',
                            redirect: {name: 'paperBasic'},
                            component: NoneLayout,
                            name: 'paper',
                            hidden: true,
                            meta: {
                                title: '试卷新增'
                            },
                            children: [
                                {
                                    path: 'basic',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/paper/edit/basic/index'
                                            ),
                                    name: 'paperBasic',
                                    meta: {
                                        title: '基本信息',
                                        curNav: 'paperList'
                                    }
                                },
                                {
                                    path: 'fixed',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/paper/edit/fixed/index'
                                            ),
                                    name: 'fixedQuestion',
                                    meta: {
                                        title: '必考题',
                                        curNav: 'paperList'
                                    }
                                },
                                {
                                    path: 'random',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/paper/edit/random/index'
                                            ),
                                    name: 'randomQuestion',
                                    meta: {
                                        title: '随机题',
                                        curNav: 'paperList'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'exam',
                    component: NoneLayout,
                    redirect: {name: 'examList'},
                    name: 'eExam',
                    meta: {
                        title: '考试',
                        permission: ['pe-exam']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/exam/examination/list'),
                            name: 'examList',
                            meta: {
                                parentTitle: '考试',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'edit',
                            component: NoneLayout,
                            redirect: {name: 'examBasic'},
                            hidden: true,
                            name: 'examEdit',
                            meta: {
                                // title: '考试新增',
                                curNav: 'examList'
                            },
                            children: [
                                {
                                    path: 'base',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/edit/basic/index'
                                            ),
                                    name: 'examBasic',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '基本信息'
                                    }
                                },
                                {
                                    path: 'paper',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/edit/paperSetting/index'
                                            ),
                                    name: 'paperSetting',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '试卷设置'
                                    }
                                },
                                {
                                    path: 'arrange',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/edit/arrange/index'
                                            ),
                                    name: 'examArrange',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '考试安排'
                                    }
                                },
                                {
                                    path: 'exam',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/edit/examSetting/index'
                                            ),
                                    name: 'examSetting',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '考试设置'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'edit',
                            component: NoneLayout,
                            redirect: {name: 'makeUpBasic'},
                            hidden: true,
                            name: 'makeUpEdit',
                            meta: {
                                // title: '考试新增',
                                curNav: 'examList'
                            },
                            children: [
                                {
                                    path: 'base',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/makeUp/basic/index'
                                            ),
                                    name: 'makeUpBasic',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '基本信息'
                                    }
                                },
                                {
                                    path: 'paper',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/makeUp/paper/index'
                                            ),
                                    name: 'makeUpPaper',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '试卷设置'
                                    }
                                },
                                {
                                    path: 'arrange',
                                    component: () =>
                                        import(
                                            '@/views/content/exam/examination/makeUp/arrange/index'
                                            ),
                                    name: 'makeUpArrange',
                                    hidden: true,
                                    meta: {
                                        curNav: 'examList',
                                        title: '考试安排'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'monitor',
                            component: () =>
                                import(
                                    '@/views/content/exam/examination/monitor/list'
                                    ),
                            name: 'monitorList',
                            hidden: true,
                            meta: {
                                title: '监考',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'detail',
                            component: () =>
                                import(
                                    '@/views/content/exam/examination/detail/index'
                                    ),
                            name: 'examinationDetail',
                            hidden: true,
                            meta: {
                                title: '考试详情',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'publish',
                            component: () =>
                                import(
                                    '@/views/content/exam/examination/publish'
                                    ),
                            name: 'publishResults',
                            hidden: true,
                            meta: {
                                title: '发布',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'reappraisal',
                            component: () =>
                                import(
                                    '@/views/content/exam/result/reappraisal'
                                    ),
                            name: 'reappraisal',
                            hidden: true,
                            meta: {
                                title: '复评',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'analyze',
                            component: () =>
                                import('@/views/content/exam/result/analyze'),
                            name: 'examAnalyze',
                            hidden: true,
                            meta: {
                                title: '成绩分析',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'result',
                            component: () =>
                                import(
                                    '@/views/content/exam/result/detail/list'
                                    ),
                            name: 'resultList',
                            hidden: true,
                            meta: {
                                title: '考生明细',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'review',
                            component: () =>
                                import(
                                    '@/views/content/exam/result/detail/exam'
                                    ),
                            name: 'examDetail',
                            hidden: true,
                            meta: {
                                title: '成绩',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'score',
                            component: () =>
                                import('@/views/content/exam/judge/score'),
                            name: 'score',
                            hidden: true,
                            meta: {
                                title: '评卷',
                                curNav: 'examList'
                            }
                        },
                        {
                            path: 'judge',
                            component: () =>
                                import('@/views/content/exam/judge/detail'),
                            name: 'judgeDetail',
                            hidden: true,
                            meta: {
                                title: '详情',
                                curNav: 'examList'
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: 'resources',
            component: ContentLayout,
            name: 'resources',
            redirect: '/uc/resources/labelManage',
            meta: {
                icon: 'res',
                title: '资源中心',
                permission: ['veln-tag']
            },
            children: [
                {
                    path: 'labelManage',
                    component: () => import('@/views/uc/resources/label'),
                    name: 'labelManage',
                    meta: {
                        title: '标签管理',
                        curNav: 'labelManage'
                    }
                },
                {
                    path: 'labelGroup',
                    component: () => import('@/views/uc/resources/label/labelGroup'),
                    name: 'labelGroup',
                    hidden: true,
                    meta: {
                        title: '全部标签',
                        curNav: 'labelGroup'
                    }
                }
            ]
        },
        {
            path: 'exercise',
            component: ContentLayout,
            name: 'exerciseM',
            redirect: {name: 'exerciseList'},
            meta: {
                title: '练习管理',
                icon: 'exercise_m',
                permission: ['pe-exercise']
            },
            children: [
                {
                    path: 'list',
                    component: () =>
                        import('@/views/content/exam/exercise/list'),
                    name: 'exerciseList',
                    hidden: true,
                    meta: {
                        parentTitle: '练习管理',
                        curNav: 'exerciseM'
                    }
                },
                {
                    path: 'edit',
                    component: NoneLayout,
                    redirect: {name: 'exerciseBasic'},
                    hidden: true,
                    name: 'examEdit',
                    meta: {
                        parentTitle: '练习管理',
                        curNav: 'exerciseM'
                    },
                    children: [
                        {
                            path: 'basic',
                            component: () =>
                                import('@/views/content/exam/exercise/edit'),
                            name: 'exerciseBasic',
                            hidden: true,
                            meta: {
                                title: '基本信息',
                                curNav: 'exerciseM'
                            }
                        },
                        {
                            path: 'setting',
                            component: () =>
                                import('@/views/content/exam/exercise/setting'),
                            name: 'exerciseSetting',
                            hidden: true,
                            meta: {
                                title: '范围设置',
                                curNav: 'exerciseM'
                            }
                        }
                    ]
                },
                {
                    path: 'analyze',
                    component: () =>
                        import('@/views/content/exam/exercise/analyze'),
                    name: 'exerciseAnalyze',
                    hidden: true,
                    meta: {
                        title: '练习分析',
                        curNav: 'exerciseM'
                    }
                }
            ]
        },
        {
            path: 'cert',
            name: 'cert',
            component: ContentLayout,
            redirect: {name: 'certList'},
            meta: {
                title: '证书管理',
                icon: 'cert',
                permission: ['veln-cert']
            },
            children: [
                {
                    path: 'list',
                    name: 'certList',
                    component: () =>
                        import('@/views/content/resources/cert/list'),
                    hidden: true,
                    meta: {
                        title: '证书管理',
                        curNav: 'cert',
                        permission: ['veln-cert']
                    }
                },
                {
                    path: 'category',
                    name: 'certCategory',
                    component: () =>
                        import('@/views/content/resources/cert/category'),
                    hidden: true,
                    meta: {
                        title: '证书类别',
                        curNav: 'cert'
                    }
                },
                {
                    path: 'edit',
                    name: 'certEdit',
                    component: () =>
                        import('@/views/content/resources/cert/edit'),
                    hidden: true,
                    meta: {
                        title: '证书编辑',
                        curNav: 'cert'
                    }
                },
                {
                    path: 'detail',
                    name: 'certDetail',
                    component: () =>
                        import('@/views/content/resources/cert/detail'),
                    hidden: true,
                    meta: {
                        title: '证书详情',
                        curNav: 'cert'
                    }
                },
                {
                    path: 'person',
                    name: 'certPerson',
                    component: () =>
                        import('@/views/content/resources/cert/person'),
                    hidden: true,
                    meta: {
                        title: '按人员查看',
                        curNav: 'cert'
                    }
                },
                {
                    path: 'gain',
                    name: 'certGain',
                    component: () =>
                        import('@/views/content/resources/cert/gain'),
                    hidden: true,
                    meta: {
                        title: '获得证书详情',
                        curNav: 'cert'
                    }
                },
                {
                    path: 'user',
                    name: 'certUser',
                    component: () =>
                        import('@/views/content/resources/cert/user'),
                    hidden: true,
                    meta: {
                        title: '获得证书详情',
                        curNav: 'cert'
                    }
                }
            ]
        },
        {
            path: 'tool',
            component: ContentLayout,
            name: 'tool',
            redirect: {name: 'signUpManage'},
            meta: {
                title: '辅助工具',
                icon: 'help',
                permission: [
                    'tools',
                    'veln-sign',
                    'veln-work',
                    'veln-enroll',
                    'veln-qtn'
                ]
            },
            children: [
                {
                    path: 'signUp',
                    component: NoneLayout,
                    name: 'signUpManage',
                    redirect: {name: 'signUp'},
                    meta: {
                        title: '报名管理',
                        permission: ['veln-enroll']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/tool/signUp'),
                            name: 'signUp',
                            meta: {
                                parentTitle: '报名',
                                curNav: 'signUp',
                                permission: ['veln-enroll']
                            }
                        },
                        {
                            path: 'edit',
                            component: NoneLayout,
                            name: 'signUpEdit',
                            redirect: {name: 'basicInfo'},
                            hidden: true,
                            beforeEnter: (to, from, next) => {
                                if (to.query.id) {
                                    to.meta.title = '编辑报名';
                                } else {
                                    to.meta.title = '新增报名';
                                }
                                next();
                            },
                            children: [
                                {
                                    path: 'basic',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/signUp/basicInfo'
                                            ),
                                    name: 'basicInfo',
                                    hidden: true,
                                    meta: {
                                        curNav: 'signUp',
                                        title: '基本信息'
                                    }
                                },
                                {
                                    path: 'setting',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/signUp/signUpSetting'
                                            ),
                                    name: 'signUpSetting',
                                    hidden: true,
                                    meta: {
                                        curNav: 'signUp',
                                        title: '报名设置'
                                    }
                                },
                                {
                                    path: 'participants',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/signUp/participants'
                                            ),
                                    name: 'signUpParticipants',
                                    hidden: true,
                                    meta: {
                                        curNav: 'signUp',
                                        title: '参与人员'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'users',
                            component: () =>
                                import(
                                    '@/views/content/tool/signUp/signUpList'
                                    ),
                            name: 'signUpList',
                            hidden: true,
                            meta: {
                                title: '报名名单',
                                curNav: 'signUp'
                            }
                        },
                        {
                            path: 'userInfo',
                            component: () =>
                                import(
                                    '@/views/content/tool/signUp/signUpList/userInfo'
                                    ),
                            name: 'signUpUserInfo',
                            hidden: true,
                            meta: {
                                title: '学员信息',
                                curNav: 'signUp'
                            }
                        },
                        {
                            path: 'detail',
                            component: () =>
                                import('@/views/content/tool/signUp/detail'),
                            name: 'signUpDetail',
                            hidden: true,
                            meta: {
                                title: '报名详情',
                                curNav: 'signUp'
                            }
                        }
                    ]
                },
                {
                    path: 'signIn',
                    component: NoneLayout,
                    name: 'signInManage',
                    redirect: {name: 'signIn'},
                    meta: {
                        title: '签到管理',
                        permission: ['veln-sign']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/tool/signIn'),
                            name: 'signIn',
                            meta: {
                                parentTitle: '签到',
                                curNav: 'signIn',
                                permission: ['veln-sign']
                            }
                        },
                        {
                            path: 'edit',
                            component: NoneLayout,
                            name: 'signInEdit',
                            redirect: {name: 'singInBasicInfo'},
                            hidden: true,
                            beforeEnter: (to, from, next) => {
                                if (to.query.id) {
                                    to.meta.title = '编辑签到';
                                } else {
                                    to.meta.title = '新增签到';
                                }
                                next();
                            },
                            children: [
                                {
                                    path: 'basic',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/signIn/basicInfo'
                                            ),
                                    name: 'singInBasicInfo',
                                    hidden: true,
                                    meta: {
                                        curNav: 'signIn',
                                        title: '基本信息'
                                    }
                                },
                                {
                                    path: 'setting',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/signIn/signInSetting'
                                            ),
                                    name: 'signInSetting',
                                    hidden: true,
                                    meta: {
                                        curNav: 'signIn',
                                        title: '签到设置'
                                    }
                                },
                                {
                                    path: 'participants',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/signIn/participants'
                                            ),
                                    name: 'participants',
                                    hidden: true,
                                    meta: {
                                        curNav: 'signIn',
                                        title: '参与人员'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'student',
                            component: () =>
                                import(
                                    '@/views/content/tool/signIn/studentManage'
                                    ),
                            name: 'studentManage',
                            hidden: true,
                            meta: {
                                title: '学员管理',
                                curNav: 'signIn'
                            }
                        },
                        {
                            path: 'detail',
                            component: () =>
                                import('@/views/content/tool/signIn/detail'),
                            name: 'signInDetail',
                            hidden: true,
                            meta: {
                                title: '签到详情',
                                curNav: 'signIn'
                            }
                        },
                        {
                            path: 'userInfo',
                            component: () =>
                                import(
                                    '@/views/content/tool/signIn/studentManage/userInfo'
                                    ),
                            name: 'signUserInfo',
                            hidden: true,
                            meta: {
                                title: '学员信息',
                                curNav: 'signIn'
                            }
                        }
                    ]
                },
                {
                    path: 'homework',
                    component: ContentLayout,
                    name: 'homework',
                    redirect: {name: 'homeworkList'},
                    meta: {
                        title: '作业管理',
                        permission: ['veln-work']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/tool/homework/list'),
                            name: 'homeworkList',
                            meta: {
                                parentTitle: '作业',
                                name: 'homeworkList',
                                curNav: 'homeworkList',
                                permission: ['veln-work']
                            }
                        },
                        {
                            path: 'detail',
                            component: () =>
                                import('@/views/content/tool/homework/detail'),
                            name: 'homeworkDetail',
                            hidden: true,
                            meta: {
                                parentTitle: '作业详情',
                                curNav: 'homeworkList'
                            }
                        },
                        {
                            path: 'edit',
                            component: NoneLayout,
                            name: 'homeworkEdit',
                            redirect: {name: 'homeworkBaseInfo'},
                            hidden: true,
                            meta: {
                                curNav: 'homeworkList',
                                title: '新增作业'
                            },
                            beforeEnter(to, from, next) {
                                if (to.query.id) {
                                    to.meta.title = i18n.t('编辑作业');
                                } else {
                                    to.meta.title = i18n.t('新增作业');
                                }
                                next();
                            },
                            children: [
                                {
                                    path: 'base',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/homework/edit/base'
                                            ),
                                    name: 'homeworkBaseInfo',
                                    hidden: true,
                                    meta: {
                                        curNav: 'homeworkList',
                                        title: '基本信息'
                                    }
                                },
                                {
                                    path: 'setting',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/homework/edit/setting'
                                            ),
                                    name: 'homeworkSetting',
                                    hidden: true,
                                    meta: {
                                        curNav: 'homeworkList',
                                        title: '作业设置'
                                    }
                                },
                                {
                                    path: 'participants',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/homework/edit/participants'
                                            ),
                                    name: 'homeworkParticipants',
                                    hidden: true,
                                    meta: {
                                        curNav: 'homeworkList',
                                        title: '参与人员'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'user',
                            component: () =>
                                import('@/views/content/tool/homework/user'),
                            name: 'homeworkUser',
                            hidden: true,
                            meta: {
                                curNav: 'homeworkList',
                                title: '人员名单'
                            }
                        },
                        {
                            path: 'userinfo',
                            component: () =>
                                import(
                                    '@/views/content/tool/homework/user/detail'
                                    ),
                            name: 'homeworkUserInfo',
                            hidden: true,
                            meta: {
                                curNav: 'homeworkList',
                                title: '人员详情'
                            }
                        },
                        {
                            path: 'score',
                            component: () =>
                                import(
                                    '@/views/content/tool/homework/user/score'
                                    ),
                            name: 'homeworkScore',
                            hidden: true,
                            meta: {
                                curNav: 'homeworkList',
                                title: '作业详情'
                            }
                        }
                    ]
                },
                {
                    path: 'survey',
                    component: ContentLayout,
                    name: 'survey',
                    hidden: true,
                    redirect: {name: 'surveyList'},
                    meta: {
                        title: '问卷',
                        permission: ['veln-qtn']
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/tool/survey/list'),
                            name: 'surveyList',
                            meta: {
                                parentTitle: '问卷',
                                name: 'surveyList',
                                curNav: 'surveyList'
                            }
                        },
                        {
                            path: 'detail',
                            component: () =>
                                import('@/views/content/tool/survey/detail'),
                            name: 'surveyDetail',
                            hidden: true,
                            meta: {
                                parentTitle: '问卷详情',
                                curNav: 'surveyList'
                            }
                        },
                        {
                            path: 'edit',
                            component: NoneLayout,
                            name: 'surveyEdit',
                            redirect: {name: 'surveyBaseInfo'},
                            hidden: true,
                            meta: {
                                curNav: 'surveyList',
                                title: '新增问卷'
                            },
                            beforeEnter(to, from, next) {
                                if (to.query.id) {
                                    to.meta.title = i18n.t('编辑问卷');
                                } else {
                                    to.meta.title = i18n.t('新增问卷');
                                }
                                next();
                            },
                            children: [
                                {
                                    path: 'base',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/survey/edit/base'
                                            ),
                                    name: 'surveyBaseInfo',
                                    hidden: true,
                                    meta: {
                                        curNav: 'surveyList',
                                        title: '基本信息'
                                    }
                                },
                                {
                                    path: 'participants',
                                    component: () =>
                                        import(
                                            '@/views/content/tool/survey/edit/participants'
                                            ),
                                    name: 'surveyParticipants',
                                    hidden: true,
                                    meta: {
                                        curNav: 'surveyList',
                                        title: '参与人员'
                                    }
                                }
                            ]
                        },
                        {
                            path: 'statistics',
                            component: () =>
                                import(
                                    '@/views/content/tool/survey/statistics'
                                    ),
                            name: 'surveyStatistics',
                            hidden: true,
                            meta: {
                                curNav: 'surveyList',
                                title: '数据统计'
                            }
                        },
                        {
                            path: 'user',
                            component: () =>
                                import('@/views/content/tool/survey/user'),
                            name: 'surveyUser',
                            hidden: true,
                            meta: {
                                curNav: 'surveyList',
                                title: '学员'
                            }
                        }
                    ]
                },
                {
                    path: 'news',
                    component: ContentLayout,
                    name: 'news',
                    redirect: {name: 'newsList'},
                    meta: {
                        title: '资讯管理'
                    },
                    children: [
                        {
                            path: 'list',
                            component: () =>
                                import('@/views/content/tool/news/list'),
                            name: 'newsList',
                            meta: {
                                parentTitle: '资讯',
                                name: 'newsList',
                                curNav: 'newsList'
                            }
                        },
                        {
                            path: 'detail',
                            component: () =>
                                import('@/views/content/tool/news/detail'),
                            name: 'newsDetail',
                            hidden: true,
                            meta: {
                                parentTitle: '资讯详情',
                                curNav: 'newsList'
                            }
                        },
                        {
                            path: 'edit',
                            component: () =>
                                import('@/views/content/tool/news/edit'),
                            name: 'newsEdit',
                            hidden: true,
                            meta: {
                                curNav: 'newsList',
                                title: '新增资讯'
                            },
                            beforeEnter(to, from, next) {
                                if (to.query.id) {
                                    to.meta.title = i18n.t('编辑资讯');
                                } else {
                                    to.meta.title = i18n.t('新增资讯');
                                }
                                next();
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

export default contentRouter;
