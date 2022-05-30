import {dateFormat} from '@/utils';

// 组件参数数据
export const componentsData = {
    statusSelectList: {
        'false': '已失效',
        'true': '正常'
    }
};

// 搜索model
export const rechargeCardSearchModel = {
    'status': null,
    'createUser': '',
    'createdAt': null
};
// 搜索表单配置
export const rechargeCardSearchConfig = function() {
    return {
        list: [
            {
                type: 'input',
                label: '创建人',
                model: 'createdBy'
            },
            {
                type: 'select',
                label: '状态',
                model: 'effective',
                options: {
                    options: componentsData.statusSelectList
                }
            },
            {
                type: 'datetimerange',
                label: '创建时间',
                model: 'createdTime',
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
            text: '卡名称',
            field: 'name',
            align: 'left',
            minWidth: 40
        },
        {
            text: '金额',
            field: 'balance',
            align: 'left',
            minWidth: 30
        },
        {
            text: '数量',
            field: 'count',
            align: 'left',
            minWidth: 30
        },
        {
            text: '已使用数量',
            field: 'use',
            align: 'left',
            minWidth: 30,
            render: (h, param) => {
                return param.row.use || 0;
            }
        },
        {
            text: '有效期',
            field: 'endTime',
            align: 'left',
            minWidth: 50,
            render: (h, param) => {
                const row = param.row;
                return dateFormat(row.startTime, 'yyyy/MM/dd') + '  -  ' + dateFormat(row.endTime, 'yyyy/MM/dd');
            }
        },
        {
            text: '创建人',
            align: 'left',
            minWidth: 30,
            render: (h, param) => {
                return param.row.createdBy || '--';
            }
        },
        {
            text: '创建时间',
            field: 'createdAt',
            align: 'left',
            minWidth: 30,
            render: (h, param) => {
                const row = param.row;
                return dateFormat(row.createdAt, 'yyyy/MM/dd');
            }
        },
        {
            text: '状态',
            field: 'status',
            align: 'left',
            minWidth: 30,
            render: (h, param) => {
                return componentsData.statusSelectList[param.row.effective];
            }
        },
        {
            field: 'opt',
            fixed: 'right',
            text: '操作',
            minWidth: 40,
            render: (h, param) => {
                const row = param.row;
                const optArr = [];
                const viewBtn = h('QgButton', {
                    props: {
                        toolTip: '详情',
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
                const invalidBtn = h('QgButton', {
                    props: {
                        toolTip: '作废',
                        type: 'text',
                        icon: 'disable'
                    },
                    on: {
                        click: () => {
                            // 编辑
                            this.handleOpt('disable', row);
                        }
                    }
                });
                const giveBtn = h('QgButton', {
                    props: {
                        toolTip: '赠送',
                        type: 'text',
                        icon: 'el-icon-share'
                    },
                    on: {
                        click: () => {
                            this.handleOpt('give', row);
                        }
                    }
                });

                optArr.push(viewBtn);
                if (row.effective) {
                    optArr.push(invalidBtn);
                    optArr.push(giveBtn);
                }

                return h('div', optArr, '');
            }
        }
    ];
};

/**
 * 赠送人员组件展示列
 * @type {({type: string}|{field: string, minWidth: number, text: string}|{field: string, minWidth: number, text: string}|{field: string, minWidth: number, text: string}|{field: string, minWidth: number, text: string})[]}
 */
export const giveSelectorTableColumns = [
    {type: 'checkbox'},
    {field: 'loginName', text: '账户', minWidth: 50},
    {field: 'name', text: '姓名', minWidth: 50},
    {field: 'email', text: '邮箱', minWidth: 50},
    {field: 'mobile', text: '手机号', minWidth: 30}
];

// 新增对象
export const rechargeCardAddModel = {
    name: '',
    balance: '',
    count: '',
    startTime: '',
    endTime: '',
    type: 'RECHARGE'
};
// 编辑对象
export const rechargeCardEditModel = {
    name: '',
    balance: '',
    count: '',
    startTime: '',
    endTime: '',
    type: 'RECHARGE'
};
