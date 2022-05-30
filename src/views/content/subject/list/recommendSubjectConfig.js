// 组件参数数据
export const componentsData = {};

// 搜索model
export const recommendSubjectSearchModel = {
    'code': null,
    'name': null,
    'categoryId': null,
    'createdAt': null
};
// 搜索表单配置
export const recommendSubjectSearchConfig = function() {
    return {
        list: [
            {
                type: 'input',
                label: '专题ID',
                model: 'code',
                options: {}
            },
            {
                type: 'input',
                label: '专题名称',
                model: 'name',
                options: {}
            },
            {
                type: 'select',
                label: '专题类型',
                model: 'categoryId',
                options: {
                    options: this.categoryOptionsArray
                }
            },
            {
                type: 'daterange',
                label: '创建时间',
                model: 'createdAt',
                options: {
                    format: 'yyyy-MM-dd'
                }
            }
        ],
        config: {
            onSearch: data => {
                this.handleSearch(data);
            },
            model: this.listQuery
        }
    };
};

export const subjectSelectorComponentTableColumns = [
    {
        type: 'checkbox',
        fixed: 'left'
    },
    {
        text: '专题ID',
        field: 'code',
        align: 'left',
        minWidth: 10
    },
    {
        text: '专题名称',
        field: 'name',
        align: 'left',
        minWidth: 20
    },
    {
        text: '类别',
        field: 'categoryName',
        align: 'left',
        minWidth: 20
    },
    {
        text: '授课讲师',
        field: 'teacherNames',
        align: 'left',
        minWidth: 20
    },
    {
        text: '课时',
        field: 'period',
        align: 'left',
        minWidth: 5
    },
    {
        text: '价格',
        field: 'price',
        align: 'left',
        minWidth: 5
    },
    {
        text: '创建时间',
        field: 'createDate',
        align: 'left',
        minWidth: 30
    }
];

// 表格展示配置
export const recommendTableColumns = function(NEW_COURSE_ENUM) {
    return [
        {
            type: 'checkbox',
            fixed: 'left'
        },
        {
            text: '专题ID',
            field: 'code',
            align: 'left',
            minWidth: 15
        },
        {
            text: '专题名称',
            field: 'name',
            align: 'left',
            minWidth: 30
        },
        {
            text: '排序',
            field: 'showOrder',
            align: 'left',
            minWidth: 10
        },
        {
            text: '置顶',
            field: 'enableTop',
            align: 'left',
            minWidth: 10,
            render: (h, param) => {
                return h('ElSwitch', {
                    props: {
                        value: param.row.enableTop
                    },
                    on: {
                        change: () => {
                            this.handleOpt('switchTop', param.row);
                        }
                    }
                });
            }
        },
        {
            text: '状态',
            field: 'status',
            align: 'left',
            minWidth: 10,
            render: (h, param) => {
                return NEW_COURSE_ENUM.getName(param.row.status);
            }
        },
        {
            field: 'opt',
            fixed: 'right',
            text: '操作',
            width: 100,
            render: (h, param) => {
                const row = param.row;
                const optArr = [];
                const modifyShowOrderBtn = h('QgButton', {
                    props: {
                        toolTip: '修改排序',
                        type: 'text',
                        icon: 'el-icon-sort'
                    },
                    on: {
                        click: () => {
                            // 编辑
                            this.handleOpt('modifyShowOrder', row);
                        }
                    }
                });

                const enableBtn = h('QgButton', {
                    props: {
                        toolTip: '启用',
                        type: 'text',
                        icon: 'enable'
                    },
                    on: {
                        click: () => {
                            // 编辑
                            this.handleOpt('enable', row);
                        }
                    }
                });
                const disableBtn = h('QgButton', {
                    props: {
                        toolTip: '禁用',
                        type: 'text',
                        icon: 'disable'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('disable', row);
                        }
                    }
                });
                const delBtn = h('QgButton', {
                    props: {
                        toolTip: '删除',
                        type: 'text',
                        icon: 'del'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('delete', row);
                        }
                    }
                });

                optArr.push(modifyShowOrderBtn);
                if (row.status === 'ENABLED') {
                    optArr.push(disableBtn);
                } else if (row.status === 'DISABLED' || row.status === 'DRAFT') {
                    optArr.push(enableBtn);
                }

                optArr.push(delBtn);
                return h('div', optArr, '');
            }
        }
    ];
};
