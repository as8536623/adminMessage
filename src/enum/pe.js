/**
 * PE相关枚举
 * @author yuqiusuo
 * @date 2020-8-25
 */
import i18n from '@/lang';
import EsEnum from './EsEnum';

// 防作弊
const ANTIFAKE_TYPE_ENUM = new EsEnum([
    // { code: 'QR', name: i18n.t('动态二维码') },
    {code: 'LOCATION', name: i18n.t('获取地理位置')},
    {code: 'IMAGE', name: i18n.t('拍摄照片')}
]);

// 考核结果
const CHECK_RESULT_ENUM = new EsEnum([
    {code: 'PASS', name: i18n.t('通过')},
    {code: 'MANUAL_PASS', name: i18n.t('通过手动')},
    {code: 'REFUSED', name: i18n.t('未通过')},
    {code: 'MANUAL_REFUSED', name: i18n.t('未通过手动')}
]);

// 试题状态
const TEST_STATUS_ENUM = new EsEnum([
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'DISABLED', name: i18n.t('停用')}
]);

// 试题类型
const TEST_QUESTION_TYPE_ENUM = new EsEnum([
    {code: 'SINGLE_SELECTION', name: i18n.t('单选题')},
    {code: 'MULTI_SELECTION', name: i18n.t('多选题')},
    {code: 'INDEFINITE_SELECTION', name: i18n.t('不定项选择题')},
    {code: 'JUDGMENT', name: i18n.t('判断题')},
    {code: 'FILL', name: i18n.t('填空题')},
    {code: 'QUESTIONS', name: i18n.t('问答题')}
]);

// 客观题试题类型
const TEST_QUESTION_TYPE_OBJECTIVE_ENUM = new EsEnum([
    {code: 'SINGLE_SELECTION', name: i18n.t('单选题')},
    {code: 'MULTI_SELECTION', name: i18n.t('多选题')},
    {code: 'INDEFINITE_SELECTION', name: i18n.t('不定项选择题')},
    {code: 'JUDGMENT', name: i18n.t('判断题')}
]);

// 试题难度
const TEST_QUESTION_LEVEL_ENUM = new EsEnum([
    {code: 'SIMPLE', name: i18n.t('简单')},
    {code: 'RELATIVELY_SIMPLE', name: i18n.t('较简单')},
    {code: 'MEDIUM', name: i18n.t('中等')},
    {code: 'MORE_DIFFICULT', name: i18n.t('较难')},
    {code: 'DIFFICULT', name: i18n.t('困难')}
]);

// 试题属性
const TEST_ATTRIBUTE_ENUM = new EsEnum([
    {code: 'EXAM', name: i18n.t('考试专用')},
    // { code: 'EXERCISE', name: i18n.t('练习专用') },
    {code: 'EXAMEXERCISE', name: i18n.t('通用')}
]);

// 试卷类型
const TEST_PAPER_TYPE_ENUM = new EsEnum([
    {code: 'FIXED', name: i18n.t('固定卷')},
    {code: 'RANDOM', name: i18n.t('随机卷')}
]);

// 试卷状态
const TEST_PAPER_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'CANCEL', name: i18n.t('已作废')}
]);

// 考试类型
const EXAM_TYPE_ENUM = new EsEnum([
    {code: 'ONLINE', name: i18n.t('线上')},
    {code: 'OFFLINE', name: i18n.t('线下')},
    {code: 'COMPREHENSIVE', name: i18n.t('综合')}
]);

// 试题状态
const EXERCISE_TEST_STATUS_ENUM = new EsEnum([
    {code: 'ENABLED', name: i18n.t('启用')},
    {code: 'DISABLED', name: i18n.t('停用')},
    {code: 'FINISHED', name: i18n.t('已结束')}
]);

// 考试评分规则 Scoring Rules
const SCORING_RULES_ENUM = new EsEnum([
    {
        code: 'LESS_SELECT_NO_SCORE',
        name: i18n.t('选对得满分，选错或少选不得分')
    },
    {
        code: 'LESS_SELECT_SCORE_HALF',
        name: i18n.t('选对得满分，选错不得分，少选得一半分')
    },
    {
        code: 'LESS_SELECT_SCORE_RATE',
        name: i18n.t('选对得满分，选错不得分，少选按比例得分')
    }
]);
// 考试权限设置
const EXAM_AUTH_SETTING_ENUM = new EsEnum([
    {code: 'NO_SEE', name: i18n.t('不允许考生查看答卷')},
    {
        code: 'SEE_PAPER_NO_ANSWER',
        name: i18n.t('允许考生查看答卷，但不允许查看正确答案')
    },
    {
        code: 'JUDGE_AND_SEE_ALL',
        name: i18n.t('评卷后允许考生查看答卷和正确答案')
    },
    {
        code: 'SEE_ERROR_NO_ANSWER',
        name: i18n.t('只允许考生查看答错的试题，且不显示正确答案')
    },
    {
        code: 'SEE_ERROR_AND_ANSWER',
        name: i18n.t('只允许考生查看答错的试题，同时显示正确答案')
    }
]);

