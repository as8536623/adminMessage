// 组件参数数据
export const componentsData = {
    statusSelectList: {
        'ENABLED': '发布',
        'DISABLED': '未发布',
        'DRAFT': '草稿'
    }
};
// 搜索model
export const subjectSearchModel = {
    'code': null,
    'name': null,
    'categoryId': null,
    'createdAt': null
};
// 搜索表单配置
export const subjectSearchConfig = function() {
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
            },
            {
                type: 'select',
                label: '状态',
                model: 'status',
                options: {
                    options: componentsData.statusSelectList
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

// 表格展示配置
export const subjectTableColumns = function(NEW_COURSE_ENUM) {
    const that = this;
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
            minWidth: 30,
            render: (h, param) => {
                const name = param.row.name;
                if (!name) {
                    return '--';
                }
                return h(
                    'span',
                    {
                        attrs: {
                            class: 'table__td__link'
                        },
                        on: {
                            click: () => {
                                this.$router.push({
                                    name: 'subjectCourseDetail',
                                    query: {
                                        subjectId: param.row.id
                                    }
                                });
                            }
                        }
                    },
                    name
                );
            }
        },
        {
            text: '分类',
            field: 'categoryName',
            align: 'left',
            minWidth: 20
        },
        {
            text: '价格',
            field: 'price',
            align: 'left',
            minWidth: 10
        },
        {
            text: '课时',
            field: 'period',
            align: 'left',
            minWidth: 10
        },
        {
            text: '创建时间',
            field: 'createdAt',
            align: 'left',
            minWidth: 20
        },
        {
            text: '创建人',
            field: 'createdByName',
            align: 'left',
            minWidth: 20
        },
        {
            text: '状态',
            field: 'status',
            align: 'left',
            minWidth: 10,
            render: (h, param) => {
                return componentsData.statusSelectList[param.row.status];
            }
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
                            that.handleOpt('switchTop', param.row);
                        }
                    }
                });
            }
        },
        {
            field: 'opt',
            fixed: 'right',
            text: '操作',
            minWidth: 20,
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
                            that.handleOpt('modifyShowOrder', row);
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
                            that.handleOpt('enable', row);
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
                            that.handleOpt('disable', row);
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
                            that.handleOpt('delete', row);
                        }
                    }
                });
                const editBth = h('QgButton', {
                    props: {
                        toolTip: '编辑',
                        type: 'text',
                        icon: 'edit'
                    },
                    on: {
                        click: () => {
                            // 编辑
                            that.handleOpt('edit', row);
                        }
                    }
                });

                optArr.push(modifyShowOrderBtn);
                if (row.status === 'ENABLED') {
                    optArr.push(disableBtn);
                } else if (row.status === 'DISABLED' || row.status === 'DRAFT') {
                    optArr.push(enableBtn);
                    optArr.push(editBth);
                }
                optArr.push(delBtn);
                return h('div', optArr, '');
            }
        }
    ];
};
// 新增对象
export const subjectAddModel = {
    code: '',
    name: '',
    categoryId: '',
    coverId: '',
    coverUrl: '',
    blobId: '',
    desc: '',
    validity: 1,
    bulkSalesFlag: false,
    bulkNumberLimit: 10,
    bulkPrice: 0,
    internalPrice: '',
    period: 0,
    price: '',
    modifyPrice: true,
    modifyPeriod: false,
    teachers: []
};
// 编辑对象
export const subjectEditModel = {
    code: '',
    name: '',
    categoryId: '',
    coverId: '',
    coverUrl: '',
    blobId: '',
    desc: '',
    validity: 1,
    bulkSalesFlag: false,
    bulkNumberLimit: 10,
    bulkPrice: 0,
    internalPrice: '',
    previewFileId: '',
    period: 0,
    price: '',
    modifyPrice: true,
    modifyPeriod: false,
    teachers: []
};

export const stepTwoModel = {
    previewFileId: '',
    courseIdList: []
};

