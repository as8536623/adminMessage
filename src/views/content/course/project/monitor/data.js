const taskList = {
    sign: {
        name: '考勤',
        type: 'SIGN',
        infoTitle: '签到名称'
    },
    exam: {
        name: '考试',
        type: 'EXAM',
        infoTitle: '考试名称'
    },
    work: {
        name: '作业',
        type: 'WORK',
        infoTitle: '作业标题'
    },
    activity: {
        name: '活动',
        type: 'ACTIVITY',
        infoTitle: '活动标题'
    },
    faceCourse: {
        name: '面授课',
        type: 'REQUIRE_FACE_COURSE,OPTIONAL_FACE_COURSE',
        infoTitle: '课程名称'
    },
    onlineCourse: {
        name: '在线课',
        type: 'REQUIRE_ONLINE_COURSE,OPTIONAL_ONLINE_COURSE',
        infoTitle: '课程名称'
    }
};

const commonTableColumns = that => [
    {
        field: 'code',
        text: that.$t('工号'),
        minWidth: 100,
        render: (h, param) => {
            return param.row.user.code;
        }
    },
    {
        field: 'name',
        text: that.$t('姓名'),
        minWidth: 100,
        render: (h, param) => {
            const name = param.row.user.name;
            return h(
                'span',
                {
                    attrs: {
                        class: 'table__td__link'
                    },
                    on: {
                        click: () => {
                            that.$router.push({
                                name: 'projectUserInfo',
                                query: {userId: param.row.id}
                            });
                        }
                    }
                },
                name
            );
        }
    },
    {
        field: 'loginName',
        text: that.$t('用户名'),
        minWidth: 100,
        render: (h, param) => {
            return param.row.user.loginName;
        }
    },
    {
        field: 'mobile',
        text: that.$t('手机号码'),
        minWidth: 110,
        render: (h, param) => {
            return param.row.user.mobile || '--';
        }
    },
    {
        field: 'positionName',
        text: that.$t('岗位'),
        render: (h, param) => {
            return param.row.user.positionName
                ? param.row.user.positionName
                : '--';
        }
    },
    {
        field: 'orgName',
        text: that.$t('部门'),
        minWidth: 150,
        render: (h, param) => {
            const row = param.row.user;
            if (!row.orgNamePath) {
                return row.orgName || '--';
            }
            return h(
                'ElTooltip',
                {
                    props: {
                        effect: 'dark',
                        placement: 'right',
                        content: row.orgNamePath
                    }
                },
                [h('span', row.orgName || '--')]
            );
        }
    }
];

export {
    taskList,
    commonTableColumns
};
