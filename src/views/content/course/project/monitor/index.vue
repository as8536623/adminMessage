<style lang="scss" scoped>
    @import "style.scss";
</style>

<template>
    <article class="app-container project-monitor-container">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('项目汇总')" name="summary">
                <project-summary
                    v-if="activeName === 'summary'"
                    :id="id"
                />
            </el-tab-pane>
            <el-tab-pane v-if="false" :label="$t('考勤')" name="sign">
                考勤
            </el-tab-pane>
            <el-tab-pane v-if="false" :label="$t('考试')" name="exam">
                考试
            </el-tab-pane>
            <el-tab-pane v-if="false" :label="$t('作业')" name="work">
                作业
            </el-tab-pane>
            <el-tab-pane v-if="false" :label="$t('活动')" name="activity">
                活动
            </el-tab-pane>
            <el-tab-pane v-if="false" :label="$t('面授课')" name="faceCourse">
                面授课
            </el-tab-pane>
            <el-tab-pane :label="$t('在线课')" name="onlineCourse">
                <online-course
                    v-if="activeName === 'onlineCourse'"
                    :id="id"
                    :task-type="activeName"
                />
            </el-tab-pane>
            <el-tab-pane :label="$t('能量石')" name="stone">
                <stone
                    v-if="activeName === 'stone'"
                    :id="id"
                />
            </el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
    import projectSummary from './components/Summary';
    import onlineCourse from './components/Online';
    import stone from './components/Stone';
    import {taskList} from './data';

    export default {
        name: 'ProjectMonitor',
        components: {
            projectSummary,
            onlineCourse,
            stone
        },
        data() {
            return {
                taskList,
                activeName: this.$route.query.activeName || 'summary',
                id: this.$route.query.id
            };
        }
    };
</script>
