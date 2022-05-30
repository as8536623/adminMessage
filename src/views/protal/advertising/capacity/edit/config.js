// 组件参数数据
export const componentsData = {
    typeSelectList: {
        'CPA': '会计师',
        'ICTA': '税务师',
        'PE': '绩效评价师',
        'CBAP': '大数据商业分析师'
    },
    certTypeSelectList: {
        'LOW': '初级',
        'MIDDLE': '中级',
        'HIGH': '高级'
    }
};

// 搜索model
export const certSearchModel = {};
// 搜索表单配置
export const certSearchConfig = function() {
    return {
        list: [],
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
            text: '名称',
            field: 'name',
            align: 'left',
            minWidth: 80
        },
        {
            text: '证书类型',
            field: 'type',
            align: 'left',
            width: 80,
            render: (h, param) => {
                return componentsData.typeSelectList[param.row.type];
            }
        },
        {
            text: '展示图片id',
            field: 'imgId',
            align: 'left',
            minWidth: 80
        },
        {
            text: '排序',
            field: 'showOrder',
            align: 'left',
            width: 80
        },
        {
            text: '证书等级',
            field: 'certType',
            align: 'left',
            width: 80,
            render: (h, param) => {
                return componentsData.certTypeSelectList[param.row.certType];
            }
        },
        {
            text: '开始时间',
            field: 'startTime',
            align: 'left',
            width: 160
        },
        {
            text: '结束时间',
            field: 'endTime',
            align: 'left',
            width: 160
        },
        {
            text: '状态（ENABLED--启用、DISABLED--停用）',
            field: 'status',
            align: 'left',
            minWidth: 80
        },
        {
            text: '拓展对象集合',
            field: 'extContent',
            align: 'left',
            minWidth: 80
        },
        {
            text: '创建人',
            field: 'createdByName',
            align: 'left',
            width: 100
        },
        {
            text: '修改人',
            field: 'updatedByName',
            align: 'left',
            width: 100
        },
        {
            field: 'opt',
            fixed: 'right',
            text: '操作',
            width: 100,
            render: (h, param) => {
                const row = param.row;
                const optArr = [];
                const viewBtn = h('QgButton', {
                    props: {
                        toolTip: '查看',
                        type: 'text',
                        icon: 'el-icon-view'
                    },
                    on: {
                        click: () => {
                            // 编辑
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
                            // 编辑
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

                optArr.push(viewBtn);
                optArr.push(editBtn);
                optArr.push(deleteBtn);
                return h('div', optArr, '');
            }
        }
    ];
};
// 新增对象
export const certAddModel = {
    name: '',
    type: '',
    imgId: '',
    certType: '',
    startTime: '',
    endTime: '',
    extContent: [],
    validity: []
};
// 编辑对象
export const certEditModel = {
    name: '',
    type: '',
    imgId: '',
    showOrder: '',
    certType: '',
    startTime: '',
    endTime: '',
    status: '',
    validity: []
};
