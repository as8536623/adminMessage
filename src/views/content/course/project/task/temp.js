const STAGE_TEMP = {
    name: '', // 阶段名称
    limitDay: '', // 周期型项目，限制天数
    startAt: '', // 时间段型，阶段开始时间
    endAt: '', // 时间段型，阶段结束时间
    upRequireCourse: 0, // 必修课升级条件（小数）
    upOptionalCourse: 0, // 选修课升级条件（小数）
    upSign: 0, // 签到升级条件（整数）
    upActivity: 0, // 活动升级条件（整数）
    upExam: 0, // 考试升级条件（整数）
    upWork: 0, // 作业升级条件（整数）
    upStone: 0, // 能量石升级条件（整数）
    maxStage: {
        upRequireCourse: 0, // 最多必修课升级条件
        upOptionalCourse: 0, // 最多选修课升级条件
        upSign: 0, // 最多报名升级条件
        upActivity: 0, // 最多活动升级条件
        upExam: 0, // 最多考试升级条件
        upWork: 0, // 最多作业升级条件
        upStone: 0 // 最多能量石升级条件
    },
    stageTaskList: [] // 任务列表
};

/**
 * relType
 * REQUIRE_ONLINE_COURSE 必修在线课
 * OPTIONAL_ONLINE_COURSE 选修在线课
 * REQUIRE_FACE_COURSE 必修面授课
 * OPTIONAL_FACE_COURSE 选修面授课
 * SIGN 签到
 * ACTIVITY 活动
 * WORK 作业
 * EXAM 考试
 */
const TASK_TEMP = {
    relType: '', // 任务类型
    relId: '', // 任务资源id
    courseScore: '', // 在线课或面授课的学分
    relResourceStartAt: '', // 非课程类的开始时间
    relResourceEndAt: '', // 非课程类的结束时间
    stoneNum: 0
};

export {STAGE_TEMP, TASK_TEMP};
