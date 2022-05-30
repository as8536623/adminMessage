<style scoped lang="scss">
    @import "../index.scss";
</style>

<template>
    <div class="task__item course">
        <svg-icon icon-class="task_course" class="task__type__icon"/>
        <div class="task__type">{{ $t('在线课') }}</div>
        <div class="task__name" :title="task.relResourceName">
            <span v-if="task.relType === 'OPTIONAL_ONLINE_COURSE'" class="optional">[{{ $t('选修') }}]</span>
            <span>{{ task.taskInfo.name }}</span>
        </div>
        <div class="task__info">
            <div class="task__score">
                <span>{{ $t('学时') }}</span>
                <span>{{ task.taskInfo.coursePeriod }}</span>
            </div>
            <div class="task__score">
                <span>{{ $t('学分') }}</span>
                <span>{{ task.taskInfo.courseScore }}</span>
            </div>
        </div>
        <div class="task__status">
            <div>
                <span>{{ $t('已完成') }}</span>
                <span>{{ task.taskInfo.courseStudyPercent }}%</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TaskCourse',
        props: {
            task: {
                type: Object,
                default() {
                    return {
                        name: '',
                        relType: '', // 任务类型
                        relId: '', // 任务资源id
                        courseTime: '', // 在线课或面授课的学时
                        courseScore: '', // 在线课或面授课的学分
                        relResourceStartAt: '', // 非课程类的开始时间
                        relResourceEndAt: '', // 非课程类的结束时间
                        stoneNum: 0 // 能量石数量
                    };
                }
            }
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {}
    };
</script>
