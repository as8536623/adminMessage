/**
 * 面授相关枚举
 * @author yuqiusuo
 * @date 2020-8-25
 */
import i18n from '@/lang';
import EsEnum from './EsEnum';

// 通用活动状态
const ACTIVITY_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'NOT_STARTED', name: i18n.t('未开始')},
    {code: 'PROGRESSING', name: i18n.t('进行中')},
    {code: 'FINISHED', name: i18n.t('已结束')},
    {code: 'DISABLED', name: i18n.t('已停用')}
]);

// 活动状态
const PROJECT_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'NOT_STARTED', name: i18n.t('未开始')},
    {code: 'PROGRESSING', name: i18n.t('进行中')},
    {code: 'FINISHED', name: i18n.t('已结束')},
    {code: 'DISABLED', name: i18n.t('已停用')}
]);

// 作业状态
const HOMEWORK_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'NOT_STARTED', name: i18n.t('未开始')},
    {code: 'PROGRESSING', name: i18n.t('进行中')},
    {code: 'FINISHED', name: i18n.t('已结束')},
    {code: 'DISABLED', name: i18n.t('已停用')}
]);

// 作业类型
const HOMEWORK_TYPE_EDIT_ENUM = new EsEnum([
    {code: 'VIDEO', name: i18n.t('视频作业-学员拍摄或上传视频')},
    // { code: 'VOICE', name: i18n.t('语音作业-学员使用"图片+语音"') },
    {code: 'PICTURE_TEXT', name: i18n.t('图文作业-学员使用"图片+文字"')},
    {code: 'DOCUMENT', name: i18n.t('文档作业-学员上传文档')}
]);

// 作业类型-简化
const HOMEWORK_TYPE_ENUM = new EsEnum([
    {code: 'VIDEO', name: i18n.t('视频作业')},
    {code: 'VOICE', name: i18n.t('语音作业')},
    {code: 'PICTURE_TEXT', name: i18n.t('图文作业')},
    {code: 'DOCUMENT', name: i18n.t('文档作业')}
]);

// 作业结束状态
const HOMEWORK_FINISH_ENUM = new EsEnum([
    {code: 'SUBMIT', name: i18n.t('提交即完成')},
    {
        code: 'PASS',
        name: i18n.t('评分达到及格分')
    }
]);

// 作业-人员提交状态
const HOMEWORK_USER_TYPE_ENUM = new EsEnum([
    {code: 'NOT_SUBMIT', name: i18n.t('未提交')},
    {code: 'NOT_JUDGED', name: i18n.t('未评分')},
    {code: 'JUDGED', name: i18n.t('已评分')},
    {code: 'NO_PASS', name: i18n.t('未通过')},
    {code: 'MANUAL_NO_PASS', name: i18n.t('未通过手动')},
    {code: 'PASS', name: i18n.t('已通过')},
    {code: 'MANUAL_PASS', name: i18n.t('通过手动')}
]);

// 签到活动状态
const SIGN_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'NOT_STARTED', name: i18n.t('未开始')},
    {code: 'PROGRESSING', name: i18n.t('进行中')},
    {code: 'FINISHED', name: i18n.t('已结束')},
    {code: 'DISABLED', name: i18n.t('已停用')}
]);

// 面授状态
const FACE_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    // { code: 'ENROLL_PENDING', name: i18n.t('待报名') },
    // { code: 'ENROLL_PROGRESSING', name: i18n.t('报名中') },
    // { code: 'EXE_PENDING', name: i18n.t('待实施') },
    // { code: 'EXE_PROGRESSING', name: i18n.t('实施中') },
    {code: 'NOT_STARTED', name: i18n.t('未开始')},
    {code: 'PROGRESSING', name: i18n.t('进行中')},
    {code: 'FINISHED', name: i18n.t('已结束')},
    {code: 'DISABLED', name: i18n.t('已停用')}
]);

const FACE_USER_TYPE_ENUM = new EsEnum([
    {code: 'FACE', name: i18n.t('面授')},
    {code: 'ENROLL', name: i18n.t('报名')}
]);

// 来源枚举
const SIGN_ORIGIN_ENUM = new EsEnum([
    {code: 'APPOINT_INNER', name: i18n.t('内部指定')},
    {code: 'APPOINT_OUTER', name: i18n.t('外部指定')},
    {code: 'PARTICIPATE_OUTER', name: i18n.t('外部参与')}
]);

// 签到类型
// 接口返回的userStatus字段：出勤 ATTENDANCE、缺勤 ABSENCE、出勤(手动) ATTENDANCE_MANUAL、缺勤(手动) ABSENCE_MANUAL
const SIGNING_IN_ENUM = new EsEnum([
    {code: 'ATTENDANCE', name: i18n.t('出勤')},
    {code: 'ABSENCE', name: i18n.t('缺勤')},
    // {code: 'INVALID', name: i18n.t('无效')},
    {code: 'ATTENDANCE_MANUAL', name: i18n.t('出勤（手动）')},
    {code: 'ABSENCE_MANUAL', name: i18n.t('缺勤（手动）')}
]);

