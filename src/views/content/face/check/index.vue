<style lang="scss">
    .check-container {
        .el-form-item__label {
            &:before {
                width: 0;
                content: none;
            }
        }
        .face-container, .tool-container {
            padding: 0 !important;
        }
        padding: 20px;
    }
</style>
<template>
    <article class="app-container check-container">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('统计图表')" name="chart">
                <face-chart v-if="activeName === 'chart'"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('考核汇总')" name="summary">
                <face-summary v-if="activeName === 'summary'"/>
            </el-tab-pane>
            <el-tab-pane v-if="typeList.includes('SIGN')" :label="$t('考勤')" name="SIGN">
                <face-sign v-if="activeName === 'SIGN'"/>
            </el-tab-pane>
            <el-tab-pane v-if="typeList.includes('PE')" :label="$t('考试')" name="PE">
                <face-exam v-if="activeName === 'PE'"/>
            </el-tab-pane>
            <el-tab-pane v-if="typeList.includes('WORK')" :label="$t('作业')" name="WORK">
                <face-work v-if="activeName === 'WORK'"/>
            </el-tab-pane>
            <el-tab-pane v-if="typeList.includes('ENROLL')" :label="$t('活动')" name="ENROLL">
                <face-enroll v-if="activeName === 'ENROLL'"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('能量石')" name="energy">
                <face-stone v-if="activeName === 'energy'"/>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import FaceSummary from './summary';
    import FaceStone from './stone';
    import FaceEnroll from './enroll';
    import FaceSign from './sign';
    import FaceWork from './work';
    import FaceChart from './chart';
    import FaceExam from './exam/index';
    import {getType} from '@/api/activity';

    export default {
        name: 'FaceCourseCheck',
        components: {
            FaceSummary,
            FaceStone,
            FaceEnroll,
            FaceSign,
            FaceWork,
            FaceChart,
            FaceExam
        },
        data() {
            return {
                activeName: this.$route.query.type || 'chart',
                relId: this.$route.query.relId,
                typeList: []
            };
        },
        created() {
            this.getType();
        },
        methods: {
            getType() {
                getType(this.$route.query.relId).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.typeList = result.data ? result.data : [];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            }
        }
    };
</script>
