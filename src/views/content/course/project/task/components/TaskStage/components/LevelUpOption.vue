<style lang="scss" src="./style.scss">
</style>

<template>
    <el-dialog
        v-if="dialogVisible"
        append-to-body
        :title="$t('阶段升级条件')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="600px"
    >
        <section class="dialog__form__container">
            <el-form ref="listQuery" :model="listQuery" label-width="100px">
                <el-form-item :label="$t('必修课')">
                    {{ $t('总计获得') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upRequireCourse"
                        :min="0"
                        :max="stage.maxStage.upRequireCourse"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upRequireCourse }}
                    </span>
                    /{{ stage.maxStage.upRequireCourse }}&nbsp;&nbsp;{{ $t('学分') }}
                </el-form-item>
                <el-form-item :label="$t('选修课')">
                    {{ $t('总计获得') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upOptionalCourse"
                        :min="0"
                        :max="stage.maxStage.upOptionalCourse"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upOptionalCourse }}
                    </span>
                    /{{ stage.maxStage.upOptionalCourse }}&nbsp;&nbsp;{{ $t('学分') }}
                </el-form-item>
                <el-form-item v-if="false" :label="$t('签到')">
                    {{ $t('总计签到') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upSign"
                        :min="0"
                        :max="stage.maxStage.upSign"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upSign }}
                    </span>
                    /{{ stage.maxStage.upSign }}&nbsp;&nbsp;{{ $t('次') }}
                </el-form-item>
                <el-form-item v-if="false" :label="$t('活动')">
                    {{ $t('总计参与') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upActivity"
                        :min="0"
                        :max="stage.maxStage.upActivity"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upActivity }}
                    </span>
                    /{{ stage.maxStage.upActivity }}&nbsp;&nbsp;{{ $t('次活动') }}
                </el-form-item>
                <el-form-item v-if="false" :label="$t('考试')">
                    {{ $t('总计通过') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upExam"
                        :min="0"
                        :max="stage.maxStage.upExam"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upExam }}
                    </span>
                    /{{ stage.maxStage.upExam }}&nbsp;&nbsp;{{ $t('次考试') }}
                </el-form-item>
                <el-form-item v-if="false" :label="$t('作业')">
                    {{ $t('总计完成') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upWork"
                        :min="0"
                        :max="stage.maxStage.upWork"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upWork }}
                    </span>
                    /{{ stage.maxStage.upWork }}&nbsp;&nbsp;{{ $t('次作业') }}
                </el-form-item>
                <el-form-item :label="$t('能量石')">
                    {{ $t('总计获得') }}&nbsp;&nbsp;
                    <el-input-number
                        v-if="!readOnly"
                        v-model="listQuery.upStone"
                        :min="0"
                        :max="stage.maxStage.upStone"
                        label="label"
                    >&nbsp;&nbsp;
                    </el-input-number>
                    <span v-else>
                        {{ listQuery.upStone }}
                    </span>
                    /{{ stage.maxStage.upStone }}&nbsp;&nbsp;{{ $t('能量石') }}
                </el-form-item>
            </el-form>
        </section>
        <div v-if="!readOnly" class="dialog__btn__line">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'LevelUpOption',
        props: {
            stage: {
                type: Object,
                default() {
                    return {
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
                }
            },
            readOnly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogVisible: false,
                listQuery: {
                    upRequireCourse: 0, // 必修课升级条件（小数）
                    upOptionalCourse: 0, // 选修课升级条件（小数）
                    upSign: 0, // 签到升级条件（整数）
                    upActivity: 0, // 活动升级条件（整数）
                    upExam: 0, // 考试升级条件（整数）
                    upWork: 0, // 作业升级条件（整数）
                    upStone: 0 // 能量石升级条件（整数）
                },
                list: [],
                total: 0,
                multiSelection: []
            };
        },
        computed: {
            ...mapGetters(['selectedIds'])
        },
        mounted() {
        },
        methods: {
            init() {
                const {upRequireCourse, upOptionalCourse, upSign, upActivity, upExam, upWork, upStone} = this.stage;
                this.listQuery = {
                    upRequireCourse, // 必修课升级条件（小数）
                    upOptionalCourse, // 选修课升级条件（小数）
                    upSign, // 签到升级条件（整数）
                    upActivity, // 活动升级条件（整数）
                    upExam, // 考试升级条件（整数）
                    upWork, // 作业升级条件（整数）
                    upStone // 能量石升级条件（整数）
                };
                const maxStageSum = {
                    upRequireCourse: 0, // 最多必修课升级条件
                    upOptionalCourse: 0, // 最多选修课升级条件
                    upSign: 0, // 最多报名升级条件
                    upActivity: 0, // 最多活动升级条件
                    upExam: 0, // 最多考试升级条件
                    upWork: 0, // 最多作业升级条件
                    upStone: 0 // 最多能量石升级条件
                };
                this.stage.stageTaskList.forEach(task => {
                    if (task.relType === 'REQUIRE_ONLINE_COURSE' ||
                        task.relType === 'REQUIRE_FACE_COURSE') {
                        maxStageSum.upRequireCourse = maxStageSum.upRequireCourse + task.courseScore;
                    } else if (task.relType === 'OPTIONAL_ONLINE_COURSE' ||
                        task.relType === 'OPTIONAL_FACE_COURSE') {
                        maxStageSum.upOptionalCourse = maxStageSum.upOptionalCourse + task.courseScore;
                    } else if (task.relType === 'ACTIVITY') {
                        maxStageSum.upActivity = maxStageSum.upActivity + 1;
                    } else if (task.relType === 'SIGN') {
                        maxStageSum.upSign = maxStageSum.upSign + 1;
                    } else if (task.relType === 'WORK') {
                        maxStageSum.upWork = maxStageSum.upWork + 1;
                    } else if (task.relType === 'EXAM') {
                        maxStageSum.upExam = maxStageSum.upExam + 1;
                    }
                    maxStageSum.upStone = maxStageSum.upStone + task.stoneNum;
                });
                this.stage.maxStage = maxStageSum;
            },
            show() {
                this.init();
                this.dialogVisible = true;
            },
            hide() {
                this.dialogVisible = false;
                this.listQuery = {
                    upRequireCourse: 0, // 必修课升级条件（小数）
                    upOptionalCourse: 0, // 选修课升级条件（小数）
                    upSign: 0, // 签到升级条件（整数）
                    upActivity: 0, // 活动升级条件（整数）
                    upExam: 0, // 考试升级条件（整数）
                    upWork: 0, // 作业升级条件（整数）
                    upStone: 0 // 能量石升级条件（整数）
                };
            },
            save() {
                for (const [key, value] of Object.entries(this.listQuery)) {
                    this.$set(this.stage, key, value);
                }
                console.log('this.stage', this.stage);
                console.log('this.listQuery', this.listQuery);
                this.hide();
            }
        }
    };
</script>