// 缺席类型
const ABSENCE_TYPE_ENUM = new EsEnum([
    {code: 'LATE', name: i18n.t('迟到')},
    {code: 'LEAVE_EARLY', name: i18n.t('早退')},
    {code: 'LEAVE', name: i18n.t('请假')},
    {code: 'OTHER', name: i18n.t('其他')}
]);

// 申请类型
const APPLY_STATUS_ENUM = new EsEnum([
    {code: 'PENDING', name: i18n.t('待审核')},
    {
        code: 'PASS',
        name: i18n.t('已通过')
    },
    {code: 'REFUSED', name: i18n.t('已拒绝')}
]);

// 设置考核通过条件
const SET_CHECK_CONDITION = new EsEnum([
    {code: 'SIGN', name: i18n.t('签到')},
    {code: 'ENROLL', name: i18n.t('活动')},
    {code: 'WORK', name: i18n.t('作业')},
    {code: 'STONE', name: i18n.t('能量石')},
    {code: 'PE', name: i18n.t('考试')},
    {code: 'INTERACT', name: i18n.t('互动')}
]);

// 积分增减类型
const SCORE_CHANGE_TYPE_ENUM = new EsEnum([
    {code: 'ADD', name: i18n.t('获得')},
    {code: 'MINUS', name: i18n.t('消耗')}
]);

// 事项
const SOURCE_ENUM = new EsEnum([
    {code: 'SIGN', name: i18n.t('签到')},
    {code: 'ENROLL', name: i18n.t('活动')},
    {
        code: 'WORK',
        name: i18n.t('作业')
    }
]);

// 类型
const STONE_TYPE_ENUM = new EsEnum([
    {code: 'ADD', name: i18n.t('增加')},
    {code: 'REDUCE', name: i18n.t('减少')}
]);

// 方式
const STONE_WAY_ENUM = new EsEnum([
    {code: 'AUTO', name: i18n.t('自动获取')},
    {code: 'MANUAL', name: i18n.t('手动操作')}
]);

// 申请类型
const ENROLL_APPLY_STATUS_ENUM = new EsEnum([
    {code: 'NOT_JOIN', name: i18n.t('未参加')},
    {code: 'PENDING', name: i18n.t('待审核')},
    {code: 'PASS', name: i18n.t('已通过')},
    {code: 'REFUSED', name: i18n.t('已拒绝')}
]);

// 来源枚举
const FACE_ORIGIN_ENUM = new EsEnum([
    {code: 'APPOINT_FACE', name: i18n.t('面授指定')},
    {code: 'APPOINT_ENROLL', name: i18n.t('报名指定')},
    {code: 'OUTER_JOIN', name: i18n.t('外部参与')}
]);

// 学习项目申请类型
const PROJECT_APPLY_STATUS_ENUM = new EsEnum([
    {code: 'APPROVING', name: i18n.t('待审核')},
    {code: 'ENABLED', name: i18n.t('已通过')},
    {code: 'DISABLED', name: i18n.t('已拒绝')}
]);

// 学习项目来源
const PROJECT_SOURCE_ENUM = new EsEnum([
    {code: 'INNER_ASSIGN', name: i18n.t('内部指定')},
    {code: 'OUTER_ASSIGN', name: i18n.t('外部指定')},
    {code: 'INNER_ENROLL', name: i18n.t('内部报名')},
    {code: 'OUTER_ENROLL', name: i18n.t('外部报名')}
]);

// 能量石事项
const STONE_SOURCE_ENUM = new EsEnum([
    // {code: "EXAM", name: i18n.t("考试")},
    // {code: "SIGN", name: i18n.t("签到")},
    // {code: "WORK", name: i18n.t("作业")},
    // {code: "ACTIVITY", name: i18n.t("活动")},
    {code: 'FACE_COURSE', name: i18n.t('面授课')},
    {code: 'ONLINE_COURSE', name: i18n.t('在线课')}
]);

// 能量石变更类型
const STONE_MODIFY_TYPE_ENUM = new EsEnum([
    {code: 'UP', name: i18n.t('增加')},
    {code: 'DOWN', name: i18n.t('减少')}
]);

export {
    ACTIVITY_STATUS_ENUM,
    PROJECT_STATUS_ENUM,
    HOMEWORK_STATUS_ENUM,
    HOMEWORK_TYPE_EDIT_ENUM,
    HOMEWORK_TYPE_ENUM,
    HOMEWORK_FINISH_ENUM,
    HOMEWORK_USER_TYPE_ENUM,
    SIGN_STATUS_ENUM,
    FACE_STATUS_ENUM,
    FACE_USER_TYPE_ENUM,
    SIGN_ORIGIN_ENUM,
    SIGNING_IN_ENUM,
    ABSENCE_TYPE_ENUM,
    APPLY_STATUS_ENUM,
    SET_CHECK_CONDITION,
    SCORE_CHANGE_TYPE_ENUM,
    SOURCE_ENUM,
    STONE_TYPE_ENUM,
    STONE_WAY_ENUM,
    ENROLL_APPLY_STATUS_ENUM,
    FACE_ORIGIN_ENUM,
    PROJECT_APPLY_STATUS_ENUM,
    PROJECT_SOURCE_ENUM,
    STONE_MODIFY_TYPE_ENUM,
    STONE_SOURCE_ENUM
};
