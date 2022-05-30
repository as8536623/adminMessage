<style lang="scss" scoped src="./style.scss"></style>

<template>
    <section class="course-info">
        {{ taskList[taskType].infoTitle }}：
        <span v-if="taskType === 'onlineCourse'" style="margin-right: 0">
            【{{ stageData.relType === 'REQUIRE_ONLINE_COURSE' ? '必修' : '选修' }}】
        </span>
        <span v-if="stageData.taskInfo && stageData.taskInfo.name">{{ stageData.taskInfo.name }}</span>
        <span v-if="stageData.taskInfo && stageData.taskInfo.score">{{ stageData.taskInfo.score }} 学分</span>
        <span v-if="stageData.taskInfo && stageData.taskInfo.period">{{ stageData.taskInfo.period }} 学时</span>
        <span v-if="stageData.stoneNum">{{ stageData.stoneNum }} 能量石</span>
    </section>
</template>

<script>
    import {taskList} from '../../data';

    export default {
        name: 'TaskInfo',
        props: {
            taskType: {
                type: String,
                default: ''
            },
            stageData: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        data() {
            return {
                taskList
            };
        }
    };
</script>
