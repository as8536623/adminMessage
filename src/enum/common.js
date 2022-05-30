import i18n from '@/lang';
import EsEnum from './EsEnum';

// 通用状态
const COMMON_STATUS_ENUM = new EsEnum([
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'DISABLED', name: i18n.t('停用')},
    {code: 'APPROVING', name: i18n.t('待审核')},
    {code: 'APPROVE_SUCCESS', name: i18n.t('审核通过')},
    {code: 'APPROVE_FAIL', name: i18n.t('审核失败')},
    {code: 'DRAFT', name: i18n.t('草稿')}
]);

// 标签组类型
const LABEL_GROUP_ENUM = new EsEnum([
    {code: 'COURSE', name: i18n.t('课程')},
    {code: 'SIGN_UP', name: i18n.t('报名')},
    {code: 'FILE', name: i18n.t('文件')},
    {code: 'PERSONNEL', name: i18n.t('人员')},
    {code: 'KNOWLEDGE', name: i18n.t('资料')}
]);

// 知识状态
const KNOWLEDGE_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'DISABLED', name: i18n.t('停用')},
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'APPROVING', name: i18n.t('审核中')},
    {code: 'APPROVE_FAIL', name: i18n.t('审核失败')}
]);

// 外部人员能否参与
const OUT_USER_JOIN_ENUM = new EsEnum([
    {code: true, name: i18n.t('可以参与，必须填写姓名和手机号')},
    {code: false, name: i18n.t('不可以参与')}
]);

// 提醒类型
const REMINDER_ENUM = new EsEnum([
    {code: 'NOTICE', name: i18n.t('站内信')},
    {code: 'MAIL', name: i18n.t('邮件')},
    {code: 'SMS', name: i18n.t('短信')}
]);

// 密码规则设置
const PASSWORD_RULE_SET_ENUM = new EsEnum([
    {code: 'UPPERCASE', name: i18n.t('大写字母')},
    {code: 'LOWERCASE', name: i18n.t('小写字母')},
    {code: 'NUMBER', name: i18n.t('数字')},
    {code: 'SPECIAL', name: i18n.t('特殊字符')}
]);

// 问卷设置
const SURVEY_SETTING_ENUM = new EsEnum([
    {code: 'ANONYMITY', name: i18n.t('匿名参加')},
    {code: 'INNER', name: i18n.t('允许内部非安排人员通过现场扫描参与')},
    {code: 'OUTER', name: i18n.t('允许外部人员通过现场扫描参与')}
]);

// 问卷-人员提交状态
const SURVEY_USER_TYPE_ENUM = new EsEnum([
    {code: 'NOT_SUBMIT', name: i18n.t('未提交')},
    {code: 'SUBMIT', name: i18n.t('已提交')}
]);

// 语言属性languageType
const LANGUAGE_TYPE_ENUM = new EsEnum([
    {code: 'CHINESE', name: i18n.t('中文')},
    {code: 'ENGLISH', name: i18n.t('英文')},
    {code: 'TRADITIONAL_CHINESE', name: i18n.t('繁体中文')},
    {code: 'JAPANESE', name: i18n.t('日文')},
    {code: 'KOREAN', name: i18n.t('韩语')}
]);

const FILE_ALL_TYPE_ENUM = new EsEnum([
    {code: 'image', name: i18n.t('图片')},
    {code: 'video', name: i18n.t('视频')},
    {code: 'audio', name: i18n.t('音频')},
    {code: 'archive', name: i18n.t('文档')},
    {code: 'documents', name: i18n.t('文档')},
    {code: 'font', name: i18n.t('图标')},
    {code: 'pdf', name: i18n.t('文档')}
]);

const DATE_RANGE_ENUM = new EsEnum([
    {code: 'ALL', name: i18n.t('全部时间')},
    {code: 'DAY', name: i18n.t('最近一天')},
    {code: 'WEEK', name: i18n.t('最近一周')},
    {code: 'MONTH', name: i18n.t('最近一月')},
    {code: 'SESSION', name: i18n.t('最近三个月')}
]);

// 视频清晰度
const VIDEO_DEFINITION = new EsEnum([
    {code: '360', name: '极速'},
    {code: '480', name: '标清'},
    {code: '540', name: '高清'},
    {code: '720', name: '超清'},
    {code: '1080', name: '蓝光'},
    {code: 'origin', name: '原画'}
]);

// 层级
const TIER_ENUM = new EsEnum([
    {code: '', name: '不限'},
    {code: 'HIGH', name: '高级管理'},
    {code: 'MIDDLE', name: '中级管理'},
    {code: 'LOW', name: '初级管理'},
    {code: 'BASE', name: '基层管理'}
]);

export {
    FILE_ALL_TYPE_ENUM,
    LABEL_GROUP_ENUM,
    KNOWLEDGE_STATUS_ENUM,
    REMINDER_ENUM,
    OUT_USER_JOIN_ENUM,
    COMMON_STATUS_ENUM,
    PASSWORD_RULE_SET_ENUM,
    SURVEY_SETTING_ENUM,
    SURVEY_USER_TYPE_ENUM,
    LANGUAGE_TYPE_ENUM,
    DATE_RANGE_ENUM,
    VIDEO_DEFINITION,
    TIER_ENUM
};
