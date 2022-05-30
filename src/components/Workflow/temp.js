import {deepClone, formatBranch} from './utils';
// 申请人模板数据
const APPLY_TEMP = {
    id: '',
    type: 'apply',
    nodeType: 'START_EVENT',
    name: '发起人',
    field: {}
};

// 审批人模板数据
const AUDIT_TEMP = {
    id: '',
    type: 'audit',
    nodeType: 'USER_TASK',
    name: '审批人',
    field: {
        userType: 'APPOINT',
        noUser: 'AUTO',
        noUserDelegate: '',
        approvalType: 'COMMON',
        arbitrarilyCount: ''
    }
};

// 抄送人模板数据
const CC_TEMP = {
    id: '',
    type: 'cc',
    nodeType: 'USER_TASK',
    name: '抄送人',
    field: {}
};

// 条件分支模板
const BRANCH_TEMP = {
    id: '',
    type: 'branch',
    priority: 1,
    name: '条件',
    field: {
        conditionExpression: ''
    },
    text: '',
    children: []
};

// 条件模板
const CONDITION_TEMP = {
    id: '',
    type: 'condition',
    nodeType: 'EXCLUSIVE_GATEWAY',
    children: [formatBranch(deepClone(BRANCH_TEMP), 1), formatBranch(deepClone(BRANCH_TEMP), 2)]
};

export default {APPLY_TEMP, AUDIT_TEMP, CC_TEMP, BRANCH_TEMP, CONDITION_TEMP};
