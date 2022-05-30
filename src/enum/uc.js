/**
 * UC相关枚举
 * @author yuqiusuo
 * @date 2020-8-25
 */
import i18n from '@/lang';
import EsEnum from './EsEnum';

// 人员状态
const PERSON_STATUS_ENUM = new EsEnum([
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'DISABLED', name: i18n.t('停用')},
    {code: 'LEAVE', name: i18n.t('离职')}
]);

// 群组状态
const GROUP_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {
        code: 'ENABLED',
        name: i18n.t('启用')
    },
    {code: 'DISABLED', name: i18n.t('停用')}
]);

// 人员选择-类型
const ORG_TYPE_ENUM = new EsEnum([
    {code: 'POSITION', name: i18n.t('position')},
    {
        code: 'ORG',
        name: i18n.t('org')
    },
    {code: 'GROUP', name: i18n.t('group')},
    {code: 'GROUP_CATEGORY', name: i18n.t('groupCategory')}
]);

// 讲师类型
const TEACHER_TYPE_ENUM = new EsEnum([
    {code: 'OUTER', name: i18n.t('院外')},
    {code: 'INNER', name: i18n.t('院内')}
]);

// 讲师任职属性
const TEACHER_JOB_TYPE_ENUM = new EsEnum([
    {code: 'FULL', name: i18n.t('全职')},
    {code: 'PART', name: i18n.t('兼职')}
]);

// 学员登录限制
const LIMIT_LOGIN_ENUM = new EsEnum([
    {code: 'NOT_LIMIT', name: i18n.t('不限制登录时间')},
    {code: 'LIMITED_DAY', name: i18n.t('限制每天可登录时间')},
    {code: 'LIMITED_WEEK', name: i18n.t('限制每周可登录时间')}
]);

export {
    PERSON_STATUS_ENUM,
    GROUP_STATUS_ENUM,
    ORG_TYPE_ENUM,
    TEACHER_TYPE_ENUM,
    TEACHER_JOB_TYPE_ENUM,
    LIMIT_LOGIN_ENUM
};
