/**
 * 课程相关枚举
 * @author yuqiusuo
 * @date 2020-8-25
 */
import i18n from '@/lang';
import EsEnum from './EsEnum';

// 课程状态
const COURSE_STATUS_ENUM = new EsEnum([
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'DISABLED', name: i18n.t('停用')},
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'APPROVE_SUCCESS', name: i18n.t('启用')}
]);

// 课程状态
const COURSE_APPROVE_STATUS_ENUM = new EsEnum([
    {code: 'ALL', name: i18n.t('全部')},
    {code: 'APPROVING', name: i18n.t('审核中')},
    {code: 'APPROVE_FAIL', name: i18n.t('审核拒绝')},
    {code: 'APPROVE_SUCCESS', name: i18n.t('审核通过')}
]);

const COURSE_TYPE_ENUM = new EsEnum([
    {code: 'VIDEO', name: i18n.t('视频')},
    {code: 'AUDIO', name: i18n.t('音频')},
    {code: 'DOC', name: i18n.t('文档')}
]);

const NEW_COURSE_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'DISABLED', name: i18n.t('停用')}
]);

export {
    COURSE_STATUS_ENUM,
    COURSE_APPROVE_STATUS_ENUM,
    COURSE_TYPE_ENUM,
    NEW_COURSE_ENUM
};
