/**
 * 证书相关枚举
 * @author yuqiusuo
 * @date 2020-8-25
 */
import i18n from '@/lang';
import EsEnum from './EsEnum';

// 证书状态
const CERT_STATUS_ENUM = new EsEnum([
    {code: 'VALID', name: i18n.t('有效')},
    {
        code: 'CANCEL',
        name: i18n.t('作废')
    },
    {code: 'EXPIRE', name: i18n.t('过期')}
]);

// 证书来源
const CERT_ORIGIN_ENUM = new EsEnum([
    {code: 'course', name: i18n.t('课程')},
    {code: 'exam', name: i18n.t('考试')}
]);

// 证书日志类型
const CERT_LOG_TYPE_ENUM = new EsEnum([
    {code: 'RENEWAL', name: i18n.t('续期')},
    {
        code: 'CANCEL',
        name: i18n.t('作废')
    },
    {code: 'ISSUE', name: i18n.t('下发')}
]);

export {
    CERT_STATUS_ENUM,
    CERT_ORIGIN_ENUM,
    CERT_LOG_TYPE_ENUM
};
