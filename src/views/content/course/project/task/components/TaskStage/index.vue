<style lang="scss" src="./style.scss">
</style>

<template>
    <section class="task__stage" :class="{'fold': fold}">
        <div class="stage__info" @click="handleFolding">
            <div class="stage__arrow__wrapper" :class="{'unfold': !fold}">
                <svg-icon icon-class="arrow_r" class-name="stage__arrow"/>
            </div>
            <div class="stage__name" :title="stage.name">{{ stage.name }}</div>
            <div class="stage__time__range">
                {{ formatTime(stage.startAt) }} - {{ formatTime(stage.endAt) }}
            </div>
            <div class="stage__opts">
                <el-tooltip :content="readOnly?$t('查看升级条件'):$t('设置升级条件')" placement="top">
                    <div @click.stop="handleUpgrade()">
                        <svg-icon icon-class="system" class-name="stage__icon"/>
                    </div>
                </el-tooltip>
                <el-tooltip v-if="!readOnly" :content="$t('新增阶段')" placement="top">
                    <div @click.stop="handleOpt('add')">
                        <svg-icon icon-class="add_s" class-name="stage__icon"/>
                    </div>
                </el-tooltip>
                <el-tooltip v-if="!readOnly" :content="$t('编辑')" placement="top">
                    <div @click.stop="handleOpt('edit')">
                        <svg-icon icon-class="edit" class-name="stage__icon"/>
                    </div>
                </el-tooltip>
                <el-tooltip v-if="!readOnly" :content="$t('删除')" placement="top">
                    <div @click.stop="handleOpt('delete')">
                        <svg-icon icon-class="delete" class-name="stage__icon"/>
                    </div>
                </el-tooltip>
            </div>
        </div>
        <div v-if="!readOnly" class="stage__task__opts">
            <div class="task__opts__label">新增任务：</div>
            <el-button
                v-for="(type, idx) in types"
                :key="idx"
                type="primary"
                icon="el-icon-plus"
                @click="handleCommand(type.code)"
            >
                {{ type.name }}
            </el-button>
        </div>
        <div class="stage__task__list">
            <div v-for="(task, idx) in stage.stageTaskList" :key="idx" class="task__line">
                <task-course
                    v-if="task.relType === 'REQUIRE_ONLINE_COURSE' || task.relType === 'OPTIONAL_ONLINE_COURSE'"
                    :task="task"
                    :read-only="readOnly"
                    @delete="deleteTask(idx)"
                />
            </div>
        </div>
        <course-selector ref="course" @select="selectTask"/>
        <face-course-selector ref="face"/>
        <level-up-option ref="level" :stage="stage" :read-only="readOnly"/>
    </section>
</template>

<script>
    import moment from 'moment';
    import {types} from './types';
    import CourseSelector from './components/CourseSelector';
    import FaceCourseSelector from './components/FaceCourseSelector';
    import TaskCourse from '../TaskItem/TaskCourse';
    import LevelUpOption from './components/LevelUpOption';

    export default {
        name: 'TaskStage',
        components: {
            CourseSelector,
            TaskCourse,
            FaceCourseSelector,
            LevelUpOption
        },
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
            index: {
                type: [String, Number],
                default: ''
            },
            readOnly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                types,
                fold: false,
                key: null
            };
        },
        mounted() {
        },
        methods: {
            // 折叠收起
            handleFolding() {
                this.fold = !this.fold;
            },
            // 格式化时间
            formatTime(time) {
                return moment(time).format('YYYY-MM-DD HH:mm');
            },
            handleCommand(command) {
                this.$refs[command].show();
            },
            selectTask(arr) {
                let list = this.stage.stageTaskList;
                list = list.concat(arr);
                this.$set(this.stage, 'stageTaskList', list);
                console.log('arr', arr);
                console.log('stageTaskList', this.stage.stageTaskList);
                this.$emit('refresh');
            },
            handleOpt(type, event) {
                switch (type) {
                    case 'add':
                        this.$emit('add', this.index);
                        break;
                    case 'edit':
                        this.$emit('edit', this.index);
                        break;
                    case 'delete':
                        this.$emit('delete', this.index);
                        break;
                }
            },
            deleteTask(index) {
                this.stage.stageTaskList.splice(index, 1);
                this.$emit('refresh');
            },
            handleUpgrade() {
                this.$refs.level.show();
            }
        }
    };
</script>
