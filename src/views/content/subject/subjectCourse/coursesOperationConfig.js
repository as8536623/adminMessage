import {NEW_COURSE_ENUM} from '@/enum/common';
import {optColumnRenderFun} from './operationalCommonConfig';
// 搜索model
export const coursesOperationSearchModel = {
    keyword: '',
    filterStatus: null,
    createTime: null,
    funId: ''
};
// 搜索表单配置
export const coursesOperationSearchConfig = function() {
    return {
        list: [
            {
                type: 'input',
                label: '课程ID/名称',
                model: 'keyword',
                options: {}
            },
            {
                type: 'checkbox',
                label: '状态',
                model: 'filterStatus',
                options: {
                    options: NEW_COURSE_ENUM.arr
                }
            },
            {
                type: 'daterange',
                label: '创建时间',
                model: 'createTime',
                options: {
                    format: 'yyyy-MM-dd'
                }
            }
        ],
        config: {
            onSearch: data => {
                this.handleSearch();
            },
            model: this.listQuery
        }
    };
};

export const courseSelectorTableColumns = [
    {
        type: 'checkbox'
    },
    {
        field: 'courseCode',
        text: '课程编号',
        minWidth: 100
    },
    {
        field: 'courseName',
        text: '课程名称',
        minWidth: 160
    },
    {
        field: 'categoryName',
        text: '课程类别',
        minWidth: 160
    },
    {
        field: 'teacherName',
        text: '授课讲师',
        minWidth: 160
    },
    {
        field: 'period',
        text: '课时',
        width: 80
    },
    {
        field: 'price',
        text: '价格',
        width: 80
    },
    {
        field: 'recordDate',
        text: '录制年月',
        width: 100
    }
];

// 表格展示配置
export const tableColumns = function(NEW_COURSE_ENUM) {
    return [
        {
            text: '课程ID',
            field: 'courseCode',
            align: 'left',
            minWidth: 80
        },
        {
            text: '课程名称',
            field: 'courseName',
            align: 'left',
            minWidth: 80
        },
        {
            text: '类别',
            field: 'courseCategoryName',
            align: 'left',
            minWidth: 80
        },
        {
            text: '课时',
            field: 'period',
            align: 'left',
            minWidth: 80
        },
        {
            text: '价格',
            field: 'price',
            align: 'left',
            minWidth: 80
        },
        {
            text: '录制年月',
            field: 'recordDate',
            align: 'left',
            minWidth: 80
        },
        {
            text: '创建时间',
            field: 'createDate',
            align: 'left',
            minWidth: 80
        },
        {
            text: '创建人',
            field: 'createPerson',
            align: 'left',
            minWidth: 80
        },
        {
            text: '状态',
            field: 'status',
            align: 'left',
            minWidth: 80,
            render: (h, param) => {
                return NEW_COURSE_ENUM.getName(param.row.status);
            }
        },
        {
            text: '排序',
            field: 'showOrder',
            align: 'left',
            minWidth: 80
        },
        {
            field: 'opt',
            fixed: 'right',
            text: '操作',
            width: 100,
            render: (h, param) => {
                return optColumnRenderFun(h, param, this);
            }
        }
    ];
};

// 表格展示配置
export const freeGoodCourseTableColumns = function(NEW_COURSE_ENUM) {
    return [
        {
            field: 'operationId',
            type: 'checkbox',
            fixed: 'left'
        },
        {
            text: '课程ID',
            field: 'courseCode',
            align: 'left',
            minWidth: 80
        },
        {
            text: '课程名称',
            field: 'courseName',
            align: 'left',
            minWidth: 80
        },
        {
            text: '创建时间',
            field: 'createDate',
            align: 'left',
            minWidth: 80
        },
        {
            text: '创建人',
            field: 'createPerson',
            align: 'left',
            minWidth: 80
        },
        {
            text: '排序',
            field: 'showOrder',
            align: 'left',
            minWidth: 80
        },
        {
            text: '置顶',
            field: 'enableTop',
            align: 'left',
            minWidth: 80,
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
            minWidth: 80,
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
                return optColumnRenderFun(h, param, this);
            }
        }
    ];
};

// 新增对象
export const coursesOperationAddModel = {
    funCode: '',
    funId: '',
    relType: '',
    resourceId: '',
    enableTop: '',
    status: '',
    showOrder: ''
};
// 编辑对象
export const coursesOperationEditModel = {
    funCode: '',
    funId: '',
    relType: '',
    resourceId: '',
    enableTop: '',
    status: '',
    showOrder: ''
};

/**
 * 资源选择组件
 * @param tableColumns
 * @param extraParam
 * @param url
 * @param title
 * @param key
 * @constructor
 */
export function ResourceSelectorComponent(tableColumns, extraParam, url, title, key) {
    this.tableColumns = tableColumns;
    this.extraParam = extraParam;
    this.url = url;
    this.title = title;
    this.key = key;
}