// 排行榜显示设置
const RANKING_LIST_SHOW_SETTING_ENUM = new EsEnum([
    {code: 'NO_SHOW', name: i18n.t('不显示考试排名')},
    {code: 'SHOW_FIRST', name: i18n.t('显示首次考试的排名')},
    {code: 'SHOW_MAX', name: i18n.t('显示最高成绩的排名')}
]);

// 排行榜发布设置
const RANKING_LIST_PUBLISH_ENUM = new EsEnum([
    {code: 'SHOW_END', name: i18n.t('成绩发布且考试结束后显示考试排名')},
    {code: 'SHOW_MARK', name: i18n.t('成绩发布后显示考试排名')}
]);

// 成绩发布设置
const RESULT_PUBLISH_SETTING_ENUM = new EsEnum([
    {code: 'JUDGED_AUTO_PUBLISH', name: i18n.t('评卷后自动发布成绩')},
    {code: 'MANUAL', name: i18n.t('手动发布')},
    {
        code: 'JUDGED_ALL_AND_EXAM_END',
        name: i18n.t('考试结束且完成评卷后发布成绩')
    }
]);

// 评卷策略 Marking Strategy
const MARKING_STRATEGY_ENUM = new EsEnum([
    {code: 'AUTO_JUDGE', name: i18n.t('自动评卷')},
    {code: 'MANUAL_JUDGE_PAPER', name: i18n.t('人工评卷')}
]);

// 补考设置
const MAKE_UP_SETTING_ENUM = new EsEnum([
    {code: 'NO_MAKEUP', name: i18n.t('不允许补考')},
    {code: 'AUTO_MAKEUP', name: i18n.t('自动安排补考')},
    {code: 'MANUAL_MAKEUP', name: i18n.t('手动安排补考')}
]);

// 答题模式Answer Model
const ANSWER_MODEL_ENUM = new EsEnum([
    {code: 'ALL', name: i18n.t('整卷模式')},
    {code: 'EVERY', name: i18n.t('逐题模式')}
]);

// 考试-人员提交状态
const EXAM_USER_TYPE_ENUM = new EsEnum([
    {code: 'NO_ANSWER', name: i18n.t('未作答')},
    {code: 'ANSWERING', name: i18n.t('答题中')},
    {code: 'SUBMIT_EXAM', name: i18n.t('已交卷')}
]);

// 考试-状态
const EXAM_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    {code: 'NOT_STARTED', name: i18n.t('未开始')},
    {code: 'PROGRESSING', name: i18n.t('进行中')},
    {code: 'FINISHED', name: i18n.t('已结束')},
    {code: 'DISABLED', name: i18n.t('已停用')}
]);

// 考试状态
const EXAMINATION_STATUS_ENUM = new EsEnum([
    {code: 'DRAFT', name: i18n.t('草稿')},
    // { code: 'ENABLED', name: i18n.t('已启用') },
    {code: 'NO_START', name: i18n.t('未开始')},
    {code: 'PROCESS', name: i18n.t('考试中')},
    {code: 'OVER', name: i18n.t('已结束')},
    {code: 'CANCEL', name: i18n.t('已作废')}
]);

// 试题难度
const TEST_QUESTION_LEVEL_VALUE_ENUM = new EsEnum([
    {code: 'SIMPLE', name: 1},
    {code: 'RELATIVELY_SIMPLE', name: 2},
    {code: 'MEDIUM', name: 3},
    {code: 'MORE_DIFFICULT', name: 4},
    {code: 'DIFFICULT', name: 5}
]);

// 成绩状态
const RESULT_STATUS_ENUM = new EsEnum([
    {code: 'PASS', name: i18n.t('通过')},
    {code: 'NO_PASS', name: i18n.t('未通过')},
    {code: 'MISS_EXAM', name: i18n.t('缺考')},
    {code: 'MARKING', name: i18n.t('评卷中')}
]);

export {
    ANTIFAKE_TYPE_ENUM,
    CHECK_RESULT_ENUM,
    TEST_STATUS_ENUM,
    TEST_QUESTION_TYPE_ENUM,
    TEST_QUESTION_TYPE_OBJECTIVE_ENUM,
    TEST_QUESTION_LEVEL_ENUM,
    TEST_ATTRIBUTE_ENUM,
    TEST_PAPER_TYPE_ENUM,
    TEST_PAPER_STATUS_ENUM,
    EXAM_TYPE_ENUM,
    EXERCISE_TEST_STATUS_ENUM,
    SCORING_RULES_ENUM,
    EXAM_AUTH_SETTING_ENUM,
    RANKING_LIST_PUBLISH_ENUM,
    RANKING_LIST_SHOW_SETTING_ENUM,
    RESULT_PUBLISH_SETTING_ENUM,
    MARKING_STRATEGY_ENUM,
    MAKE_UP_SETTING_ENUM,
    ANSWER_MODEL_ENUM,
    EXAM_USER_TYPE_ENUM,
    EXAM_STATUS_ENUM,
    EXAMINATION_STATUS_ENUM,
    TEST_QUESTION_LEVEL_VALUE_ENUM,
    RESULT_STATUS_ENUM
};
