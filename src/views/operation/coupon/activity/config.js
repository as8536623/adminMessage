// 组件参数数据
export const componentsData = {
    statusSelectList: {
        'ENABLED': '启用',
        'EXPIRED': '失效'
    }
};

// 搜索model
export const couponActivitySearchModel = {
    'name': null,
    'status': 'ENABLED'
};
// 搜索表单配置
export const couponActivitySearchConfig = function() {
    return {
        list: [
            {
                type: 'input',
                label: '活动名称',
                model: 'name',
                options: {}
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
export const tableColumns = function() {
    return [
        {
            type: 'checkbox',
            fixed: 'left'
        },
        {
            text: '活动名称',
            field: 'name',
            align: 'center',
            width: 240
        },
        {
            text: '活动创建时间',
            field: 'updatedAt',
            align: 'center',
            width: 360
        },
        {
            text: '活动时间段',
            align: 'center',
            render: (h, param) => {
                const row = param.row;
                return row.startTime + '-' + row.endTime;
            }
        },
        {
            field: 'opt',
            fixed: 'right',
            text: '操作',
            width: 150,
            render: (h, param) => {
                const row = param.row;
                /* const invalidBtn = h('QgButton', {
                    props: {
                        toolTip: '失效',
                        type: 'text',
                        icon: 'disable'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('invalid', row);
                        }
                    }
                });*/
                const viewBtn = h('QgButton', {
                    props: {
                        toolTip: '查看',
                        type: 'text',
                        icon: 'el-icon-view'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('view', row);
                        }
                    }
                });
                const editBtn = h('QgButton', {
                    props: {
                        toolTip: '编辑',
                        type: 'text',
                        icon: 'el-icon-edit'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('edit', row);
                        }
                    }
                });
                const deleteBtn = h('QgButton', {
                    props: {
                        toolTip: '删除',
                        type: 'text',
                        icon: 'el-icon-delete'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('delete', row);
                        }
                    }
                });
                const optArr = [viewBtn];
                const status = row.status;
                switch (status) {
                    case 'ENABLED':
                        row.start || optArr.push(editBtn);
                        optArr.push(deleteBtn);
                        break;
                    case 'EXPIRED':
                        optArr.push(deleteBtn);
                        break;
                    default:
                }
                return h('div', optArr, '');
            }
        }
    ];
};
// 新增对象
export const couponActivityAddModel = {
    name: '',
    startTime: '',
    endTime: '',
    clickImgId: '',
    openImgId: '',
    mobileImgId: ''
};
// 编辑对象
export const couponActivityEditModel = {
    name: '',
    startTime: '',
    endTime: '',
    clickImgId: '',
    openImgId: '',
    mobileImgId: ''
};
